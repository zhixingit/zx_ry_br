/**
 * 平台时间
 */

$(document).ready(function(){
    setInterval(showTime, 1000);
    function timer(obj,txt){
        obj.text(txt);
    }
    function showTime(){
        var today = new Date();
        var weekday=new Array(7);
        weekday[1]="星期一"
        weekday[2]="星期二"
        weekday[3]="星期三"
        weekday[4]="星期四"
        weekday[5]="星期五"
        weekday[6]="星期六"
        weekday[0]="星期日"
        var y=today.getFullYear()+"年";
        var month=today.getMonth()+1+"月";
        var td=today.getDate()+"日";
        var d=weekday[today.getDay()];
        var h=today.getHours();
        var m=today.getMinutes();
        var s=today.getSeconds();
        h=checkTime(h);
        m=checkTime(m);
        s=checkTime(s);
        timer($("#Y"),y);
        timer($("#MH"),month);
        timer($("#TD"),td);
        timer($("#D"),d);
        timer($("#H"),h+":");
        timer($("#M"),m+":");
        timer($("#S"),s);
    }
    function checkTime(i){
        if(i<10){
            i="0"+i;
        }
        return i;
    }
})

var data1 = [];
var data2 = [];
var data3 = [];
var data4 = [];
var data5 = [];

function initialData1(data) {
    data1 = data;
    // now = new Date(data[data.length-1][0]);
    chart1.setOption({
        series: [{
            data: data1
        }]
    });
}
function initialData2(data) {
    data2 = data;
    // now = new Date(data[data.length-1][0]);
    chart2.setOption({
        series: [{
            data: data2
        }]
    });
}
function initialData3(data) {
    data3 = data;
    // now = new Date(data[data.length-1][0]);
    chart3.setOption({
        series: [{
            data: data3
        }]
    });
}
function initialData4(data) {
    data4 = data;
    // now = new Date(data[data.length-1][0]);
    chart4.setOption({
        series: [{
            data: data4
        }]
    });
}
function initialData5(data) {
    data5 = data;
    // now = new Date(data[data.length-1][0]);
    chart5.setOption({
        series: [{
            data: data5
        }]
    });
}
function updateRealTimeData1(data) {
    let addData = [];
    addData.push(data.lastUpdatedTime);
    addData.push(data.value.cableforce);
    data1.shift();
    data1.push(addData);
    chart1.setOption({
        series: [{
            data: data1
        }]
    });
}
function updateRealTimeData2(data) {
    let addData = [];
    addData.push(data.lastUpdatedTime);
    addData.push(data.value.cableforce);
    data2.shift();
    data2.push(addData);
    chart2.setOption({
        series: [{
            data: data2
        }]
    });
}
function updateRealTimeData3(data) {
    let addData = [];
    addData.push(data.lastUpdatedTime);
    addData.push(data.value.cableforce);
    data3.shift();
    data3.push(addData);
    chart3.setOption({
        series: [{
            data: data3
        }]
    });
}
function updateRealTimeData4(data) {
    let addData = [];
    addData.push(data.lastUpdatedTime);
    addData.push(data.value.cableforce);
    data4.shift();
    data4.push(addData);
    chart4.setOption({
        series: [{
            data: data4
        }]
    });
}
function updateRealTimeData5(data) {
    let addData = [];
    addData.push(data.lastUpdatedTime);
    addData.push(data.value.cableLength);
    data5.shift();
    data5.push(addData);
    chart5.setOption({
        series: [{
            data: data5
        }]
    });
}

/**
 * 全省桥梁技术状况分类
 */
