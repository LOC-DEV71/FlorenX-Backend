const express = require("express");
const router = express();
const controller = require("../controller/users.controller.js");
const userValiable = require("../valiable/users.valiable.js");
const usersMiddleware = require("../Middleware/users.middleware.js")

router.get(
    "/", 
    controller.index
)
router.post("/google", controller.googleLogin);

router.post(
    "/register/otp" , 
    userValiable.registerValiable, 
    controller.sendRegisterOtp
);
router.post(
    "/register/verify", 
    controller.verifyRegisterOtp
);
router.post(
    "/login", 
    userValiable.loginValiable, 
    controller.login
)
router.get(
    "/me", 
    usersMiddleware.usersMiddleware, 
    controller.me
)
router.post(
    "/logout", 
    controller.logout
)
router.get(
    "/my-account", 
    usersMiddleware.usersMiddleware, 
    controller.accountUser
)
router.post(
    "/update", 
    usersMiddleware.usersMiddleware, 
    controller.update
)   
router.post(
    "/forgot-password", 
    controller.forgotPassword
)
router.post(
    "/forgot-password/otp", 
    controller.forgotPasswordOtp
)
router.post(
    "/reset-password", 
    controller.resetPassword
)


module.exports = router;