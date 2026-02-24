const Cart = require("../models/carts.model");
const Carts = require("../models/carts.model");
const Users = require("../models/users.models");
const Products = require("../models/products.models");
// [GET] /api/v1/carts
module.exports.index = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    if (!cartId) {
      return res.status(200).json({
        message: "Cart empty",
        products: []
      });
    }

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(200).json({
        message: "Cart not found",
        products: []
      });
    }

    const productIds = cart.products.map(item => item.product_id);

    const products = await Products.find({
      _id: { $in: productIds },
      deleted: false
    }).lean();

    const result = cart.products.map(cartItem => {
      const product = products.find(
        p => String(p._id) === String(cartItem.product_id)
      );

      if (!product) return null;

      return {
        product_id: product._id,
        title: product.title,
        thumbnail: product.thumbnail,
        price: product.price,
        discountPercentage: product.discountPercentage,
        quantity: cartItem.quantity,
        stock: product.stock,
        slug: product.slug
      };
    }).filter(Boolean);


    return res.status(200).json({
      message: "OK",
      products: result,
      voucher_id: cart.voucher_id || null
    });

  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};


// [POST] /api/v1/carts/create
module.exports.create = async (req, res) => {
  try {
    const cartId = req.cookies.cartId || null;
    const token_client = req.cookies.token_client || null;

    let cookieCart = null;
    if (cartId) {
      cookieCart = await Carts.findById(cartId);
      if (!cookieCart) {
        res.clearCookie("cartId");
        cookieCart = null;
      }
    }

    if (!token_client) {
      if (cookieCart) {
        return res.status(200).json({
          message: "Cart ready",
          cart: cookieCart
        });
      }

      const guestCart = await Carts.create({
        user_id: null,
        products: []
      });

      res.cookie("cartId", guestCart._id.toString(), {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 365 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({
        message: "Cart created",
        cart: guestCart
      });
    }

    const user = await Users.findOne({ tokenUser: token_client });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = user._id.toString();

    let userCart = await Carts.findOne({ user_id: userId });

    if (cookieCart?.user_id && cookieCart.user_id !== userId) {
      res.clearCookie("cartId");
      cookieCart = null;
    }

    if (!userCart) {
      if (cookieCart && !cookieCart.user_id) {
        cookieCart.user_id = userId;
        await cookieCart.save();

        res.cookie("cartId", cookieCart._id.toString(), {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 365 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
          message: "Cart ready",
          cart: cookieCart
        });
      }

      userCart = await Carts.create({
        user_id: userId,
        products: []
      });

      res.cookie("cartId", userCart._id.toString(), {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 365 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({
        message: "Cart created",
        cart: userCart
      });
    }

    res.cookie("cartId", userCart._id.toString(), {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Cart ready",
      cart: userCart
    });
  } catch (error) {
    return res.status(500).json({
      message: "Create cart failed"
    });
  }
};

// [POST] /api/v1/carts/add-to-cart
module.exports.addToCarts = async (req, res) => {
  try {
    const productId = req.query.productId;
    const cartId = req.cookies.cartId;
    const quantity = 1;

    if (!cartId) {
      return res.status(400).json({
        message: "Không tìm thấy giỏ hàng"
      });
    }

    const cart = await Carts.findOne({
      _id: cartId,
      "products.product_id": productId
    });

    if (cart) {
      await Carts.updateOne(
        {
          _id: cartId,
          "products.product_id": productId
        },
        {
          $inc: { "products.$.quantity": quantity }
        }
      );
    }
    else {
      await Carts.updateOne(
        { _id: cartId },
        {
          $push: {
            products: {
              product_id: productId,
              quantity
            }
          }
        }
      );
    }

    return res.status(200).json({
      message: "Thêm vào giỏ hàng thành công"
    });
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error.message}`
    });
  }
};
// [POST] /api/v1/carts/add-to-cart
module.exports.changeQantity = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const { product_id, value } = req.query;
    await Carts.updateOne(
      {
        _id: cartId,
        "products.product_id": product_id,
      },
      {
        $set: {
          "products.$.quantity": value,
        },
      }
    );

    return res.status(200).json({
      message: "OK"
    });
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error.message}`
    });
  }
};
// [POST] /api/v1/carts/add-to-cart
module.exports.deleteProduct = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    await Carts.updateOne(
      {_id: cartId}, 
      {
        $pull: {
          products: {product_id: req.query.product_id}
        }
      }
    )

    return res.status(200).json({
      message: "OK"
    });
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error.message}`
    });
  }
};
// [POST] /api/v1/carts/add-to-cart
module.exports.addVoucher = async (req, res) => {
  try {
    await Carts.updateOne(
      {_id: req.cookies.cartId},
      {voucher_id: req.query.voucher_id || null}
    )

    return res.status(200).json({
      message: "OK"
    });
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error.message}`
    });
  }
};
