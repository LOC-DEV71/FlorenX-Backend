const usersController = require("./users.routes");
module.exports = (app) => {
    app.use("/api/v1/users", usersController)
}