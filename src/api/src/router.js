import express from "express";
import { db } from "./app.js";
import authentication from "./controllers/authentication.js";
import cameras from "./controllers/cameras.js";
import users from "./controllers/users.js";
import config from "./controllers/config.js";
import authenticationcheck from "./middleware/authenticationcheck.js";

const router = express.Router();

export default router;

router.post("/login", authentication.login);
router.post("/logout", authentication.logout);

const usersRouter = express.Router();

router.use("/accounts", usersRouter);

usersRouter.use(authenticationcheck.headerAuth);

usersRouter.get("/all", users.listAccounts);
usersRouter.get("/my", users.getAccountInfo);
usersRouter.post("/updatepfp", users.updateProfilePicture);
usersRouter.delete("/deletelogin/:id", users.deleteLoginToken);
usersRouter.delete("/deleteaccount/:id", users.deleteAccount);

const streamRouter = express.Router();

router.use("/cameras", streamRouter);

streamRouter.use(authenticationcheck.queryAuth);

streamRouter.get("/feed/:room/:camera", cameras.streamCamera);
streamRouter.get("/still/:room/:camera", cameras.getStill);

const configRouter = express.Router();

router.use("/config", configRouter);

configRouter.get("/raw", config.getRawConfig);
configRouter.post("/save", config.saveConfig);