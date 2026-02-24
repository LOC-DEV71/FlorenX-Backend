const mongoose = require("mongoose");

const permissionGroupSchema = new mongoose.Schema(
  {
    title: {
      type: String, 
      required: true
    },
    key: {
      type: String,
      required: true,
      unique: true
    },
    permissions: [
      {
        label: {
          type: String,
          required: true
        },
        value: {
          type: String,
          required: true
        }
      }
    ],
    deleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "PermissionGroup",
  permissionGroupSchema,
  "permission"
);
