const express = require("express");
const router = express();
const controller = require("../controller/carts.controller");

router.get("/", controller.index)
router.post("/create", controller.create)
router.post("/add-to-cart", controller.addToCarts)
router.post("/change-quantity", controller.changeQantity)
router.post("/delete-product", controller.deleteProduct)
router.post("/add-voucher", controller.addVoucher)


module.exports = router;