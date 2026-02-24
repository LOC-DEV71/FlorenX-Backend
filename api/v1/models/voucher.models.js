const mongoose = require("mongoose")
const voucherSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true
  },

  type: {
    type: String,
    enum: ["fixed", "percent"],
    required: true
  },

  value: Number,

  min_order_value: {
    type: Number,
    default: 0
  },

  max_discount: Number,

  quantity: Number,

  used: {
    type: Number,
    default: 0
  },
  
  start_date: Date,
  end_date: Date,

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
}, { timestamps: true });

const Vouchers = mongoose.model("vouchers", voucherSchema, "vouchers");

module.exports = Vouchers;
