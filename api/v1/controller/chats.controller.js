const RoomChat = require("../models/roomChat.model");
const User = require("../models/users.models")
const Accounts = require("../models/accounts.models");
const Message = require("../models/message.model")
const jwt = require("jsonwebtoken");

module.exports.sendMessage = async (req, res) => {
    try {
        const { content, sender_role, room_chat_id } = req.body;

        let sender_id;

        if (sender_role === "client") {

            const token_client = req.cookies.token_client;
            if (!token_client) {
                return res.status(401).json({ message: "Chưa đăng nhập client" });
            }

            const decoded = jwt.verify(token_client, process.env.JWT_SECRET);
            sender_id = decoded.id;

        } else if (sender_role === "admin") {

            const token_admin = req.cookies.token;
            const admin = await Accounts.findOne({
                deleted: false,
                token: token_admin
            });

            if (!admin) {
                return res.status(401).json({ message: "Admin không hợp lệ" });
            }

            sender_id = admin._id;
        }

        const saveMessage = await Message.create({
            content,
            room_chat_id,
            sender_role,
            sender_id
        });

        return res.status(200).json({
            message: "OK"
        });

    } catch (error) {
        return res.status(400).json({
            message: `Lỗi ${error.message}`
        });
    }
};
module.exports.getRoom = async (req, res) => {
    try {

        const token = req.cookies.token_client; 

        if (!token) {
            return res.status(401).json({
                message: "Chưa đăng nhập"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const room = await RoomChat.findOne({
            user_id: decoded.id
        });

        if (!room) {
            return res.status(404).json({
                message: "Chưa có phòng"
            });
        }

        return res.status(200).json({
            room_chat_id: room._id
        });

    } catch (error) {
        return res.status(400).json({
            message: `Lỗi: ${error.message}`
        });
    }
};
module.exports.listRoom = async (req, res) => {
    try {
        const rooms = await RoomChat.find();

        const userIds = rooms.map(r => r.user_id);

        const users = await User.find({
            _id: { $in: userIds },
            deleted: false
        }).select("fullname avatar");

        const userMap = {};
        users.forEach(u => {
            userMap[u._id.toString()] = u;
        });

        const result = rooms.map(r => ({
            ...r.toObject(),
            fullname: userMap[r.user_id]?.fullname || null,
            avatar: userMap[r.user_id]?.avatar || null
        }));

        return res.status(200).json({ listRoom: result });

    } catch (error) {
        return res.status(400).json({
            message: "Lỗi"
        })
    }
}

module.exports.listMessage = async (req, res) => {
  try {
    const { roomId } = req.query;

    const messages = await Message.find({
      room_chat_id: roomId
    });

    return res.status(200).json({
      messages
    });
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error}`
    });
  }
};

module.exports.listMessageAdmin = async (req, res) => {
  try {
    const { roomId } = req.query;

    const admin = await Accounts.findOne({
      deleted: false,
      token: req.cookies.token
    }).select("_id");

    if (!admin) {
      return res.status(401).json({ message: "Admin chưa đăng nhập" });
    }

    await RoomChat.updateOne(
      { _id: roomId },
      { $addToSet: { admin_ids: admin._id.toString() } }
    );

    const messages = await Message.find({
      room_chat_id: roomId
    });

    return res.status(200).json({ messages });
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error}`
    });
  }
};


