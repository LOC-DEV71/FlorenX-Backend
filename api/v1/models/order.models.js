const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    address: String,
    general: String,
    user_id: String,

    items: [
      {
        product_id: String,
        quantity: Number,
        price: Number,
        discountPercentage: Number,
        thumbnail: String,
        slug: String
      }
    ],

    voucher_id: String,

    payment_method: {
      type: String,
      enum: ["cod", "paypal"],
      default: "cod"
    },

    status: {
      type: String,
      enum: ["pending", "paid", "shipping", "completed", "cancelled"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Orders", OrderSchema);
