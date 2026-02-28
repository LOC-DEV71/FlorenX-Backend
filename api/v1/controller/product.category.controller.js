const ProductCategorys = require("../models/product.category.models");
const Accounts = require("../models/accounts.models");
const Products = require("../models/products.models");
const AdminActivity = require("../models/adminActivitySchema");

const slugHelper = require("../../../helper/slugHelper");
const { buildTree } = require("../../../helper/categoryTreeHelper");
const searchHelper = require("../../../helper/search");

const logAdminActivity = async ({
  adminId,
  action,
  module,
  targetId = null,
  message,
  metadata = {}
}) => {
  await AdminActivity.create({
    admin_id: adminId,
    action,
    module,
    target_id: targetId,
    message,
    metadata
  });
};

module.exports.index = async (req, res) => {
  try {
    const find = {
      deleted: false
    };

    // search
    const search = searchHelper(req.query);
    if (search.regexList) {
      find.$and = search.regexList.map(r => ({ title: r }));
    }

    // sort
    let sort = {};
    if (req.query.sort) {
      const [key, value] = req.query.sort.split("-");
      sort[key] = value === "asc" ? 1 : -1;
    }

    const categories = await ProductCategorys.find(find).sort(sort);
    const tree = buildTree(categories);

    res.status(200).json({
      message: "OK",
      category: tree
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports.create = async (req, res) => {
  try {
    req.body.slug = slugHelper(req.body.title);

    const createCategory = new ProductCategorys(req.body);
    await createCategory.save();

    const accounts = await Accounts.findOne({
      deleted: false,
      token: req.token
    }).select("_id fullname");

    const fullname = accounts?.fullname || "Admin";

    await logAdminActivity({
      adminId: accounts?._id,
      action: "create",
      module: "product_categorys",
      targetId: createCategory._id,
      message: `${fullname} tạo danh mục ${createCategory.title}`
    });

    return res.status(200).json({
      message: "Tạo danh mục thành công"
    });
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error}`
    });
  }
};

module.exports.changeMulti = async (req, res) => {
  try {
    const { action, selectedIds } = req.body;

    const accounts = await Accounts.findOne({
      deleted: false,
      token: req.token
    }).select("_id fullname");

    const fullname = accounts?.fullname || "Admin";

    switch (action) {
      case "active":
        await ProductCategorys.updateMany(
          { _id: { $in: selectedIds } },
          { status: "active" }
        );

        await logAdminActivity({
          adminId: accounts?._id,
          action: "change-status",
          module: "product_categorys",
          message: `${fullname} đổi trạng thái nhiều danh mục sang active`,
          metadata: { ids: selectedIds, status: "active" }
        });

        return res.status(200).json({
          message: "Thay đổi trạng thái sang hoạt động"
        });

      case "inactive":
        await ProductCategorys.updateMany(
          { _id: { $in: selectedIds } },
          { status: "inactive" }
        );

        await logAdminActivity({
          adminId: accounts?._id,
          action: "change-status",
          module: "product_categorys",
          message: `${fullname} đổi trạng thái nhiều danh mục sang inactive`,
          metadata: { ids: selectedIds, status: "inactive" }
        });

        return res.status(200).json({
          message: "Thay đổi trạng thái sang không hoạt động"
        });

      case "delete-all":
        await ProductCategorys.updateMany(
          { _id: { $in: selectedIds } },
          { deleted: true }
        );

        await logAdminActivity({
          adminId: accounts?._id,
          action: "delete",
          module: "product_categorys",
          message: `${fullname} xoá nhiều danh mục`,
          metadata: { ids: selectedIds }
        });

        return res.status(200).json({
          message: "Đã xoá danh mục và chuyển vào thùng rác"
        });

      default:
        return res.status(400).json({
          message: "Vui lòng chọn ít nhất một bản ghi hoặc hành động"
        });
    }
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error}`
    });
  }
};

module.exports.delete = async (req, res) => {
  try {
    const id = req.query.id;
    const product = await Products.find({
      product_category_id: id
    });
    if(product.length > 0){
      return res.status(400).json({
        message: "Danh mục còn sản phẩm"
      })
    }
    const category = await ProductCategorys.find({_id: id})
    if(!category.parent_id){
      return res.status(400).json({
        message: "Danh mục còn danh mục con"
      })
    }

    console.log(category)
    await ProductCategorys.deleteOne({_id: id})
    return res.status(200).json({
      message: "Đã xóa danh mục"
    })
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error}`
    })
  }
}
