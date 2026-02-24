const Users = require("../models/users.models");
module.exports.usersMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token_client;
        const user = await Users.findOne({
                deleted: false,
                tokenUser: token
        }).select("-password -tokenUser")
    
        if(!user){
            return res.status(400).json({
                message: "token không hợp lệ"
            })
        }

        req.user = user;
        next()
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi: ${error}`
        })
    }
};
