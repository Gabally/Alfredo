import { spawn } from "child_process";
import { randomString } from "./utils.js";
import * as jpeg from "jpeg-js";

export class RTSPStreamer {
    constructor(executable = "ffmpeg") {
        this.executable = executable;
        this.streams = {};
    }

    async pipeStream(rtspurl, res) {
        res.writeHead(200, {
            "Cache-Control": "no-store, no-cache, must-revalidate, pre-check=0, post-check=0, max-age=0",
            Pragma: "no-cache",
            Connection: "close",
            "Content-Type": "multipart/x-mixed-replace;boundary=B",
            "transfer-encoding": ""
        });
        res.socket.write(res._header);
        if (!this.streams[rtspurl]) {
            this.streams[rtspurl] = {
                locks: {},
                feedproc: spawn(this.executable, ["-i", rtspurl, "-f", "mjpeg", "-"])
            }
        }
        let lock = randomString(10);
        this.streams[rtspurl].locks[lock] = true;
        //this.streams[rtspurl].feedproc.stderr.on("data", (err) => { console.error(err.toString()); });
        this.streams[rtspurl].feedproc.stdout.on("data", (frame) => {
            try {
                //jpeg.decode(frame);
                const buffer = Buffer.concat([
                    new Buffer.from("--B\r\n"),
                    new Buffer.from("Content-type: image/jpeg\r\n\r\n"),
                    new Buffer.from(`Content-Length: ${frame.length}`),
                    frame,
                    new Buffer.from("\r\n")
                ]);
                res.socket.write(buffer);
            } catch(e) {
     
            } 
        });
        res.socket.on("close", () => {
            delete this.streams[rtspurl].locks[lock];
            if (Object.keys(this.streams[rtspurl].locks).length === 0) {
                this.streams[rtspurl].feedproc.kill("SIGKILL");
                delete this.streams[rtspurl];
            }
        }); 
    }
}