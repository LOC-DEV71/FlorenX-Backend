const express = require("express");
const router = express();
const controller = require("../controller/roles.controller")
const rolesMiddelware = require("../Middleware/roles.middleware");

router.get("/", rolesMiddelware.rolesMiddleware("view-roles"), controller.get)
router.get("/get", rolesMiddelware.rolesMiddleware("view-roles"), controller.getList)
router.post("/create", rolesMiddelware.rolesMiddleware("create-roles"), controller.create)
router.patch("/update", rolesMiddelware.rolesMiddleware("update-roles"), controller.update)

module.exports = router