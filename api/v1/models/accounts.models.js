const mongoose = require("mongoose");
const generate = require("../../../helper/generate");
const accountSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
  token: {
    type: String,
    default:() => generate.generateRandomString(20),
  },
  phone: String,
  status: String,
  avatar: String,
  role_slug: String,
  loginAt: {
    type: Date,
    default: null
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, { timestamps: true });

const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;
