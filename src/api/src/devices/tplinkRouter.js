import fetch from "node-fetch";
export class Router {
    constructor(ip, password) {
        this.ip = ip;
        this.password = Buffer.from(password).toString("base64");
    }

    async getDevices() {
        let resp = await fetch(`http://${this.ip}/cgi?5`, {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:96.0) Gecko/20100101 Firefox/96.0",
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "text/plain",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache",
                "cookie": `Authorization=Basic ${this.password}`
            },
            "referrer": `http://${this.ip}/`,
            "body": "[LAN_HOST_ENTRY#0,0,0,0,0,0#0,0,0,0,0,0]0,0\r\n",
            "method": "POST",
            "mode": "cors"
        });
        let rawResponse = await resp.text(); 
        let devicesRaw = rawResponse.split(/\[.*\]\d/i);
        devicesRaw = devicesRaw.filter(e => e != undefined);
        let devices = [];
        devicesRaw.forEach(d => {
            if (d.length > 0) {
                let props = d.split("\n").filter(d => d != "")
                let dev = {};
                props.forEach(p => {
                    let [key, value] = p.split("=");
                    dev[key] = value;
                });
                if (dev["active"] == "1") {
                    devices.push(dev);
                }
            }
        });
        return devices;
    }

    async enableGuestNetwork(ssid, password, config = {}) {
        config.hide = config.hide || false;
        config.isolateClients = config.isolateClients || false;
        config.accessLan = config.accessLan || false;
        config.accessUSBStorage = config.accessUSBStorage || false;
        let resp = await fetch(`http://${this.ip}/cgi?2&2`, {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:96.0) Gecko/20100101 Firefox/96.0",
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "text/plain",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache",
                "cookie": `Authorization=Basic ${this.password}`
            },
            "referrer": `http://${this.ip}/`,
            "body": `[LAN_WLAN_MSSIDENTRY#1,1,1,0,0,0#0,0,0,0,0,0]0,5\r\nenable=1\r\nSSID=${ssid}\r\nSSIDAdvertisementEnable=${config.hide ? 0 : 1}\r\npreSharedKey=${password}\r\nisolateClients=${config.isolateClients ? 1 : 0}\r\n[LAN_WLAN_GUESTNET#1,2,0,0,0,0#0,0,0,0,0,0]1,2\r\nLANAccessEnable=${config.accessLan ? 1 : 0}\r\nUSBAccessEnable=${config.accessUSBStorage ? 1 : 0}\r\n`,
            "method": "POST",
            "mode": "cors"
        });
        let text = await resp.text();
        let [shit, errors] = text.split(/\[.*\]/i);
        return errors == "0";
    }

    async getConnectionStatus() {
        let resp = await fetch(`http://${this.ip}/cgi?1`, {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:96.0) Gecko/20100101 Firefox/96.0",
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "text/plain",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache",
                "cookie": `Authorization=Basic ${this.password}`
            },
            "referrer": `http://${this.ip}/`,
            "body": "[WAN_PPP_CONN#2,1,1,0,0,0#0,0,0,0,0,0]0,2\r\nLastConnectionError\r\nConnectionStatus\r\n",
            "method": "POST",
            "mode": "cors"
        });
        let data = await resp.text();
        return data.includes("connectionStatus=Connected");
    }
    
    async reboot() {
        await fetch(`http://${this.ip}/cgi?7`, {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:96.0) Gecko/20100101 Firefox/96.0",
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "text/plain",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache",
                "cookie": `Authorization=Basic ${this.password}`
            },
            "referrer": `http://${this.ip}/`,
            "body": "[ACT_REBOOT#0,0,0,0,0,0#0,0,0,0,0,0]0,0\r\n",
            "method": "POST",
            "mode": "cors"
        });
    }
}