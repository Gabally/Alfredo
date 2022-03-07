import { readFileSync, writeFileSync } from "fs";
import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";

export const loadConfig = () => {
    return JSON.parse(readFileSync("config.json", "utf-8"));
};

export const saveConfig = (data) => {
    writeFileSync("config.json", JSON.stringify(data));
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
    return randomBytes(size)
    .toString("base64")
    .slice(0, size)
}