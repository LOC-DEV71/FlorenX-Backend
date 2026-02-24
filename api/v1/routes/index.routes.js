const usersController = require("./users.routes");
const cartsController = require("./carts.routes");
const productsController = require("./products.routes");
const productCategorysController = require("./product.categorys.routes");
const accountsController = require("./accounts.routes");
const rolesController = require("./roles.routes");
const permissionGroupController = require("./permissionGroup.routes");
const authAdminController = require("./AuthAdmin.routes");
const notificationsController = require("./notification.routes");
const chatsController = require("./chats.routes");
const vouchersController = require("./voucher.routes");
const orderController = require("./order.routes");
const articlesController = require("./articles.routes");

const categoryClientController = require("./client/category.routes");
const productsClientController = require("./client/products.routes");
const vouchersClientController = require("./client/voucher.routes");
const ordersClientController = require("./client/order.routes");
const searchClientController = require("./client/search.routes");

module.exports = (app) => {
    app.use("/api/v1/products", productsController)
    app.use("/api/v1/product-categorys", productCategorysController)
    app.use("/api/v1/accounts", accountsController)
    app.use("/api/v1/roles", rolesController)
    app.use("/api/v1/permission-group", permissionGroupController)
    app.use("/api/v1/auth", authAdminController)
    app.use("/api/v1/notifications", notificationsController)
    app.use("/api/v1/chats", chatsController)
    app.use("/api/v1/vouchers", vouchersController)
    app.use("/api/v1/orders", orderController)
    app.use("/api/v1/articles", articlesController)

    //client
    app.use("/api/v1/users", usersController)
    app.use("/api/v1/client/categorys", categoryClientController)
    app.use("/api/v1/client/products", productsClientController)
    app.use("/api/v1/client/vouchers", vouchersClientController)
    app.use("/api/v1/client/order", ordersClientController)
    app.use("/api/v1/client/search", searchClientController)
    app.use("/api/v1/carts", cartsController)
}