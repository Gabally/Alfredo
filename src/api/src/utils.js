import { readFileSync, writeFileSync, existsSync } from "fs";
import { mkdir } from "fs/promises";
import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";
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
        let ffmpeg = spawn("ffmpeg", ["-y", "-i", feed, "-ss", "00:00:01.500", "-f", "image2", "-vframes", "1", "-"]);
        ffmpeg.stdout.on("data", (data) => {
            resolve(data);
        });
    });
}

export const createDirIfNotExists = async (path) => {
    if (!existsSync(path)) {
        await mkdir(path, { recursive: true });
    }
}