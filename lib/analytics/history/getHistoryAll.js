/**
 * Created by xiong on 2016/12/30.
 */
import getSensors from "./../../sensors";

async function historyall(from, to, sensorId) {
    let result = [];
    let sensor;
    let key;
    let interval;
    let data;
    let arrayTotal = [];
    let sensors = await getSensors.getSensors();

    for (let i = 0;i < sensors.length; i++) {
        if (sensors[i].meta.id === sensorId) {     
            sensor = sensors[i];
            key = Object.keys(sensor.meta.alarm)[0];
            interval = sensor.meta._monitor.interval;
            data = await sensor.storage.query(new Date(from), new Date(to));
            arrayTotal.push(data);
        }
    }

    let startTime = new Date(from).getTime();
    let startHourTime = _getHours(new Date(from)).getTime();
    let count = Math.ceil(arrayTotal[0].length / 10000);
    for (let i = 0; i < arrayTotal[0].length; i++) {
        let time = startHourTime + i * interval;
        if (time >= startTime) {
            if (i % count === 0) {
                let array = [];
                array.push(time);
                for( let j =0;j<arrayTotal.length; j++){
                    if (Math.abs(arrayTotal[j][i][key]) > 10000) {
                        array.push(null);
                    } else {
                        array.push(arrayTotal[j][i][key]);
                    }
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
export default historyall;
