const express = require("express");
const router = express();
const controller = require("../../controller/client/products.controller")

router.get("/", controller.index)
router.get("/all", controller.indexAll)
router.get("/detail/:slug", controller.detail)
router.get("/similar", controller.productSimilar)
router.post(
    "/evaluate",
    controller.evaluate
)

module.exports = router