import sensors from "../sensors";
import express from "express";
import getHistoryAll from "../analytics/history/getHistoryAll";
import getHistory from "../analytics/history/getHistory";
const router = express.Router();

function getSensorsMeta()
{
    const sensorMetas = sensors.getSensorsMeta();
    const result = {};
    for (let meta of sensorMetas)
    {
        result[meta.id] = meta;
    }
    return result;
}

function getSensors() {
    let result = {};
    let s = sensors.getSensors();

    for (let i = 0; i < s.length; i++) {
        if (s[i] === undefined) {
            break;
        } else {
            let sensor = s[i];
            let metaId = sensor.meta.id;

            if (result[metaId] === null || result[metaId] === undefined) {
                result[metaId] = [];
            }
            result[metaId].push(sensor);
        }

    }
    return result;
}

router.get('/sensors/meta', (req, res) => {
  res.send(getSensorsMeta());
});

router.get("/sensors/data", (req, res) => {
    let s = getSensors();
    let typeParam = req.query.type;
    let result = {};
    if (typeParam === null || typeParam === undefined || typeParam === '')
    {
        for (let type in s)
        {
            result[type] = s[type].map(item => {
                return {
                  id: item.id,
                  name: item.name,
                  meta: item.meta.id
                };
            });
            result[type] = result[type].sort(compare("id"));
        }

    }
    else {
      result = s[typeParam].map(item => {
          return {
            id: item.id,
            name: item.name,
            meta: item.meta.id
          };
      });
      result = result.sort(compare("id"));
    }
    res.send(result);
});

function compare(propertyName) {
    return function (object1, object2) {
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        if (value1 < value2) {
            return -1;
        } else if (value1 > value2) {
            return 1;
        } else {
            return 0;
        }
    }
}
router.post("/sensors/data/stats", postSensorStatsHandler);


async function postSensorStatsHandler(req, res)
{
    const reqSensors = JSON.parse(req.body.sensors);
    const from = req.body.from;
    const to = req.body.to;
    let result = await getSensorStats(reqSensors, from, to);
    res.send(result);
}

async function getSensorStats(sensorIds, from, to)
{
    let result = {};
    const s = sensors.getSensors();
    for (let sensorId of sensorIds)
    {
        let i = await s[sensorId].storage.queryStats(new Date(from), new Date(to));
        result[sensorId] = i;
    }
    return result;
}

router.get("/sensors/history", getSensorHistory);

async function getSensorHistory(req, res) {
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);
    const sensorId = req.query.sensorId;
    let result = await getHistory(from, to, sensorId);
    res.send(result);
}

router.get("/sensors/history/all", getSensorHistoryAll);

async function getSensorHistoryAll(req, res) {
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);
    const sensorId = req.query.sensorId;
    let result = await getHistoryAll(from, to, sensorId);
    res.send(result);
}
export default router;
