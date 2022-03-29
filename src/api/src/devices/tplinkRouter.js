import fetch from "node-fetch";

export class Router {
    constructor(ip, password) {
        this.ip = ip;
        this.password = Buffer.from(password).toString("base64");
    }

    async getDevices() {
        await fetch(`http://${this.ip}/cgi?5`, {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:96.0) Gecko/20100101 Firefox/96.0",
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "text/plain",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache",
                "Cookie": `Authorization=Basic ${this.password}`
            },
            "referrer": `http://${this.ip}/`,
            "body": "[LAN_HOST_ENTRY#0,0,0,0,0,0#0,0,0,0,0,0]0,0\r\n",
            "method": "POST",
            "mode": "cors"
        });
    }
}