import fetch from "node-fetch";
import * as wol from "wol";
import { getDevice } from "../app.js";

export default {
    async trigger(req, res) {
        let { room, device, type } = req.body;
        try {
            switch (type) {
                case "buttons":
                    let { url } = getDevice(room, type, device);
                    await fetch(url);
                    break;
                case "wol":
                    let { mac } = getDevice(room, type, device);
                    wol.wake(mac, (err, res) => {
                        if (err) {
                            throw err;
                        }
                    });
                    break;
            }
            res.json({
                success: true
            });
        } catch (e) {
            res.status(500).json({
                success: false,
                error: `An unknown error occurred: ${e}`,
            });
        }
    }
};
