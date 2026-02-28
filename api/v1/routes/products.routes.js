const express = require("express");
const router = express();
const controller = require("../controller/products.controller");
const productsValiable = require("../valiable/productsValiable");
const productsMiddleware = require("../Middleware/products.middleware");

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
  productsMiddleware.productsMiddleware("view-products"),
  controller.index
);
router.get(
  "/detail/:slug", 
  productsMiddleware.productsMiddleware("view-products"),
  controller.detail
);
router.patch(
  "/update/:slug",
  productsMiddleware.productsMiddleware("update-products"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 }
  ]),
  uploadCloud.streamUpload,
  productsValiable.productsValiable,
  controller.update
);

router.patch(
    "/change-multi", 
    productsMiddleware.productsMiddleware("update-products"),
    controller.changeMulti
);
router.post(
  "/create",
  productsMiddleware.productsMiddleware("create-products"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 }
  ]),
  uploadCloud.streamUpload,
  productsValiable.productsValiable,
  controller.create
);

router.delete(
  "/delete",
  productsMiddleware.productsMiddleware("delete-products"),
  controller.delete
)


module.exports = router;