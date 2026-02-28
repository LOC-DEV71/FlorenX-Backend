const express = require("express");
const router = express.Router();

const accountsValiable = require("../valiable/accountsValiable");
const controller = require("../controller/accounts.controller");

const accountsMiddleWare = require("../Middleware/accounts.middleWare");

const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    fieldSize: 10 * 1024 * 1024
  }
});

const uploadCloud = require("../Middleware/uploadCloud.middleware");

router.get(
  "/", 
  accountsMiddleWare.accountsMiddleWare("view-accounts"),
  controller.index
);

router.post(
  "/create",
  accountsMiddleWare.accountsMiddleWare("create-accounts"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadCloud.streamUpload,
  accountsValiable.createValiable,
  controller.create
);
router.patch(
  "/change-multi",
  accountsMiddleWare.accountsMiddleWare("update-accounts"),
  controller.changeMultiAccounts
);

router.delete(
  "/delete",
  controller.delete
)

module.exports = router;