var chart1 = echarts.init(document.getElementById('RealTime_01'), 'macarons');
option1 = {
    backgroundColor:'#26263d',
    title: {
        text: '15-1#索力',
        textStyle:{
            color:'#fff',
            fontFamily:'Microsoft YaHei',
            fontSize:20
        },
        x:'left',
        padding:[10,0,0,10]
    },
    tooltip: {
        trigger: 'axis',
        formatter: function (params) {
	 if (params[0].data[0]) {
                var date = new Date(params[0].data[0]);
                return '时间 : '+ date + ' <br> ' +'测值 : '+ params[0].data[1];
            }	
        },
        axisPointer: {
            animation: false
        }
    },
    xAxis: {
        name : '时间',
        type: 'time',
        splitLine: {
            show: false
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: 'white'
            },
        },
    },
    yAxis: {
        name : '索力(KN)',
        nameLocation:'middle',
        nameGap:40,
        type: 'value',
        boundaryGap: [0, '100%'],
        splitArea:{
            show:false,
        },
        splitLine: {
            show: true,
            lineStyle:{
                color:'rgba(255,255,255,0.1)'
            }
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: 'white'
            },
        },
    },
    series: [{
        name: '索力',
        type: 'line',
        showSymbol: false,
        hoverAnimation: true,
        connectNulls:true,
        lineStyle:{
            normal:{
                color:'#5583e3'
            }
        },
        areaStyle:{
            normal:{
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(85,131,227,1)' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'rgba(85,131,227,0.2)' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                }
            }
        },
        markPoint: {
            data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
            ]
        },
        // markLine: {
        //     data: [
        //         {type: 'max', name: '最大值'},
        //         {type: 'min', name: '最小值'}
        //     ]
        // },
        data: data1
    }]
};
chart1.setOption(option1);
window.onresize = chart1.resize;

/**
 * 新桥增长趋势
 */

var chart2 = echarts.init(document.getElementById('RealTime_02'), 'macarons');
option2 = {
    title: {
        text: '15-2#索力',
        textStyle:{
            color:'#fff',
            fontFamily:'Microsoft YaHei',
            fontSize:20
        },
        x:'left',
        padding:[10,0,0,10]
    },
    tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            var date = new Date(params[0].data[0]);
            return '时间 : '+ date + ' <br> ' +'测值 : '+ params[0].data[1];
        },
        axisPointer: {
            animation: false
        }
    },
    xAxis: {
        name : '时间',
        type: 'time',
        splitLine: {
            show: false
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: 'white'
            },
        },
    },
    yAxis: {
        name : '索力(KN)',
        nameLocation:'middle',
        nameGap:40,
        type: 'value',
        boundaryGap: [0, '100%'],
        splitArea:{
            show:false,
        },
        splitLine: {
            show: true,
            lineStyle:{
                color:'rgba(255,255,255,0.1)'
            }
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: 'white'
            },
        },
    },
    series: [{
        name: '索力',
        type: 'line',
        showSymbol: false,
        hoverAnimation: true,
        connectNulls:true,
        lineStyle:{
            normal:{
                color:'#5583e3'
            }
        },
        areaStyle:{
            normal:{
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(85,131,227,1)' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'rgba(85,131,227,0.2)' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                }
            }
        },
        markPoint: {
            data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
            ]
        },
        data: data2
    }]
};

chart2.setOption(option2);
window.onresize = chart2.resize;

/**
 * 30年桥龄对比
 */
var chart3 = echarts.init(document.getElementById('RealTime_03'), 'macarons');
option3 = {
    title: {
        text: '16-1#索力',
        textStyle:{
            color:'#fff',
            fontFamily:'Microsoft YaHei',
            fontSize:20
        },
        x:'left',
        padding:[10,0,0,10]
    },
    tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            var date = new Date(params[0].data[0]);
            return '时间 : '+ date + ' <br> ' +'测值 : '+ params[0].data[1];
        },
        axisPointer: {
            animation: false
        }
    },
    xAxis: {
        name : '时间',
        type: 'time',
        splitLine: {
            show: false
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: 'white'
            },
        },
    },
    yAxis: {
        name : '索力(KN)',
        nameLocation:'middle',
        nameGap:40,
        type: 'value',
        boundaryGap: [0, '100%'],
        splitArea:{
            show:false,
        },
        splitLine: {
            show: true,
            lineStyle:{
                color:'rgba(255,255,255,0.1)'
            }
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: 'white'
            },
        },
    },
    series: [{
        name: '索力',
        type: 'line',
        showSymbol: false,
        hoverAnimation: true,
        connectNulls:true,
        lineStyle:{
            normal:{
                color:'#5583e3'
            }
        },
        areaStyle:{
            normal:{
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(85,131,227,1)' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'rgba(85,131,227,0.2)' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                }
            }
        },
        markPoint: {
            data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
            ]
        },
        data: data3
    }]
};

