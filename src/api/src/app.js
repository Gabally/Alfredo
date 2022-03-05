import express from "express";
import http from "http";
import { Server } from "socket.io";
import * as utils from "./utils.js";

let config = utils.loadConfig();

const app = express();
app.use(express.json({ limit: "5mb" }));
const server = http.createServer(app);
const port = 3000 || process.env.API_PORT;

const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on("on", (...args) => {

  });
  socket.on("off", (...args) => {
    
  });
  socket.on("trigger", (...args) => {
    
  });
  socket.on("getsensordata", (...args) => {
    
  });
});

app.get('/', (req, res) => {
  res.send('Hello World (Api route)!')
});

app.get('/devices', (req, res) => {
  res.json(config.rooms);
});

app.post('/login', (req, res) => {
  res.json(config);
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});