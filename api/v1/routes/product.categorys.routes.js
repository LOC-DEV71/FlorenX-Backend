const express = require("express");
const router = express();
const controller = require("../controller/product.category.controller");
const categoryValiable = require("../valiable/categorysValiable");
const categoryMiddleware = require("../Middleware/products.categorys.middleware")


router.get(
    "/", 
    categoryMiddleware.productCategorysMiddleware("view-categories"),
    controller.index
);

router.post(
    "/create", 
    categoryMiddleware.productCategorysMiddleware("create-categories"),    
    categoryValiable.categoryValiable,
    controller.create
);
router.patch(
    "/change-multi", 
    categoryMiddleware.productCategorysMiddleware("update-categories"),
    controller.changeMulti
);
router.delete(
    "/delete", 
    categoryMiddleware.productCategorysMiddleware("delete-categories"),
    controller.delete
);


module.exports = router;