export default [
    {
        id:"01",
        type: "udp",
        port:"5601",
        sensorTypes:["05"],
        msgStart:[65],
        msgEnd:[13,10]
    },
    {
        id:"02",
        type: "udp",
        port:"5601",
        sensorTypes:["06"],
        sensorId:"0601",
        msgStart:[1],
        msgEnd:[13,10]
    }
];