chart3.setOption(option3);
window.onresize = chart3.resize;

/**
 * 养护经费分布
 */
var chart4 = echarts.init(document.getElementById('RealTime_04'), 'macarons');

option4 = {
    title: {
        text: '16-2#索力',
        textStyle:{
            color:'#fff',
            fontFamily:'Microsoft YaHei',
            fontSize:20
        },
        x:'left',
        padding:[10,0,0,10]
    },
    tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            var date = new Date(params[0].data[0]);
            return '时间 : '+ date + ' <br> ' +'测值 : '+ params[0].data[1];
        },
        axisPointer: {
            animation: false
        }
    },
    xAxis: {
        name : '时间',
        type: 'time',
        splitLine: {
            show: false
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: 'white'
            },
        },
    },
    yAxis: {
        name : '索力(KN)',
        nameLocation:'middle',
        nameGap:40,
        type: 'value',
        boundaryGap: [0, '100%'],
        splitArea:{
            show:false,
        },
        splitLine: {
            show: true,
            lineStyle:{
                color:'rgba(255,255,255,0.1)'
            }
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: 'white'
            },
        },
    },
    series: [{
        name: '索力',
        type: 'line',
        showSymbol: false,
        hoverAnimation: true,
        connectNulls:true,
        lineStyle:{
            normal:{
                color:'#5583e3'
            }
        },
        areaStyle:{
            normal:{
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(85,131,227,1)' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'rgba(85,131,227,0.2)' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                }
            }
        },
        markPoint: {
            data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
            ]
        },
        data: data4
    }]
};

chart4.setOption(option4);
window.onresize = chart4.resize;

/**
 * 养护经费分布
 */
var chart5 = echarts.init(document.getElementById('RealTime_05'), 'macarons');

option5 = {
    title: {
        text: '16-1#索长',
        textStyle:{
            color:'#fff',
            fontFamily:'Microsoft YaHei',
            fontSize:20
        },
        x:'left',
        padding:[10,0,0,10]
    },
    tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            var date = new Date(params[0].data[0]);
            return '时间 : '+ date + ' <br> ' +'测值 : '+ params[0].data[1];
        },
        axisPointer: {
            animation: false
        }
    },
    xAxis: {
        name : '时间',
        type: 'time',
        splitLine: {
            show: false
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: 'white'
            },
        },
    },
    yAxis: {
        name : '索长(m)',
        nameLocation:'middle',
        nameGap:40,
        type: 'value',
        boundaryGap: [0, '100%'],
        splitArea:{
            show:false,
        },
        splitLine: {
            show: true,
            lineStyle:{
                color:'rgba(255,255,255,0.1)'
            }
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: 'white'
            },
        },
    },
    series: [{
        name: '索长',
        type: 'line',
        showSymbol: false,
        hoverAnimation: true,
        connectNulls:true,
        lineStyle:{
            normal:{
                color:'#5583e3'
            }
        },
        areaStyle:{
            normal:{
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(85,131,227,1)' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'rgba(85,131,227,0.2)' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                }
            }
        },
        markPoint: {
            data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
            ]
        },
        data: data5
    }]
};

chart5.setOption(option5);
window.onresize = chart5.resize;
