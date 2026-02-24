const Accounts = require("../models/accounts.models");
const Roles = require("../models/roles.models");
module.exports.productCategorysMiddleware = (permission) => {
    return async (req, res, next) => {
        try {
            const token = req.cookies.token;

            const checkToken = await Accounts.findOne({
                deleted: false,
                token: token
            })
            if (!checkToken) {
                return res.status(400).json({
                    message: "Token không hợp lệ"
                })
            }

            const roles = await Roles.findOne({
                deleted: false,
                slug: checkToken.role_slug
            })

            if (!roles) {
                return res.status(400).json({
                    message: "Bạn không có quyền thực hiện hành động này"
                })
            }

            if (!roles.permissions.includes(permission)) {
                return res.status(403).json({
                    message: "Bạn không đủ quyền thực hiện hành động này"
                });
            }

            req.token = token;

            next()
        } catch (error) {
            return res.status(400).json({
                message: `Lỗi: ${error}`
            })
        }
    }
}