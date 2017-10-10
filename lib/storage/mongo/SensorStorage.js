import events from "events";
import logger from "winston";
import {
    Double
} from "mongodb";

import SensorStorage from "../SensorStorage";

export default class MongoSensorStorage extends SensorStorage {
    get collection() {
        return this._collection;
    }

    async bind(sensor) //捆绑sensor
    {
        this._sensor = sensor;
        sensor._storage = this;

        this.sensor.on("updated", this._sensor_onUpdated.bind(this));
        let collectionName = null;
        try {
            collectionName = this.sensor.config.storage.collection.name;
        } catch (err) {
            throw new Error(`Can't get the collection name of sensor "${this.sensor.name}". Check your config in section "config.storage.collection.name".`);
        }

        try {
            const conn = this.connection.internalConnection;
            this._collection = await conn.createCollection(collectionName, {
                // noPadding: true // NOTE see https://docs.mongodb.com/manual/core/mmapv1/#exact-fit-allocation
            });
        } catch (err) {
            logger.error(err);
            throw new Error(`Error ocurs when create collection for sensor "${this.sensor.name}".`);
        }

        try {
            await this.collection.ensureIndex({
                timestamp: 1
            }, {
                unique: true
            }); //建立索引
        } catch (err) {
            logger.error(err);
            throw new Error(`Error ocurs when create index for the collection of sensor "${this.sensor.name}".`);
        }
    }


    async queryOne(time) //查询一条数据
    {
        const doc = await this._getDocumentOfTime(time);
        if (doc) {
            return doc.values[time.getMinutes()];
        } else {
            return null;
        }
    }


    async queryStats(from, to) {
        if (from * 1 > to * 1) {
            throw new Error("'To' time must be greater than 'from' time.");
        }
        const startTimestamp = _getHours(from) * 1;
        const endTimestamp = _getHours(to) * 1;
        let docs = null;

        try {
            docs = await this.collection.find({
                timestamp: {
                    $gte: startTimestamp,
                    $lte: endTimestamp
                }
            }).toArray();
        } catch (err) {
            throw err;
        }

        if (docs.length === 0) {
            return {};
        }
        const values = this.sensor.meta.values;
        let result = docs.reduce((left, right) => {
            let result = {};
            let stats = {};

            for (let key in values)
            {
                stats[key] = {};
                stats[key].max = Math.max(left.stats[key].max, right.stats[key].max);
                stats[key].min = Math.min(left.stats[key].min, right.stats[key].min);
                stats[key].total = left.stats[key].total + right.stats[key].total;
                stats[key].sum = left.stats[key].sum + right.stats[key].sum;
            }
            result.stats = stats;
            return result;
        });

        for (let key in values)
        {
            result.stats[key].avg = result.stats[key].total > 0 ? result.stats[key].sum / result.stats[key].total: 0;
        }
        return result.stats;
    }

    getValueIndex(timeslot)
    {
        const interval = this.sensor.config.meta._monitor.interval;
        const from = _getHours(timeslot);
        return Math.ceil((timeslot - from) / interval);
    }

