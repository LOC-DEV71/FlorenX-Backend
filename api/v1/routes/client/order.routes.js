const express = require("express");
const router = express();
const controller = require("../../controller/client/order.controller");

router.get("/", controller.myOrders)
router.post("/checkout", controller.checkout)

module.exports = router