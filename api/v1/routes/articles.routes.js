const express = require("express");
const router = express.Router();
const controller = require("../controller/articles.controller");
const multer = require("multer");
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
    controller.getDetail
)
router.post(
    "/create", 
    upload.fields([
        { name: "thumbnail", maxCount: 1 }
    ]),
    uploadCloud.streamUpload,
    controller.create
)
router.post(
    "/update", 
    upload.fields([
        { name: "thumbnail", maxCount: 1 }
    ]),
    uploadCloud.streamUpload,
    controller.update
)

module.exports = router;