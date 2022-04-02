import { config } from "../app.js";
import { paramsAreValid } from "../utils.js";
import { Router } from "../devices/tplinkRouter.js";

export default {
  async netStatus(req, res) {
    if (config.router_ip && config.router_ip) {
    let router = new Router(config.router_ip, config.router_password);
    res.status(200).json({
        success: true,
        status: await router.getConnectionStatus()
    });
    } else {
        res.status(404).json({
            success: false,
            error: "No router found",
        });
    }
  },
  async rebootRouter(req, res) {
    if (config.router_ip && config.router_ip) {
        let router = new Router(config.router_ip, config.router_password);
        await router.reboot();
        res.status(200).json({
            success: true,
        });
    } else {
        res.status(404).json({
            success: false,
            error: "No router found",
        });
    }
  }
};
