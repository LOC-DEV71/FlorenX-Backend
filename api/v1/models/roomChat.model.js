const mongoose = require("mongoose");

const roomChatSchema = new mongoose.Schema(
  {
    user_id: {
      type: String
    },

    admin_ids: {
      type: [String],
      default: []   
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("room_chats", roomChatSchema);
