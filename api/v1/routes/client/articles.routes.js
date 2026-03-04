const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/articles.controller")


router.get("/get-list", controller.getList)  
router.get("/get-all", controller.getAll)  
router.get("/by-location", controller.getByLocation)
router.get("/detail", controller.getDetail)

module.exports = router;