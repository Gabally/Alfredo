import express from "express";
import http from "http";
import { Server } from "socket.io";
import * as utils from "./utils.js";
import { DB } from "./db.js";
import * as useragent from "express-useragent";
import fetch from "node-fetch";
import * as wol from "wol";
import { RTSPStreamer } from "./rtspStream.js";
import { SonoffController } from "./SonoffController.js";
import { dataUriToBuffer } from "data-uri-to-buffer";
import Jimp from "jimp";

let config = utils.loadConfig();

const getDevice = (room ,type, device) => {
  let devices = config["rooms"][room][type];
  return devices.find(d => d.name === device);
};

const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(useragent.express());
const server = http.createServer(app);
const port = 3000 || process.env.API_PORT;

const db = new DB();

const io = new Server(server);

const streamer = new RTSPStreamer();

const sonoffs = new SonoffController("mqtt");

for (const room in config.rooms) {
  if (config.rooms[room]["sonoffs"]) {
    config.rooms[room]["sonoffs"].forEach(sn => sonoffs.addSonoff(room, sn.name, sn.mqtt));
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
  socket.on("trigger", async (room, device, type) => {
    switch(type) {
      case "buttons":
        let { url } = getDevice(room, type, device);
        try { 
          await fetch(url);
        } catch(e) {
          console.error("HTTP Trigger failed: ");
          console.error(e);
        };
        break;
      case "wol":
        let { mac } = getDevice(room, type, device);
        try { 
          wol.wake(mac, (err, res) => {
            if (err) {
              console.error("Wake-On-Lan failed: ");
              console.error(err);
            }
          });
        } catch(e) {
          console.error("Wake-On-Lan failed: ");
          console.error(e);
        };
        break;
    }
  });
  socket.on("getsensordata", (...args) => {
    
  });
});

app.get("/devices", async (req, res) => {
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

app.get("/rawconfig", (req, res) => {
  res.json(config);
});

app.post("/saveconfig", (req, res) => {
  let { config } = req.body;
  try {
    JSON.parse(config);
    utils.saveConfig(config);
    config = utils.loadConfig();
    res.json({
      success: true
    });
  } catch(e) {
    console.error("An error occurred while saving the configuration file:");
    console.error(e);
    res.status(400).json({
      success: false,
      error: "Invalid configuration (JSON error)"
    });
  }
});

app.get("/camerafeed/:room/:camera", (req, res) => {
  if (config.rooms[req.params.room] && config.rooms[req.params.room]["cameras"]) {
    let { feed } = config.rooms[req.params.room]["cameras"].find(camera => camera.name === req.params.camera);
    streamer.pipeStream(feed, res);
  } else {
    res.sendStatus(404);
  }
});

app.get("/camerastill/:room/:camera", async (req, res) => {
  try {
    if (config.rooms[req.params.room] && config.rooms[req.params.room]["cameras"]) {
      let { feed } = config.rooms[req.params.room]["cameras"].find(camera => camera.name === req.params.camera);
      let img = await utils.rtspSnapshot(feed);
      res.set("Content-Type", "image/jpeg");
      res.send(img);
    } else {
      res.sendStatus(404);
    }
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

app.post("/login", async (req, res) => {
  let { username, password }  = req.body;
  let device = `${req.useragent.browser} - ${req.useragent.os}`;
  let [token, isAdmin] = await db.authenticate(username, password, device, req.useragent.isMobile);
  if (token) {
    res.json({
      success: true,
      token: token,
      isAdmin: isAdmin
    });
  } else {
    res.json({
      success: false,
      error: "Wrong password"
    });
  }
});

app.post("/logout", async (req, res) => {
  try {
    let token  = req.headers["token"];
    await db.logout(token);
    res.json({
      success: true
    });
  } catch(e) {
    console.error(e);
    res.json({
      success: false,
      error: JSON.stringify(e)
    });
  }
});

app.get("/accounts", async (req, res) => {
  const accounts = await db.getAllAccounts();
  res.json(accounts);
});

app.get("/account", async (req, res) => {
  let token  = req.headers["token"];
  res.json(await db.getAccountInfo(token));
});

app.post("/updatepfp", async (req, res) => {
  try {
    let token  = req.headers["token"];
    let { id } = await db.getAccountInfo(token);
    let rawImage = dataUriToBuffer(req.body.img);
    if (id && rawImage) {
      let image = await Jimp.read(rawImage);
      await image.writeAsync(`./static/profiles/${id}.jpg`);
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch(e) {
    console.error(e);
    res.status(500).json({ success: false });
  }
});

server.listen(port, () => {
  console.log(`Alfredo app listening on port ${port}`);
});