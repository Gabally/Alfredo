import express from "express";
import authentication from "./controllers/authentication.js";
import cameras from "./controllers/cameras.js";
import users from "./controllers/users.js";
import config from "./controllers/config.js";
import authenticationcheck from "./middleware/authenticationcheck.js";
import notifications from "./controllers/notifications.js";
import doorbell from "./controllers/doorbell.js";
import ambientSensors from "./controllers/ambientSensors.js";
import presenceDetection from "./controllers/presenceDetection.js";
import network from "./controllers/network.js";

const router = express.Router();

export default router;

router.post("/login", authentication.login);
router.post("/logout", authenticationcheck.headerAuth, authentication.logout);

router.get("/ringdoorbell", doorbell.ring);

router.get("/doorbellevents", authenticationcheck.headerAuth,  doorbell.getDoorbellEvents);

router.get("/presence", authenticationcheck.headerAuth,  presenceDetection.whoIsPresent);

router.get("/netstat", authenticationcheck.headerAuth,  network.netStatus);
router.get("/rebootrouter", authenticationcheck.headerAuth,  network.rebootRouter);

const usersRouter = express.Router();

router.use("/accounts", usersRouter);

usersRouter.use(authenticationcheck.headerAuth);

usersRouter.get("/info/:id", users.getAccountInfo);
usersRouter.get("/all", users.listAccounts);
usersRouter.get("/my", users.getMyAccountInfo);
usersRouter.post("/updatepassword", users.updateAccountPassword);
usersRouter.post("/updatepfp", users.updateProfilePicture);
usersRouter.delete("/deletelogin/:id", users.deleteLoginToken);
usersRouter.delete("/delete/:id", users.deleteAccount);
usersRouter.post("/create", users.createAccount);
usersRouter.post("/update/:id", users.updateAccount);
usersRouter.post("/resetpassword/:id", users.resetAccountPassword);

const streamRouter = express.Router();

router.use("/cameras", streamRouter);

streamRouter.use(authenticationcheck.queryAuth);

streamRouter.get("/feed/:room/:camera", cameras.streamCamera);
streamRouter.get("/still/:room/:camera", cameras.getStill);

const notificationRouter = express.Router();

router.use("/notifications", notificationRouter);

notificationRouter.use(authenticationcheck.headerAuth);

notificationRouter.post("/add", notifications.addNotificationSubscription);
notificationRouter.get("/publickey", notifications.getPublicKey);

const configRouter = express.Router();

router.use("/config", configRouter);

configRouter.use(authenticationcheck.headerAuth);

configRouter.get("/raw", config.getRawConfig);
configRouter.post("/save", config.saveConfig);

const aSensorsRouter = express.Router();

router.use("/ambientsensors", aSensorsRouter);

aSensorsRouter.use(authenticationcheck.headerAuth);

aSensorsRouter.get("/:room/:sensor", ambientSensors.getLogs);

