const express = require("express");
const router = express();
const controller = require("../controller/permissionGroup.controller")

router.get("/", controller.getPermission)

module.exports = router