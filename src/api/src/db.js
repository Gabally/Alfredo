import mysql from "mysql2/promise";
import { hashPassword, compareHash, randomString } from "./utils.js";

export class DB {
  constructor() {
    this.connection = null;
    this.init();
  }

  async init() {
    this.connection = await mysql.createConnection({
      host: "db",
      user: "root",
      password: "root",
      database: "alfredo",
    });
    await this.connection.query("CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, username CHAR(200) NOT NULL, password TEXT(1000) NOT NULL, is_admin BOOLEAN NOT NULL, phone_mac CHAR(100))");
    await this.connection.query("CREATE TABLE IF NOT EXISTS tokens (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, token CHAR(200) NOT NULL, device CHAR(200) NOT NULL, is_mobile BOOLEAN NOT NULL, who INT NOT NULL, CONSTRAINT FK_user_token FOREIGN KEY (who) REFERENCES users(id) ON DELETE CASCADE)");
    await this.connection.query("CREATE TABLE IF NOT EXISTS notification_subscriptions (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, subscription VARCHAR(500) NOT NULL, who INT NOT NULL, CONSTRAINT FK_user_notification_subscriptions FOREIGN KEY (who) REFERENCES users(id) ON DELETE CASCADE)");
    await this.connection.query("CREATE TABLE IF NOT EXISTS doorbell (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, img CHAR(200) NOT NULL, timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)");
    await this.connection.query("CREATE TABLE IF NOT EXISTS sensor_data (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, sensor CHAR(200) NOT NULL, room CHAR(200) NOT NULL, temperature FLOAT(10) NOT NULL, humidity INT(5) NOT NULL, timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)");
    let [rows, fields] = await this.connection.query("SELECT * FROM users LIMIT 1");
    if (rows.length === 0) {
      let password = await hashPassword("admin");
      await this.connection.query("INSERT INTO users VALUES(NULL, 'admin', ?, 1, NULL)",[password]);
    }
  }

  async authenticate(username, password, device, isMobile) {
    let [rows, fields] = await this.connection.query("SELECT * FROM users WHERE username=? LIMIT 1", [username]);
    let record = rows[0];
    if (record) {
        if (await compareHash(record.password, password)) {
            let token = randomString(100);
            await this.connection.query("INSERT INTO tokens VALUES(NULL, ?, ?, ?, ?)", [token, device, isMobile, record.id]);
            return [token, record.is_admin === 1 ? true : false];
        } else {
            return [false, false];
        }
    } else {
        return [false, false];
    }
  }

  async tokenIsValid(token) {
    let [rows, fields] = await this.connection.query("SELECT id FROM tokens WHERE token=? LIMIT 1", [token]);
    return rows.length > 0;
  }

  async logout(token) {
    if (await this.tokenIsValid(token)) {
        await this.connection.query("DELETE FROM tokens WHERE token=?", [token]);
    } else {
        throw "Invalid token provided";
    }
  }

  async getAccountInfo(token) {
    if (await this.tokenIsValid(token)) {
      let [rows, fields] = await this.connection.query("SELECT * FROM tokens WHERE token=? LIMIT 1", [token]);
      if (rows.length > 0) {
        let who = rows[0]["who"];
        [rows, fields] = await this.connection.query("SELECT id, username, is_admin, phone_mac FROM users WHERE id=? LIMIT 1", [who]);
        return rows.length > 0 ? rows[0] : null;
      }  else {
        return null;
      }
    } else {
      return null;
    }
  }

  async getAccount(token) {
    if (await this.tokenIsValid(token)) {
      let [rows, fields] = await this.connection.query("SELECT * FROM tokens WHERE token=? LIMIT 1", [token]);
      if (rows.length > 0) {
        let who = rows[0]["who"];
        [rows, fields] = await this.connection.query("SELECT * FROM users WHERE id=? LIMIT 1", [who]);
        return rows.length > 0 ? rows[0] : null;
      }  else {
        return null;
      }
    } else {
      return null;
    }
  }

  async getAccountInfoByID(id) {
    let [rows, fields] = await this.connection.query("SELECT id, username, is_admin, phone_mac FROM users WHERE id=? LIMIT 1", [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  async getAllAccounts() {
    let [rows, fields] = await this.connection.query(`SELECT (SELECT
    JSON_PRETTY(JSON_ARRAYAGG(JSON_OBJECT('id', u.id, 'username', u.username, 'isAdmin', u.is_admin, 'phone_mac', u.phone_mac, 'logins', l.tokens)))
    FROM users u
    LEFT JOIN (SELECT who, JSON_ARRAYAGG(JSON_OBJECT('id', id, 'device', device, 'isMobile', is_mobile)) tokens FROM tokens GROUP BY who) l ON l.who = u.id) AS accounts`);
    return JSON.parse(rows.length > 0 ? rows[0]["accounts"] : []);
  }

  async deleteLogin(id) {
    let [rows, fields] = await this.connection.query("DELETE FROM tokens WHERE id=?", [id]);
    return rows.affectedRows > 0;
  }

  async deleteAccount(id) {
    let [rows, fields] = await this.connection.query("DELETE FROM users WHERE id=?", [id]);
    return rows.affectedRows > 0;
  }

  async createAccount(username, password, mac, isAdmin) {
    let passwordHash = await hashPassword(password);
    let [rows, fields] = await this.connection.query("INSERT INTO users VALUES(NULL, ?, ?, ?, ?)",[username, passwordHash, isAdmin ? 1 : 0, mac]);
    return rows.affectedRows > 0;
  }

  async updateAccount(id, username, mac, isAdmin) {
    let [rows, fields] = await this.connection.query("UPDATE users SET username=?,is_admin=?,phone_mac=? WHERE id=?",[username, isAdmin ? 1 : 0, mac, id]);
    return rows.affectedRows > 0;
  }

  async resetAccountPassword(id, password) {
    let passwordHash = await hashPassword(password);
    let [rows, fields] = await this.connection.query("UPDATE users SET password=? WHERE id=?",[passwordHash, id]);
    return rows.affectedRows > 0;
  }

  async updateAccountPassword(token, oldpassword, password) {
    let user = await this.getAccount(token);
    if (await compareHash(user.password, oldpassword)) {
      return await this.resetAccountPassword(user.id, password);
    } else {
      return false;
    }
  }

  async addNotificationSubscription(who, sub) {
    let [rows, fields] = await this.connection.query("INSERT INTO notification_subscriptions VALUES(NULL, ?, ?)",[sub, who]);
    return rows.affectedRows > 0;
  }

  async getNotificationSubscriptions() {
    let [rows, fields] = await this.connection.query("SELECT subscription FROM notification_subscriptions");
    return rows.length > 0 ? rows.map(r => r["subscription"]) : [];
  }

  async newDoorbellEvent(img) {
    let [rows, fields] = await this.connection.query("INSERT INTO doorbell (img) VALUES(?)", [img]);
    return rows.affectedRows > 0;
  }

  async getDoorbellEvents() {
    let [rows, fields] = await this.connection.query("SELECT * FROM doorbell");
    return rows;
  }

  async addSensorDataLog(sensor, room, temperature, humidity) {
    let [rows, fields] = await this.connection.query("INSERT INTO sensor_data (sensor, room, temperature, humidity) VALUES(?, ?, ?, ?)",[sensor, room, temperature, humidity]);
    return rows.affectedRows > 0;
  }

  async getSenorData(room, sensor) {
    let [rows, fields] = await this.connection.query("SELECT temperature, humidity, timestamp FROM sensor_data WHERE sensor = ? AND room = ?",[sensor, room]);
    return rows.length > 0 ? rows : [];
  }
}
