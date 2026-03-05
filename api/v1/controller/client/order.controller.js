const Orders = require("../../models/order.models");
const Products = require("../../models/products.models");
const Vouchers = require("../../models/voucher.models");
const Cart = require("../../models/carts.model");
const Users = require("../../models/users.models");
const generalHelper = require("../../../../helper/generate");
const mailOrder = require("../../service/returnEmai.service");
const jwt = require("jsonwebtoken");

module.exports.checkout = async (req, res) => {
  try {
    const { items, voucher_id } = req.body;
    const cartId = req.cookies.cartId;
    const token = req.cookies.token_client;

    let userId = null;

    // decode JWT
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    }

    let voucher = null;

    if (voucher_id && voucher_id !== "null") {
      voucher = await Vouchers.findById(voucher_id);

      if (!voucher) {
        return res.status(400).json({ message: "Voucher không tồn tại" });
      }

      if (voucher.quantity <= 0) {
        return res.status(400).json({ message: "Số lượng voucher đã hết" });
      }
    }

    const general = generalHelper.generateRandomString(8);

    const orderData = {
      ...req.body,
      general: general.toUpperCase(),
      user_id: userId
    };

    const createOrder = new Orders(orderData);
    await createOrder.save();

    // trừ kho
    for (const item of items) {
      await Products.updateOne(
        { _id: item.product_id },
        { $inc: { stock: -item.quantity } }
      );
    }

    // trừ voucher
    if (voucher) {
      await Vouchers.updateOne(
        { _id: voucher._id },
        { $inc: { quantity: -1 } }
      );
    }

    // xóa giỏ hàng
    await Cart.updateOne(
      { _id: cartId },
      { $set: { products: [] } }
    );

    // lấy email user
    if (userId) {
      const user = await Users.findById(userId)
        .select("email")
        .lean();

      if (user) {
        mailOrder.mailOrder(user.email, createOrder.general, items);
      }
    }

    return res.status(200).json({
      message: "Đặt hàng thành công"
    });

  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error.message}`
    });
  }
};

module.exports.myOrders = async (req, res) => {
  try {
    const token = req.cookies.token_client;

    let userId = null;
    // decode JWT
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id
    }
    const orders = await Orders.find({
      user_id: userId
    })
    return res.status(200).json({
      message: "OK",
      orders
    })
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi ${error}`
    })
  }
}