import { readFileSync, writeFileSync, existsSync } from "fs";
import { mkdir } from "fs/promises";
import * as bcrypt from "bcrypt";
import webpush from "web-push";
import { spawn } from "child_process";

export const loadConfig = () => {
    return JSON.parse(readFileSync("config.json", "utf-8"));
};

export const saveConfig = (data) => {
    writeFileSync("config.json", data);
};

export const hashPassword = async (psw) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(psw, 15, (err, hash) => {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
};

export const compareHash = async (hash, psw) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(psw, hash, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

export const randomString = (size) => {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";
    for (let i = 0; i < size; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
}

export const rtspSnapshot = async (feed) => {
    return new Promise((resolve, reject) => {
        let ffmpeg = spawn("ffmpeg", ["-y", "-i", feed, "-ss", "00:00:02.500", "-f", "image2", "-vframes", "1", "-"]);
        let framebuffer = Buffer.from("");
        ffmpeg.stdout.on("data", (frame) => {
            if (frame.length > 1) {
                framebuffer = Buffer.concat([framebuffer, frame]);
                let offset = frame[frame.length-2].toString(16);
                let offset2 = frame[frame.length-1].toString(16);
                if(offset == "ff" && offset2 == "d9") {
                    resolve(framebuffer);
                }
            }
        });
    });
}

export const createDirIfNotExists = async (path) => {
    if (!existsSync(path)) {
        await mkdir(path, { recursive: true });
    }
}

export const paramsAreValid = (params) => {
    for (let i = 0; i < params.length; i++) {
        if (!(params[i] !== undefined && params[i] !== null && params.length > 0)) {
            return false;
        }        
    }
    return true;
}

export const generateVAPIDKeys = () => {
    if (!existsSync("keys/public") || !existsSync("keys/private")) {
        let { publicKey, privateKey } = webpush.generateVAPIDKeys();
        writeFileSync("keys/public", publicKey);
        writeFileSync("keys/private", privateKey);
    }
}

export const getVAPIDKeys = () => {
    return {
        publicKey: readFileSync("keys/public", "utf-8"),
        privateKey: readFileSync("keys/private", "utf-8")
    }
}