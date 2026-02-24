const mongoose = require("mongoose");

const adminActivitySchema = new mongoose.Schema(
  {
    admin_id: {
      type: mongoose.Schema.Types.ObjectId, // CHỈ LƯU ID
      required: true
    },

    action: {
      type: String, // create | update | delete | login | logout | change-status
      required: true
    },

    module: {
      type: String, // products | categories | roles | accounts | orders
      required: true
    },

    target_id: {
      type: mongoose.Schema.Types.ObjectId, // id record bị tác động
      default: null
    },

    message: {
      type: String, // text hiển thị notify
      required: true
    },

    metadata: {
      type: Object, // before / after / extra
      default: {}
    },

    type: {
      type: String, // info | success | warning | error
      default: "info"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("admin_activity", adminActivitySchema);
