import { db } from "../app.js";

export default {
  async getLogs(req, res) {
    try {
      res.json({
        success: true,
        data: await db.getSenorData(req.params["room"], req.params["sensor"])
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: `An unknown error occurred: ${e}`,
      });
    }
  },
};
