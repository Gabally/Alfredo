import { db } from "../app.js";

export default {
  async headerAuth(req, res, next) {
    if (await db.tokenIsValid(req.headers["token"])) {
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
