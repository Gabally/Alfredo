import * as mqtt from "mqtt";
import EventEmitter from "events";

export class SonoffController extends EventEmitter {
    constructor(mqtthost) {
        super();
        this.client = mqtt.connect(`mqtt://${mqtthost}`);
        this.client.on("error", (error) => {
            console.log(error);
        });
        this.client.on("connect",  () => {
            console.log("SonoffController connected to the mqtt broker successfully"); 
        });
        this.sonoffs = [];
        this.mqttevents = {};
        this.client.on("message", (topic, message) => {
            let payload = message.toString();
            if (this.mqttevents[topic]) {
                this.mqttevents[topic].forEach(cb => cb(payload));
                delete this.mqttevents[topic];
            }
            let sonoff = this.sonoffs.find(sn => sn.statustopic === topic);
            if (sonoff) {
                if (payload === "ON") {
                    this.emit("on", sonoff.room, sonoff.name);
                } else if (payload === "OFF") {
                    this.emit("off", sonoff.room, sonoff.name);
                }
            }
        });
    }

    addSonoff(room, name, topic) {
        let sonoff = {
            room: room,
            name: name,
            statustopic: `stat/${topic}/POWER`
        };
        this.sonoffs.push(sonoff);
        this.client.subscribe(sonoff.statustopic, (err) => {
            if (err) {
                throw `Unable to add sonoff ${name} in room ${room}, ${err}`;
            }
        });
    }

    turnOn(path) {
        this.client.publish(`cmnd/${path}/POWER`, "ON");
    }

    turnOff(path) {
        this.client.publish(`cmnd/${path}/POWER`, "OFF");
    }
    
    waitForMessage(topic, cb) {
        if(!this.mqttevents[topic]) {
            this.mqttevents[topic] = [];
        }
        this.mqttevents[topic].push(cb);
    }

    async querySonoff(path) {
        return new Promise((resolve) => {
            let timeout = setTimeout(() => {
                resolve(false);
            }, 300);
            this.waitForMessage(`stat/${path}/POWER`, (data) => {
                clearTimeout(timeout);
                resolve(data === "ON");
            });
            this.client.publish(`cmnd/${path}/POWER`, " ");
        });
    }
}