    async query(from, to) //查询一段数据
    {
        if (from * 1 > to * 1) {
            throw new Error("'To' time must be greater than 'from' time.");
        }

        const interval = this.sensor.config.meta._monitor.interval;
        const startTimestamp = _getHours(from) * 1;
        const endTimestamp = _getHours(to) * 1;
        let docs = null;
        try {
            docs = await this.collection.find({
                timestamp: {
                    $gte: startTimestamp,
                    $lte: endTimestamp
                }
            }).toArray();
        } catch (err) {
            throw err;
        }

        if (docs.length === 0) {
            return [];
        }

        if (startTimestamp === endTimestamp) {
            // Both from and to time are in the same hour.
            return docs[0].values.slice(this.getValueIndex(from), this.getValueIndex(to) + 1);
        } else {
            let results = [];
            let startJ = 0;
            for (let i = startTimestamp; i <= endTimestamp; i += 60 * 1000 * 60) {
                let doc = null;
                for (let j = startJ; j < docs.length; j++) {
                    if (docs[j].timestamp === i) {
                        doc = docs[j];
                        startJ = j;
                        break;
                    }
                }

                if (doc === null) {
                    doc = {
                        values: this._createBlankValues()
                    };
                }

                if (i === startTimestamp) {
                    results.push(...(doc.values.slice(this.getValueIndex(from))));
                } else if (i === endTimestamp) {
                    results.push(...(doc.values.slice(0, this.getValueIndex(to) + 1)))
                } else {
                    results.push(...doc.values);
                }
            }
            return results;
        }
        return docs;
    }
    async queryTimeStamp(from, to) //查询一段数据
    {
        if (from * 1 > to * 1) {
            throw new Error("'To' time must be greater than 'from' time.");
        }

        const interval = this.sensor.config.meta._monitor.interval;
        const startTimestamp = _getHours(from) * 1;
        const endTimestamp = _getHours(to) * 1;
        let docs = null;
        try {
            docs = await this.collection.find({
                timestamp: {
                    $gte: startTimestamp,
                    $lte: endTimestamp
                }
            }).toArray();
        } catch (err) {
            throw err;
        }

        if (docs.length === 0) {
            return [];
        }
        return docs;
    }



    async _sensor_onUpdated(e) //更新数据
    {
        try {
            await this._findAndUpdateValue(
                this.sensor.lastUpdatedTime,
                this.sensor.value,
                this.sensor.id
            );
        } catch (err) {
            logger.error(err);
        }
    }


    async _findAndUpdateValue(time, rawValue, sensorid) //查找并更新值
    {

        const doc = await this._getDocumentOfTime(time, true);
        let value = this._normalizeValue(rawValue);

        if (this._sensor._meta._id === '09') {
            value.timestamp = parseInt(new Date().getTime() + "" + parseInt(Math.random()* 100));
            let set = {};
            const stats = doc.stats;
            this._updateStats(stats, rawValue);
            set["stats"] = stats;
            this.collection.update(
                {_id:doc._id},
                {"$push":
                    {"values": value}
                },
                {"$set":set}
            )
            this.collection.update(
                {_id:doc._id},
                {"$set":set}
            )
        }
        else
        {

            const blankValue = this._createBlankValue();
            const set = {};
            const interval = this.sensor.config.meta._monitor.interval;
            let timeslot;

            if (interval === 60 * 1000 ) {
                timeslot = time.getMinutes();
            } else if (interval === 10 * 60 * 1000) {
                timeslot = Math.floor(time.getMinutes() / 10);
            }else if (interval === 5000) {
                timeslot = Math.floor((time.getMinutes() * 60 + time.getSeconds()) / 5);
            }else if (interval === 15000) {
                timeslot = Math.floor((time.getMinutes() * 60 + time.getSeconds()) / 15);
            }else if (interval === 30000) {
                timeslot = Math.floor((time.getMinutes() * 60 + time.getSeconds()) / 30);
            } else if (interval === 60 * 60 * 1000) {
                timeslot = 0;
            }

            if (JSON.stringify(doc.values[timeslot]) !== JSON.stringify(blankValue)) {
                logger.warn(`- [${this.sensor.id}] Duplicated update found. This update will be ignored.`);
                return;
            } else {
                set[`values.${timeslot}`] = value;
            }

            const stats = doc.stats;
            this._updateStats(stats, rawValue);
            set["stats"] = stats;
            this.collection.updateOne({
                _id: doc._id
            }, {
                $set: set
            });
        }

    }

    async _getDocumentOfTime(time, createIfNotExists = false) {
        const timestamp = _getHours(time) * 1;
        let doc = await this.collection.findOne({
            timestamp: timestamp
        });
        if (!doc) {
            if (createIfNotExists) {
                doc = await this._insertBlankDocumentOfTimestamp(timestamp);
                return doc;
            } else {
                return null;
            }
        } else {
            return doc;
        }
    }

    async _insertBlankDocumentOfTimestamp(timestamp) //插入初始值
    {
        let doc = {};
        if (this._sensor._meta._id === '09') {
            doc = {
                timestamp,
                stats: this._createBlankStats()
            }
        } else {
            doc = {
                timestamp,
                values: this._createBlankValues(),
                stats: this._createBlankStats()
            };
        }

        await this.collection.insertOne(doc);
        return doc;
    }

