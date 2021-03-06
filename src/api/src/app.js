import express from "express";
import http from "http";
import { Server } from "socket.io";
import * as utils from "./utils.js";
import { DB } from "./db.js";
import * as useragent from "express-useragent";
import { SonoffController } from "./devices/SonoffController.js";
import { ambientSensorsController } from "./devices/ambientSensors.js";
import router from "./router.js";
import authenticationcheck from "./middleware/authenticationcheck.js";

export let config = utils.loadConfig();

export const reload = () => {
  config = utils.loadConfig();
};

utils.generateVAPIDKeys();

export const getDevice = (room ,type, device) => {
  let devices = config["rooms"][room][type];
  return devices.find(d => d.name === device);
};

const app = express();

app.use(express.json({ limit: "20mb" }));

app.use(useragent.express());

app.use(router);

const server = http.createServer(app);
const port = 3000 || process.env.API_PORT;

export const db = new DB();

const io = new Server(server);

const sonoffs = new SonoffController("mqtt");

for (const room in config.rooms) {
  if (config.rooms[room]["sonoffs"]) {
    config.rooms[room]["sonoffs"].forEach(sn => sonoffs.addSonoff(room, sn.name, sn.mqtt));
  }
}

const ambientSensors = new ambientSensorsController("mqtt");

for (const room in config.rooms) {
  if (config.rooms[room]["ambient_sensors"]) {
    config.rooms[room]["ambient_sensors"].forEach(s => ambientSensors.addSensor(room, s.name, s.mqtt));
  }
}

sonoffs.on("on", (room, name) => {
  io.emit("on", room, name);
});
sonoffs.on("off", (room, name) => {
  io.emit("off", room, name);
});

io.use(async (socket, next) => {
    if (socket.handshake.query.token && await db.tokenIsValid(socket.handshake.query.token)) {
      next();
    } else {
      next(new Error("Authentication error"));
    }   
}).on("connection", (socket) => {
  socket.on("on", (room, device, type) => {
    let { mqtt } = getDevice(room, type, device);
    sonoffs.turnOn(mqtt);
  });
  socket.on("off", (room, device, type) => {
    let { mqtt } = getDevice(room, type, device);
    sonoffs.turnOff(mqtt);
  });
});

app.get("/devices", authenticationcheck.headerAuth, async (req, res) => {
  let { rooms } = config;
  for (const room in rooms) {
    if (rooms[room]["sonoffs"]) {
      for (let i = 0; i < rooms[room]["sonoffs"].length; i++) {
        rooms[room]["sonoffs"][i].status = await sonoffs.querySonoff(rooms[room]["sonoffs"][i].mqtt);
      }
    }
  }
  res.json(rooms);
});

server.listen(port, () => {
  console.log(`Alfredo app listening on port ${port}`);
});