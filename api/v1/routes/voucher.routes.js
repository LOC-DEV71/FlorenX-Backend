const express = require("express");
const router = express.Router();
const controller = require("../controller/voucher.controller")
const vouchersMiddleware = require("../Middleware/vouchers.middleware")

router.post("/create", vouchersMiddleware.vouchersMiddleware("create-vouchers") ,controller.createVoucher)
router.get("/get", vouchersMiddleware.vouchersMiddleware("view-vouchers"), controller.getListVouchers)
router.get("/detail/:id", vouchersMiddleware.vouchersMiddleware("view-vouchers"), controller.getOneVoucher)
router.patch("/update/:id", vouchersMiddleware.vouchersMiddleware("update-vouchers"), controller.updateVoucher)
router.patch("/change-multi", vouchersMiddleware.vouchersMiddleware("update-vouchers"), controller.changeMultiVouchers)

module.exports = router;