    _createBlankValues() {
        const interval = this.sensor.config.meta._monitor.interval;

        if (interval === 60 * 1000 || interval === 10 * 60 * 1000 || interval === 5000 || interval === 30000 || interval === 60 * 60 * 1000) {
            const values = [];
            const size = 60 * 60 * 1000 / interval;
            for (let i = 0; i < size; i++) {
                const value = this._createBlankValue();
                values.push(value);
            }
            return values;
        } else {
            throw new Error("Monitoring interval not supported.");
        }
    }

    _createBlankValue() {
        const value = {};
        for (let key in this.sensor.meta.values) {
            const valueDesc = this.sensor.meta.values[key];
            let v = null;
            switch (valueDesc.type) {
                case "double":
                    v = new Double(Number.MIN_SAFE_INTEGER);
                    break;
                case "int":
                    v = Number.MIN_SAFE_INTEGER;
                    break;
                case "string":
                    v = Number.MIN_SAFE_INTEGER;
                    break;
                default:
                    throw new Error("Currently data type of sensor value could only be double or int.");
            }
            value[key] = v;
        }
        return value;
    }

    _normalizeValue(rawValue) {
        const value = {};
        for (let key in this.sensor.meta.values) {
            const valueDesc = this.sensor.meta.values[key];
            let v = null;
            switch (valueDesc.type) {
                case "double":
                    v = new Double(rawValue[key]);
                    break;
                case "int":
                    v = parseInt(rawValue[key]);
                    break;
                case "string":
                    v = rawValue[key];
                    break;
                default:
                    throw new Error("Currently data type of sensor value could only be double or int.");
            }
            value[key] = v;
        }
        return value;
    }

    _createBlankStats() {
        const stats = {};
        for (let key in this.sensor.meta.values) {
            const valueDesc = this.sensor.meta.values[key];
            let v = null;
            switch (valueDesc.type) {
                case "double":
                    v = {
                        max: new Double(Number.MIN_SAFE_INTEGER),
                        min: new Double(Number.MAX_SAFE_INTEGER),
                        avg: new Double(0),
                        total: 0,
                        sum: new Double(0)
                    };
                    break;
                case "int":
                    v = {
                        max: Number.MIN_SAFE_INTEGER,
                        min: Number.MAX_SAFE_INTEGER,
                        avg: new Double(0),
                        total: 0,
                        sum: 0
                    };
                    break;
                case "string":
                    v = {
                        total: 0
                    };
                    break;
                default:
                    throw new Error("Currently data type of sensor value could only be double or int.");
            }
            stats[key] = v;
        }
        return stats;
    }

    _updateStats(stats, rawValue) //更新状态信息：大小值、平均值、和
    {
        for (let key in this.sensor.meta.values) {
            const valueDesc = this.sensor.meta.values[key];
            let v = stats[key];
            v.total++;
            switch (valueDesc.type) {
                case "double":
                    if (rawValue[key] > v.max) {
                        v.max = new Double(rawValue[key]);
                    }
                    if (rawValue[key] < v.min) {
                        v.min = new Double(rawValue[key]);
                    }
                    v.sum = new Double(v.sum.valueOf() + rawValue[key]);
                    v.avg = new Double(v.sum.valueOf() / v.total);
                    break;
                case "int":
                    if (rawValue[key] > v.max) {
                        v.max = rawValue[key];
                    }
                    if (rawValue[key] < v.min) {
                        v.min = rawValue[key];
                    }
                    v.sum = v.sum + rawValue[key];
                    v.avg = new Double(v.sum / v.total);
                    break;
                case "string":
                    break;
                default:
                    throw new Error("Currently data type of sensor value could only be double or int.");
            }
        }
    }
}


function _getHours(time) {
    if (time) {
        return new Date(
            time.getFullYear(),
            time.getMonth(),
            time.getDate(),
            time.getHours());
    } else {
        return null;
    }
}
