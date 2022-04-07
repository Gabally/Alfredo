import { db } from "../app.js";
import * as utils from "../utils.js";

export default {
  async addNotificationSubscription(req, res) {
    try {
      let { subscription } = req.body;
      if (utils.paramsAreValid([subscription])) {
        res.status(200).json({ success: await db.addNotificationSubscription(req.headers["token"], subscription) });
      } else {
        res.status(400).json({ success: false, error: "Missing request parameters" });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, error: "An unknow internal error occurred" });
    }
  },
  getPublicKey(req, res) {
      let keys = utils.getVAPIDKeys();
      res.json({
          publicKey: keys.publicKey
      });
  }
};
