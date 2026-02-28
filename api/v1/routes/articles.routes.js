const express = require("express");
const router = express.Router();
const controller = require("../controller/articles.controller");
const multer = require("multer");
const articleMidleWare = require("../Middleware/articles.middleware");
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,  
        fieldSize: 10 * 1024 * 1024 
    }
})

const uploadCloud = require("../Middleware/uploadCloud.middleware");


router.get(
    "/detail", 
    articleMidleWare.articleMiddleWare("view-articles"),
    controller.getDetail
)
router.get(
    "/get-list", 
    articleMidleWare.articleMiddleWare("view-articles"),
    controller.getList
)
router.post(
    "/create", 
    articleMidleWare.articleMiddleWare("create-articles"),
    upload.fields([
        { name: "thumbnail", maxCount: 1 }
    ]),
    uploadCloud.streamUpload,
    controller.create
)
router.post(
    "/change-multi", 
    articleMidleWare.articleMiddleWare("update-articles"),
    controller.changeMulti
)
router.post(
    "/update", 
    articleMidleWare.articleMiddleWare("update-articles"),
    upload.fields([
        { name: "thumbnail", maxCount: 1 }
    ]),
    uploadCloud.streamUpload,
    controller.update
)

router.delete("/delete", 
    articleMidleWare.articleMiddleWare("delete-articles"),
    controller.deleteArticle
)

module.exports = router;