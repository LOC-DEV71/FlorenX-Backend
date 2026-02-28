const Products = require("../../models/products.models");
const Category = require("../../models/product.category.models");
const Order = require("../../models/order.models");
const User = require("../../models/users.models");
const getAllCategoryId = require("../../../../helper/getCategoryIds");

module.exports.index = async (req, res) => {
  try {
    const slug = req.query.slug;
    const category = await Category.findOne({ slug: slug, deleted: false });

    if (!category) {
      return res.status(404).json({
        message: "Category PC không tồn tại"
      });
    }

   const childCategoryIds = await getAllCategoryId(category._id.toString());


    const categoryIds = [
      category._id.toString(),
      ...childCategoryIds
    ];

    const products = await Products.find(
        {
          product_category_id: {$in: categoryIds},
          featured: "yes"
        }
    )   

    
    return res.status(200).json({
      message: "OK",
      products
    });

  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error.message}`
    });
  }
};

module.exports.indexAll = async (req, res) => {
  try {
    const slug = req.query.slug;
    const category = await Category.findOne({ slug: slug, deleted: false });

    if (!category) {
      return res.status(404).json({
        message: "Category PC không tồn tại"
      });
    }

   const childCategoryIds = await getAllCategoryId(category._id.toString());


    const categoryIds = [
      category._id.toString(),
      ...childCategoryIds
    ];

    const products = await Products.find(
        {
          product_category_id: {$in: categoryIds},
        }
    )   

    
    return res.status(200).json({
      message: "OK",
      products
    });

  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error.message}`
    });
  }
};

module.exports.productSimilar = async (req, res) => {
  try {
    const product_category_id = req.query.product_category_id;

    const childCategoryIds = await getAllCategoryId(product_category_id);


    const categoryIds = [
      product_category_id,
      ...childCategoryIds
    ];

    const products = await Products.find(
        {
          product_category_id: {$in: categoryIds},
        }
    )   

    return res.status(200).json({
      message: "OK",
      products
    });

  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error.message}`
    });
  }
};

module.exports.detail = async (req, res) => {
  try {
    const product = await Products.findOne({
      deleted: false,
      slug: req.params.slug
    })

    return res.status(200).json({
      product
    })
  } catch (error) {
    return res.status(400).json({
      message: `error: ${error}`
    })
  }
}

module.exports.evaluate = async (req, res) => {
  try {
    const product_id = req.query.product_id;
    const token_user = req.cookies.token_client;
    const {rating, comment} = req.body;

    const user = await User.findOne({
      tokenUser: token_user
    }).lean().select("_id fullname")
    
    if(!user){
      return res.status(401).json({
        message: "Không tìm thấy người dùng"
      });
    }

    const order = await Order.findOne({
      token_user: token_user,
      status: "done",
      "items.product_id": product_id
    })

    if(!order){
      return res.status(401).json({
        message: "Bạn chưa đủ quyền để đánh giá sản phẩm này"
      });
    }
    await Products.updateOne(
      { _id: product_id },
      {
        $push: {
          evaluate: {
            user_id: user._id,
            user_name: user.fullname,
            rating,
            comment,
            createdAt: new Date()
          }
        }
      }
    );

    return res.status(200).json({
      message: "Đánh giá thành công"
    });

  } catch (error) {
    return res.status(500).json({
      message: `Lỗi: ${error.message}`
    });
  }
};