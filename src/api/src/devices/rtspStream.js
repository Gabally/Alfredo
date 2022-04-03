import { spawn } from "child_process";
import { randomString } from "../utils.js";

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
                socks: [],
                feedproc: spawn(this.executable, ["-loglevel", "quiet","-i", rtspurl, "-f", "mjpeg", "-"])
            }
            let framebuffer = Buffer.from("");
            this.streams[rtspurl].feedproc.stdout.on("data", (frame) => {
                if (frame.length > 1) {
                    framebuffer = Buffer.concat([framebuffer, frame]);
                    let offset = frame[frame.length-2].toString(16);
                    let offset2 = frame[frame.length-1].toString(16);
                    if(offset == "ff" && offset2 == "d9") {
                        let pkt = Buffer.concat([
                            new Buffer.from(`--B\r\nContent-type: image/jpeg\r\nContent-Length: ${framebuffer.length}\r\n\r\n`),
                            framebuffer
                        ]);
                        this.streams[rtspurl].socks.forEach(s => s.socket.write(pkt));
                        framebuffer = Buffer.from("");
                    }
                }
            });
            this.streams[rtspurl].feedproc.stderr.on("data", (data) => {
                this.streams[rtspurl].feedproc.kill("SIGKILL");
                delete this.streams[rtspurl];
            });
        }
        let id = randomString(10);
        this.streams[rtspurl].socks.push({
            id: id,
            socket: res.socket
        });
        res.socket.on("close", () => {
            this.streams[rtspurl].socks = this.streams[rtspurl].socks.filter(s => s.id !== id);
            if (this.streams[rtspurl].socks.length === 0) {
                this.streams[rtspurl].feedproc.kill("SIGKILL");
                delete this.streams[rtspurl];
            }
        }); 
    }
}