const express = require("express");
const router = express();
const controller = require("../controller/authAdmin.controller")
const authValiable = require("../valiable/auth.admin.valiable");

router.post(
    "/login", 
    authValiable.authValiable,
    controller.login
)
router.get("/me", controller.getme)
router.post("/logout", controller.logout)

module.exports = router