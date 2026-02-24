const express = require("express");
const router = express();
const controller = require("../controller/notifications.controller");
const notificationsMiddleware = require("../Middleware/notifications.middleware");

router.get("/", notificationsMiddleware.notificationsMiddleware("view-notifications"), controller.getNotifications);

module.exports = router