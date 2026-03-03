const jwt = require("jsonwebtoken");
const Users = require("../models/users.models");

module.exports.usersMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token_client;

    if (!token) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Users.findOne({
      _id: decoded.id,
      deleted: false
    }).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User không tồn tại" });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Token không hợp lệ"
    });
  }
};
