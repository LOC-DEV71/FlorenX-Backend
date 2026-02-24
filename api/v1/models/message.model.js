const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    room_chat_id: {
      type: String,
      required: true
    },

    sender_id: {
      type: String, 
      required: true
    },

    sender_role: {
      type: String,
      enum: ["client", "admin"],
      required: true
    },

    content: {
      type: String,
      default: ""
    },

    images: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("messages", messageSchema);
