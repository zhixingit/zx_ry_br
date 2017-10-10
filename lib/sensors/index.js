import logger from "winston";

import HttpClientPushSensor from "./http/HttpClientPushSensor";
import HttpServerPullSensor from "./http/HttpServerPullSensor";
import UdpClientPushSensor from "./udp/UdpClientPushSensor";

import app from "../server/app";
import storage from "../storage";
import SensorMeta from "./SensorMeta";

let sensors = null;
let sensorMetas = null;


function getSensors()
{
    return sensors;
}

function getSensorsMeta()
{
    return sensorMetas;
}


async function load()
{
    await loadSensorMeta();
    await loadSensor();
}

async function loadSensorMeta()
{
    logger.info("Loading sensor meta...");
    const conn = storage.connection.internalConnection;

    sensorMetas = await conn.collection("sensor-meta").find({}).toArray();
    logger.info("sensor meta loaded");
    let s;
    for (let i = 0; i < sensorMetas.length; i++)
    {
        let sensorMeta;

        s = sensorMetas[i];

        sensorMeta = new SensorMeta(s);

        sensorMetas[s._id] = sensorMeta

    }

}

async function loadSensor()
{
    logger.info("Loading sensors...");
    const conn = storage.connection.internalConnection;

    sensors = await conn.collection("sensor-instances").find({}).toArray();
    let s = null;
    for (let i = 0; i < sensors.length; i++)
    {
        if (sensors[i] === undefined) {
            break;
        } else {
            s = sensors[i];
            logger.info(`- [${s.id}] - ${s.name}`);
            let sensor = null;

            s.meta = sensorMetas[s.meta.oid];

            try
            {
                if (s.meta._monitor.mode === "http-server-pull")
                {
                    sensor = new HttpServerPullSensor(s);
                }
                else if (s.meta._monitor.mode === "http-client-push")
                {
                    sensor = new HttpClientPushSensor(s);
                }
                else if (s.meta._monitor.mode === "udp")
                {
                    sensor = new UdpClientPushSensor(s);
                }
                else
                {
                    throw new Error(`"${s.monitor.mode}" is not a supported sensor monitor mode. Try "http-server-pull" or "http-client-push".`);
                }
                // Setup router
                app.use("/api/sensor/" + sensor.id, sensor.router);

                // Re-map indices for sensor.
                sensors[i] = sensor;
                if (s.id)
                {
                    sensors[s.id] = sensor;
                }

            }
            catch (err)
            {
                logger.error(err);
                throw new Error(`Error ocurs when create sensor "${s.name}".`);
            }

            const sensorStorage = new storage.SensorStorage(storage.connection);

            try
            {
                await sensorStorage.bind(sensor);
            }
            catch (err)
            {
                logger.error(err);
                throw new Error(`Error ocurs when binding SensorStorage to sensor "${s.name}".`);
            }

            if (sensor.startMonitor)     //若为服务器拉模式，需要
            {
                sensor.startMonitor();
            }
        }


    }
}

export default {
  load,
  getSensors,
  getSensorsMeta
};
