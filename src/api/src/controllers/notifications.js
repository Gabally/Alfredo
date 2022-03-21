import { db } from "../app.js";
import * as utils from "../utils.js";

let keys = utils.getVAPIDKeys();

export default {
  async addNotificationSubscription(req, res) {
    try {
      let { subscription } = req.body;
      if (utils.paramsAreValid([subscription])) {
        let { id } = await db.getAccountInfo(req.headers["token"]);
        await db.addNotificationSubscription(id, subscription);
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false, error: "Missing request parameters" });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, error: "An unknow internal error occurred" });
    }
  },
  getPublicKey(req, res) {
      res.json({
          publicKey: keys.publicKey
      });
  }
};
