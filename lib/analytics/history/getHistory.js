/**
 * Created by xiong on 2016/12/30.
 */
import getSensors from "./../../sensors";

async function history(from, to, sensorId) {
    let result = [];
    let sensor;
    let sensors = await getSensors.getSensors();
    for (let i = 0;i < sensors.length; i++) {
        if (sensors[i].id === sensorId) {
            sensor = sensors[i];
            break;
        }
    }
    let key = Object.keys(sensor.meta.alarm)[0];
    let interval = sensor.meta._monitor.interval;
    let data = await sensor.storage.query(new Date(from), new Date(to));
    let startTime = new Date(from).getTime();
    let startHourTime = _getHours(new Date(from)).getTime();
    let count = Math.ceil(data.length / 10000);
    for (let i = 0; i < data.length; i++) {
        let time = startTime + i * interval;
        if (time >= startTime) {
            if (i % count === 0) {
                let array = [];
                array.push(time);
                if (Math.abs(data[i][key]) > 10000) {
                    array.push(null);
                } else {
                    array.push(data[i][key]);
                }
                result.push(array);
            }
        }
    }
    return result;

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
export default history;
