import logger from "winston";
import dgram from "dgram";
import events from "events";
import dtu from "../util/dtu.js";

class ServerSocket extends events.EventEmitter
{
    constructor()
    {
        super();

        this._udpServer = dgram.createSocket('udp4');
        this._udpServer.on('message', function (msg)
        {
            let j = 0;
            for (let i = 0;i <=msg.length;i++)
            {
                if (msg[i] == dtu[0].msgEnd[0] && msg[i+1] == dtu[0].msgEnd[1]) {
                    let data = msg.slice(j, i+2);
                    j = i+2;
                    if(data[0] == dtu[0].msgStart[0]){
                        let sensorId = this.getSensorId(data);
                        console.log(`${sensorId}: recv %s(%d bytes) `, data, data.length);
                        this.emit(`${sensorId}:data`, {id: sensorId, msg: data});
                    }else if(data[1] == dtu[1].msgStart[0]){
                        let sensorId = dtu[1].sensorId;
                        console.log(`${sensorId}: recv %s(%d bytes) `, data, data.length);
                        this.emit(`${sensorId}:data`, {id: sensorId, msg: data});
                    }

                }
            }
        }.bind(this));

        this._udpServer.on('error', function (err)
        {
            console.log('error, msg - %s, stack - %s', err.message, err.stack);
        }.bind(this));

        this._udpServer.on('listening', function ()
        {
            console.log('udp server is listening on port ' + dtu[0].port);
        }.bind(this));

        this._udpServer.bind(dtu[0].port);
    }

    getSensorId(message)
    {
        return message.slice(1, 5);
    }

}

export default new ServerSocket();
