import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl: string;
    currentUserName?: string;
}

export function setUser(userName: string) {
    const config = readConfig();
    config.currentUserName = userName;
    writeConfig(config);
}

export function readConfig(): Config {
    const configPath = getConfigFilePath();
    if (!fs.existsSync(configPath)) {
        throw new Error("Config file not found. Please create a .gatorconfig.json file in your home directory.");
    }
    const configJson = fs.readFileSync(configPath, "utf-8");
    const rawConfig = JSON.parse(configJson);
    return validateConfig(rawConfig);
}

function writeConfig(config: Config) {
    const configPath = getConfigFilePath();
    fs.writeFileSync(configPath, configJson(config), "utf-8");
}

function configJson(config: Config): string {
    return JSON.stringify({
        db_url: config.dbUrl,
        current_user_name: config.currentUserName,
    }, null, 2);
}

function getConfigFilePath(): string {
    return path.join(os.homedir(), ".gatorconfig.json");
}

function validateConfig(rawConfig: any): Config {
    if (typeof rawConfig.db_url !== "string") {
        throw new Error("Invalid config: dbUrl must be a string");
    }
    const config: Config = {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name,
    };
    return config;
}