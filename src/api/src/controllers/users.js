import { dataUriToBuffer } from "data-uri-to-buffer";
import Jimp from "jimp";
import { db } from "../app.js";

export default {
  async listAccounts(req, res) {
    res.json(await db.getAllAccounts());
  },
  async getAccountInfo(req, res) {
    res.json(await db.getAccountInfo(req.headers["token"]));
  },
  async updateProfilePicture(req, res) {
    try {
      let token = req.headers["token"];
      let { id } = await db.getAccountInfo(token);
      let rawImage = dataUriToBuffer(req.body.img);
      if (id && rawImage) {
        let image = await Jimp.read(rawImage);
        await image.writeAsync(`./static/profiles/${id}.jpg`);
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false });
    }
  },
  async deleteLoginToken(req, res) {
    try {
      if (req.params.id) {
        let ok = await db.deleteLogin(req.params.id);
        res.status(200).json({ success: ok });
      } else {
        res.status(400).json({ success: false });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false });
    }
  },
  async deleteAccount(req, res) {
    try {
      if (req.params.id) {
        let ok = await db.deleteAccount(req.params.id);
        res.status(200).json({ success: ok });
      } else {
        res.status(400).json({ success: false });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false });
    }
  },
};
