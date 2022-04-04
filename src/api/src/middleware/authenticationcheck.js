import { db } from "../app.js";

export default {
  async headerAuth(req, res, next) {
    if (await db.tokenIsValid(req.headers["token"])) {
      next();
    } else {
      res.sendStatus(401);
    }
  },
  async headerAuthAdmin(req, res, next) {
    let user = await db.getAccountInfo(req.headers["token"]);
    console.log(user);
    if (user && user.is_admin) {
      next();
    } else {
      res.sendStatus(401);
    }
  },
  async queryAuth(req, res, next) {
    if (await db.tokenIsValid(req.query.token)) {
      next();
    } else {
      res.sendStatus(401);
    }
  },
};
