import { dataUriToBuffer } from "data-uri-to-buffer";
import Jimp from "jimp";
import { db } from "../app.js";
import * as utils from "../utils.js";

export default {
  async listAccounts(req, res) {
    res.json(await db.getAllAccounts());
  },
  async getMyAccountInfo(req, res) {
    res.json(await db.getAccountInfo(req.headers["token"]));
  },
  async getAccountInfo(req, res) {
    res.json(await db.getAccountInfoByID(req.params.id));
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
  async createAccount(req, res) {
    try {
      let { username, password, mac, isAdmin } = req.body;
      if (utils.paramsAreValid([username, password, isAdmin])) {
        await db.createAccount(username, password, mac, isAdmin);
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false, error: "Missing request parameters" });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, error: "An unknow internal error occurred" });
    }
  },
  async updateAccount(req, res) {
    try {
      let { username, mac, isAdmin } = req.body;
      if (utils.paramsAreValid([req.params.id, username, isAdmin])) {
        await db.updateAccount(req.params.id, username, mac, isAdmin);
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false, error: "Missing request parameters" });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, error: "An unknow internal error occurred" });
    }
  },
  async resetAccountPassword(req, res) {
    try {
      let { password } = req.body;
      if (utils.paramsAreValid([req.params.id, password])) {
        await db.resetAccountPassword(req.params.id, password);
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false, error: "Missing request parameters for password reset" });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, error: "An unknow internal error occurred while resetting the password" });
    }
  },
  async updateAccountPassword(req, res) {
    try {
      let { oldpassword, password } = req.body;
      if (utils.paramsAreValid([oldpassword, password])) {
        let result = await db.updateAccountPassword(req.headers["token"], oldpassword, password);
        result ? res.status(200).json({ success: true }) : res.status(200).json({ success: false, error: "Wrong password" });
      } else {
        res.status(400).json({ success: false, error: "Missing request parameters for password reset" });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, error: "An unknow internal error occurred while resetting the password" });
    }
  }
};
