const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const Account = require("../models/accounts.models");
const User = require("../models/users.models");

module.exports = (io) => {
  io.on("connection", async (socket) => {
    console.log("Socket connected:", socket.id);

    const cookies = socket.handshake.headers.cookie;
    if (!cookies) {
      console.log("No cookie");
      return;
    }

    const parsed = cookie.parse(cookies);

    const adminToken = parsed.token;           
    const userToken  = parsed.token_client;   

    if (adminToken) {
      const admin = await Account.findOne({
        token: adminToken,
        deleted: false,
        status: "active"
      }).select("_id fullname");

      if (admin) {
        socket.join("admins");
        socket.join(`admin_${admin._id}`);

        socket.role = "admin";
        socket.adminId = admin._id;

        console.log("Admin connected:", admin._id.toString());
      }
    }

    if (userToken) {
      try {
        const decoded = jwt.verify(userToken, process.env.JWT_SECRET);

        const user = await User.findOne({
          _id: decoded.id,
          deleted: false,
          status: "active"
        }).select("_id fullname");

        if (user) {
          socket.join("clients");
          socket.join(`user_${user._id}`);

          socket.role = "client";
          socket.userId = user._id;

          console.log("Client connected:", user._id.toString());
        }
      } catch (err) {
        console.log("JWT client error:", err.message);
      }
    }

    require("./admin.socket")(io, socket);
    require("./client.socket")(io, socket);
    require("./chat.socket")(io, socket);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};