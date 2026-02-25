const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/articles.controller")


router.get("/get-list", controller.getList)
router.get("/detail", controller.getDetail)

module.exports = router;