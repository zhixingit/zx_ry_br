//const io = require('socket.io-client');
//document.write("<script language=javascript src='/js/import.js'></script>");
//import io from 'socket.io-client';
var host = 'http://106.14.190.36:3000';//process.env['NODE_ENV'] === 'production' ? '' : 'http://localhost:3000'
// let client = {};
//
// function startMonitor(id, value, stats)
// {
//     if (!client[id])
//     {
//         client[id] = io(`${host}/api/sensor/${id}`);
//         if ($.isFunction(value))
//         {
//             client[id].on("value", value);
//         }
//
//         if ($.isFunction(stats))
//         {
//             client[id].on("stats", stats);
//         }
//
//     }
//     client[id].connect();
// }

function stopMonitor(id)
{
    if (client[id])
    {
        client[id].disconnect();
    }
}

/**
 *获取某个传感器实例在某段区间的所有监控数据
 */
 function fetchSensorData(id, from, to)
 {
    return $.ajax({
        url: host + '/api/sensor/' + id + '/data',
        dataType: 'json',
        data: {
            from: from,
            to: to
        }
    });
 }

/**
 * 根据传感器类型获取传感器列表
 */
function fetchSensors(type)
{
    return $.ajax({
        url: host + "/sensors/data",
        dataType: 'json',
        data: {
            type: type
        }
    });
}

/**
 * 获取某段时间区间内某个传感器实例的统计值
 */
function fetchSensorStats(id, from, to)
{
    var ids;
    if ($.isArray(id))
    {
        ids = id;
    }
    else {
        ids = [id];
    }
    return $.ajax({
        url: host + "/sensors/data/stats",
        dataType: 'json',
        type: 'POST',
        data: {
            sensors: JSON.stringify(ids),
            from: from,
            to: to
        }
    });
}

/**
 * 获取传感器类型
 */
function fetchSensorsMeta()
{
    return $.ajax({
        url: host + "/sensors/meta",
        dataType: 'json',
        async: false
    });
}

/**
 * 获取单个传感器的历史数据
 */
function getHistoryDate(from, to, sensorId)
{
    return $.ajax({
        url: host + "/sensors/history",
        data: {
            from: from,
            to: to,
            sensorId: sensorId,
        },
        success:function (data) {
            if (sensorId === "0501") {
                initialData1(data);
            } else if (sensorId === "0502") {
                initialData2(data);
            } else if (sensorId === "0503") {
                initialData3(data);
            } else if (sensorId === "0504") {
                initialData4(data);
            } else if (sensorId === "0601") {
                initialData5(data);
				
            } else {
                console.log("错误");
            }
        }
    });
}

/**
 * 获取某类型所有传感器的历史数据
 */
function getHistoryDateAll(from, to, sensorId)
{
    return $.ajax({
        url: host + "/sensors/history/all",
        data: {
            from: from,
            to: to,
            sensorId: sensorId,
        },
        success:function (data) {
            if (data) {
                refreshData(data);
            }
        }
    });
}

function getSensorCurrentValue(id)
{
    return $.ajax({
      url: host + "/api/sensor/" + id + "/value",
      dataType: 'json'
    });
}


// module.exports = {
//     fetchSensors,
//     fetchSensorStats,
//     fetchSensorData,
//     startMonitor,
//     stopMonitor,
//     getAnalytics,
//     fetchSensorsMeta,
//     getCorrelation,
//     addNewEvents,
//     getAllEvents,
//     getSearchTable,
//     getAlarmDate,
//     getAlarmStatistics,
//     getHistoryDate,
//     getSpecialDetail,
//     getchanged,
//     getTrafficLoad,
//     getSensorCurrentValue,
//     getTrafficAnalytic,
// };
