const Orders = require("../../models/order.models");
const Products = require("../../models/products.models");
const Vouchers = require("../../models/voucher.models");
const Cart = require("../../models/carts.model");
const Users = require("../../models/users.models");
const generalHelper = require("../../../../helper/generate");
const mailOrder = require("../../service/returnEmai.service");

module.exports.checkout = async (req, res) => {
  try {
    const { items, voucher_id } = req.body;
    const token_user = req.cookies.token_client || null;
    const cartId = req.cookies.cartId;

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
    req.body.general = general.toUpperCase();
    req.body.token_user = token_user;

    const createOrder = await Orders(req.body);
    await createOrder.save();

    for (const item of items) {
      await Products.updateOne(
        { _id: item.product_id },
        { $inc: { stock: -item.quantity } }
      );
    }

    if (voucher) {
      await Vouchers.updateOne(
        { _id: voucher._id },
        { $inc: { quantity: -1 } }
      );
    }

    await Cart.updateOne(
      { _id: cartId },
      { $set: { products: [] } }
    );


    const user = await Users.findOne(
      {
        tokenUser: token_user
      }
    ).select("email").lean();
    mailOrder.mailOrder(user.email, createOrder.general, req.body.items)


    return res.status(200).json({ message: "Đặt hàng thành công" });
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error.message}`
    });
  }
};

module.exports.myOrders = async (req, res) => {
  try {
    const token_user = req.cookies.token_client || "";
    const orders = await Orders.find({
      token_user: token_user
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