import { db } from "../app.js";

export default {
  async login(req, res) {
    let { username, password } = req.body;
    let device = `${req.useragent.browser} - ${req.useragent.os}`;
    let [token, isAdmin] = await db.authenticate(
      username,
      password,
      device,
      req.useragent.isMobile
    );
    if (token) {
      res.json({
        success: true,
        token: token,
        isAdmin: isAdmin,
      });
    } else {
      res.json({
        success: false,
        error: "Wrong password",
      });
    }
  },
  async logout(req, res) {
    try {
      let token = req.headers["token"];
      await db.logout(token);
      res.json({
        success: true,
      });
    } catch (e) {
      console.error(e);
      res.json({
        success: false,
        error: JSON.stringify(e),
      });
    }
  },
};
