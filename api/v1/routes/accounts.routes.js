const express = require("express");
const router = express.Router();

const accountsValiable = require("../valiable/accountsValiable");
const controller = require("../controller/accounts.controller");

const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    fieldSize: 10 * 1024 * 1024
  }
});

const uploadCloud = require("../Middleware/uploadCloud.middleware");

router.get("/", controller.index);

router.post(
  "/create",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadCloud.streamUpload,
  accountsValiable.createValiable,
  controller.create
);
router.patch(
  "/change-multi",
  controller.changeMultiAccounts
);

module.exports = router;
