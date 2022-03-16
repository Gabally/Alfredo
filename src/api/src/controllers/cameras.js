import { RTSPStreamer } from "../devices/rtspStream.js";
import { config } from "../app.js";
import * as utils from "../utils.js";

const streamer = new RTSPStreamer();

export default {
  streamCamera(req, res) {
    if (
      config.rooms[req.params.room] &&
      config.rooms[req.params.room]["cameras"]
    ) {
      let { feed } = config.rooms[req.params.room]["cameras"].find(
        (camera) => camera.name === req.params.camera
      );
      streamer.pipeStream(feed, res);
    } else {
      res.sendStatus(404);
    }
  },
  async getStill(req, res) {
    try {
      if (
        config.rooms[req.params.room] &&
        config.rooms[req.params.room]["cameras"]
      ) {
        let { feed } = config.rooms[req.params.room]["cameras"].find(
          (camera) => camera.name === req.params.camera
        );
        let img = await utils.rtspSnapshot(feed);
        res.set("Content-Type", "image/jpeg");
        res.send(img);
      } else {
        res.sendStatus(404);
      }
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  }
};
