import { readFileSync, writeFileSync } from "fs";

export const loadConfig = () => {
    return JSON.parse(readFileSync("config.json", "utf-8"));
}

export const saveConfig = (data) => {
    writeFileSync("config.json", JSON.stringify(data));
}