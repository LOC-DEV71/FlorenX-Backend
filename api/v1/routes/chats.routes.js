const express = require("express");
const router = express.Router();

const controller = require("../controller/chats.controller");

router.post("/send-message", controller.sendMessage)
router.get("/get-room", controller.getRoom)
router.get("/list-room", controller.listRoom)
router.get("/list-message", controller.listMessage)
router.get("/list-message-admin", controller.listMessageAdmin)


module.exports = router;
