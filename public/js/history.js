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

/**
 * 历史chart表
 */
var chart1 = echarts.init(document.getElementById('HistoryChart'), 'macarons');
option = {
    title: {
        text: '索力',
        show:false,
        textStyle:{
            color:'#fff',
            fontFamily:'Microsoft YaHei',
            fontSize:20
        },
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        textStyle:{
            color:'white'
        },
        data:['15-1#','15-2#','16-1#','16-2#']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
    },
    xAxis: {
        name:'时间',
        type: 'time',
        boundaryGap: false,
        splitLine: {
            show: false
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: 'white'
            },
        },
        // data: ['2017/05/30','2017/05/31','2017/06/01','2017/06/02','2017/06/03','2017/06/04','2017/06/05']
    },
    yAxis: {
        name:'索力(KN)',
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
        type: 'value'
    },
    series: [
        {
            name:'15-1#',
            type:'line',
            connectNulls:true,
            data:[120, 132, 101, 134, 90, 230, 210]
        },
        {
            name:'15-2#',
            type:'line',
            connectNulls:true,
            data:[220, 182, 191, 234, 290, 330, 310]
        },
        {
            name:'16-1#',
            type:'line',
            connectNulls:true,
            data:[150, 232, 201, 154, 190, 330, 410]
        },
        {
            name:'16-2#',
            type:'line',
            connectNulls:true,
            data:[320, 332, 301, 334, 390, 330, 320]
        }
    ]
};

chart1.setOption(option);
window.onresize = chart1.resize;

function refreshData(data) {

    let data11 =[];
    let data22 =[];
    let data33 =[];
    let data44 =[];

    for (let i = 0;i < data.length;i++) {
        // data[i][0] = new Date(data[i][0]).getTime();
        let data1 =[];
        let data2 =[];
        let data3 =[];
        let data4 =[];
        data1.push(new Date(data[i][0]).getTime());
        data1.push(data[i][1]);
        data2.push(new Date(data[i][0]).getTime());
        data2.push(data[i][2]);
        data3.push(new Date(data[i][0]).getTime());
        data3.push(data[i][3]);
        data4.push(new Date(data[i][0]).getTime());
        data4.push(data[i][4]);
        data11.push(data1);
        data22.push(data2);
        data33.push(data3);
        data44.push(data4);
    }
    chart1.setOption({
        dataZoom: [ {
           // startValue:data[0][0]
        },{
            type: 'inside',
            start: 94,
            end: 100
        }],
        series: [{
            data: data11
        },{
            data: data22
        },{
            data: data33
        },{
            data: data44
        }]
    });
}

var chart2 = echarts.init(document.getElementById('CableLengthHistoryChart'), 'macarons');
option2 = {
    title: {
        text: '索长',
        show:false,
        textStyle:{
            color:'#fff',
            fontFamily:'Microsoft YaHei',
            fontSize:20
        },
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        textStyle:{
            color:'white'
        },
        data:['16-1#']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
    },
    xAxis: {
        name:'时间',
        type: 'time',
        boundaryGap: false,
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
        name:'索长(m)',
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
        type: 'value'
    },
    series: [
        {
            name:'16-1#',
            type:'line',
            connectNulls:true,
            data:[120, 132, 101, 134, 90, 230, 210]
        }
    ]
};

chart2.setOption(option2);
window.onresize = chart2.resize;

function initialData5(data) {

    let data0601 =[];

    for (let i = 0;i < data.length;i++) {
        // data[i][0] = new Date(data[i][0]).getTime();
        let data1 =[];
        data1.push(new Date(data[i][0]).getTime());
        data1.push(data[i][1]);
        data0601.push(data1);
    }
    chart2.setOption({
        dataZoom: [ {
            //startValue:data[0][0]
        },{
            type: 'inside',
            start: 94,
            end: 100
        }],
        series: [{
            data: data0601
        }]
    });
}

