const express = require("express");
const router = express();
const controller = require("../controller/users.controller.js");
const userValiable = require("../valiable/users.valiable.js")

router.get("/", controller.index)
router.post("/register/otp", controller.sendRegisterOtp);
router.post("/register/verify", controller.verifyRegisterOtp);
router.post("/login", userValiable.loginValiable, controller.login)
router.get("/me", controller.me)
router.post("/logout", controller.logout)
router.get("/my-account", controller.accountUser)
router.post("/update", controller.update)
router.post("/forgot-password", controller.forgotPassword)
router.post("/forgot-password/otp", controller.forgotPasswordOtp)
router.post("/reset-password", controller.resetPassword)


module.exports = router;