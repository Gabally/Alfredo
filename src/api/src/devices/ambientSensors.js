import * as mqtt from "mqtt";
import { db } from "../app.js";

export class ambientSensorsController {
    constructor(mqtthost) {
        this.client = mqtt.connect(`mqtt://${mqtthost}`);
        this.client.on("error", (error) => {
            console.log(error);
        });
        this.client.on("connect",  () => {
            console.log("ambientSensorController connected to the mqtt broker successfully"); 
        });
        this.sensors = [];
        this.client.on("message", async (topic, message) => {
            let payload = message.toString();
            let sensor = this.sensors.find(s => s.logtopic === topic);
            if (sensor) {
                try {
                    let { temperature, humidity } = JSON.parse(payload);
                    console.log(`Log from ${sensor.name}, temp: ${temperature}, humidity:${humidity}`);
                    await db.addSensorDataLog(sensor.name, sensor.room, temperature, humidity);
                } catch(e) {
                    console.err(`Unable to log data for sensor ${sensor.name} in room ${sensor.room}, ${e}`);
                }
            }
        });
    }

    addSensor(room, name, topic) {
        let sensor = {
            room: room,
            name: name,
            logtopic: topic
        };
        this.sensors.push(sensor);
        this.client.subscribe(topic, (err) => {
            if (err) {
                throw `Unable to add sensor ${name} in room ${room}, ${err}`;
            }
        });
    }
}