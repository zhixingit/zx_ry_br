export default [
    {
        id: "01", // sensor-instance-id eg: 01
        name: "sensor-01",
        desc: "摄氏温度，分辨率：0.04℃，精确度：±0.5℃，工作范围：-40~123.8℃;相对湿度，分辨率：0.05%RH，精确度：±4.5%RH，工作范围：0~100%RH.",
        meta: {
            model: {
                name: "SHT11",
                manufacturer: "Sensirion"
            },
            values: {
                temperature: {
                    type: "double",
                    unit: "degree Celsius"
                },
                humidity: {
                    type: "double",
                    unit: "percentage"
                }
            }
        },
        monitor: {
            interval: 60 * 1000,
            mode: "udp-client-push",
        },
        storage: {
            collection: {
                name: "sensor-01" // 'sensor' + sensor instance id
            }
        }
    },
    {
        "id" : "41",
        "name" : "sensor-41",
        "desc" : "采集加速度值信息，工作范围：±16g",
        "meta" : {
            "model" : {
                "name" : "MPU6050",
                "manufacturer" : "InvenSense"
            },
            "values" : {
                "x" : {
                    "type" : "double",
                    "unit" : "Gravitational acceleration"
                },
                "y" : {
                    "type" : "double",
                    "unit" : "Gravitational acceleration"
                },
                "z" : {
                    "type" : "double",
                    "unit" : "Gravitational acceleration"
                }
            }
        },
        "monitor" : {
            "interval" : 1 * 1000,
            "mode": "udp-client-push",
        },
        "storage" : {
            "collection" : {
                "name" : "sensor-41"
            }
        }
      },    
    {
        "id" : "42",
        "name" : "sensor-42",
        "desc" : "采集加速度值信息，工作范围：±16g",
        "meta" : {
            "model" : {
                "name" : "MPU6050",
                "manufacturer" : "InvenSense"
            },
            "values" : {
                "x" : {
                    "type" : "double",
                    "unit" : "Gravitational acceleration"
                },
                "y" : {
                    "type" : "double",
                    "unit" : "Gravitational acceleration"
                },
                "z" : {
                    "type" : "double",
                    "unit" : "Gravitational acceleration"
                }
            }
        },
        "monitor" : {
            "interval" : 1000,
            "mode": "udp-client-push",
        },
        "storage" : {
            "collection" : {
                "name" : "sensor-42"
            }
        }
      }
];
