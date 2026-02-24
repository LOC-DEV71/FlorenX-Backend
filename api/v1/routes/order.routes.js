const express = require("express");
const router = express.Router();
const controller = require("../controller/orders.controller.js");

router.get("/", controller.index)
router.get("/detail/:general", controller.orderDetail)
router.patch("/change-multi", controller.changeMulti)
router.patch("/change-status", controller.changeStatus)


module.exports = router;