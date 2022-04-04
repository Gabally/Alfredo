import { config, reload } from "../app.js";
import * as utils from "../utils.js";

export default {
  getRawConfig(req, res) {
    res.json(config);
  },
  saveConfig(req, res) {
    let { config } = req.body;
    try {
      JSON.parse(config);
      utils.saveConfig(config);
      reload();
      res.json({
        success: true,
      });
    } catch (e) {
      console.error("An error occurred while saving the configuration file:");
      console.error(e);
      res.status(400).json({
        success: false,
        error: "Invalid configuration (JSON error)",
      });
    }
  },
};
