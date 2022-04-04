import { config, db } from "../app.js";
import * as utils from "../utils.js";
import { writeFileSync } from "fs";
import webpush from "web-push";

export default {
  async ring(req, res) {
    let rtspurl = config["doorbell"];
    if (rtspurl) {
        let img = await utils.rtspSnapshot(rtspurl);
        utils.createDirIfNotExists("static/doorbell");
        let filename = `doorbell-snapshot-${Date.now()}.jpg`;
        writeFileSync(`static/doorbell/${filename}`, img);
        const payload = JSON.stringify({ title: "Campanello",
            body: "Qualcuno ha suonato il campanello",
            icon: `${config.external_url}/icon.png`,
            image: `${config.external_url}/static/doorbell/${filename}`,
            imgfile: `${config.external_url}/static/doorbell/${filename}`
        });
        await db.newDoorbellEvent(filename);
        let subs = await db.getNotificationSubscriptions();
        let { publicKey, privateKey } = utils.getVAPIDKeys();
        webpush.setVapidDetails(
            "mailto:example@yourdomain.org",
            publicKey,
            privateKey
        );
        subs.forEach(s => {
            webpush.sendNotification(JSON.parse(s), payload).catch(error => {
                console.error(error);
            });
        });
    }
    res.sendStatus(200);
  },
  async getDoorbellEvents(req, res) {
    try {
        res.status(200).json({
            success: true,
            events: await db.getDoorbellEvents()
        });
    } catch(e) {
        console.error(e);
        res.status(500).json({ success: false, error: "An unknown error occurred while fetching the doorbell events" });
    }
  }
};
