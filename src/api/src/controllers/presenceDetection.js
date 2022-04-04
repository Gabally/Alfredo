import { config, db } from "../app.js";
import { paramsAreValid } from "../utils.js";
import { Router } from "../devices/tplinkRouter.js";

export default {
  async whoIsPresent(req, res) {
    if (paramsAreValid([config.router_ip, config.router_password])) {
        let people = await db.getPresenceDetectionList();
        let presence = [];
        let router = new Router(config.router_ip, config.router_password);
        let devices = await router.getDevices();
        people.forEach(p => {
            presence.push({
                name: p.username,
                present: devices.find(d => d.MACAddress === p.phone_mac) !== undefined
            });
        });
        res.status(200).json({
            success: true,
            people: presence
        });
    } else {
        res.status(404).json({
            success: false,
            error: "No router found",
        });
    }
  }
};
