const RoomChat = require("../models/roomChat.model");
const User = require("../models/users.models")
const Accounts = require("../models/accounts.models");
const Message = require("../models/message.model")

module.exports.sendMessage = async (req, res) => {
    try {
        const {content, sender_role, room_chat_id} = req.body;
        const token_client = req.cookies.token_client;
        const token_admin = req.cookies.token;
        const client = await User.findOne({
            deleted: false,
            tokenUser: token_client
        })
        const admin = await Accounts.findOne({
            deleted: false,
            token: token_admin
        })
        if(sender_role === "client"){
            req.body.sender_id = client.id;
        } else if(sender_role==="admin"){
            req.body.sender_id = admin.id
        }
        const saveMessage = new Message(req.body)
        saveMessage.save();
        console.log(req.body)
        return res.status(200).json({
            message: ""
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi ${error}`
        })
    }
}
module.exports.getRoom = async (req, res) => {
    try {
        const tokenUser = req.cookies.token_client;
        const idUser = await User.findOne({
            deleted: false,
            tokenUser: tokenUser
        })

        const roomId = await RoomChat.findOne({
            user_id: idUser._id.toString()
        })


        return res.status(200).json({
            room_chat_id: roomId.id
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi: ${error}`
        })
    }
}

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


