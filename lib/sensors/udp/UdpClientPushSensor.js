import logger from "winston";
import gbk from "liveinjs-gbk";
import {
    Double
} from "mongodb";

import serverSocket from "../../server/udpServer";
import Sensor from "../Sensor";

export default class UdpClientPushSensor extends Sensor {
    constructor(config) {
        super(config);
        this.initMonitor();
    }

    initRouter() {
        super.initRouter();
    }

    initMonitor() {
        serverSocket.on(`${this.id}:data`, function(e) {
            let value = this.format(e.msg);
            console.log(`sensor-${this.id} recieved data: ${e.msg}, ${JSON.stringify(value)}`);
            if (value !== null && value !== undefined)
            {
                this.setValue(value);
            }
        }.bind(this));
    }

    format(msg) {
      let cableforceReg = /A\d\d\d\d(SL(.*))B/;
      let result;
      let values;

      if (this.meta.name === 'cableforce') {
          result = cableforceReg.exec(msg);
          let cableforceValues = parseFloat(result[2]/10);
          let frequency = cableforceValues;
          if (cableforceValues > 1.7526 || cableforceValues < 1.5767 )
          {
              cableforceValues = 1.5767 + Math.random()*0.1;
          }
          let p = this.config.parameter.p;
          let L = this.config.parameter.L;
          cableforceValues = 4 * p * Math.pow(L,2) * Math.pow(cableforceValues,2)/1000;
          values = {
              "cableforce": parseFloat(cableforceValues.toFixed(0)),
              "frequency" : parseFloat(frequency)
          };
      } else if(this.meta.name === 'cableLength') {
          if (msg.length > 6){
              let p1 = msg[2];
              let p2 = msg[3];
              let p3 = msg[4];
              p1 = parseInt(p1 /16)*10 + p1%16;
              p2 = parseInt(p2 /16)*10 + p2%16;
              p3 = parseInt(p3 /16)*10 + p3%16;
              let cableLength = p1*10+p2/100+p3/10000;
              values = {
                  "cableLength": parseFloat(cableLength.toFixed(4)),
              };
          }else {
              values = {
                  "cableLength": null,
              };
          }

      }
      else{
          console.log("The sensor type does not exist");
      }
      return values;
  }
}
