const Products = require("../models/products.models");
const Category = require("../models/product.category.models");
const Accounts = require("../models/accounts.models");
const AdminActivity = require("../models/adminActivitySchema");

const generateSlug = require("../../../helper/slugHelper");
const searchHelper = require("../../../helper/search");
const paginationHelper = require("../../../helper/pagination");

// Lưu hoạt động admin
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

// GET /admin/products
module.exports.index = async (req, res) => {
  try {
    const find = { deleted: false };

    // search
    const search = searchHelper(req.query);
    if (search.regexList) {
      find.$and = search.regexList.map(r => ({ title: r }));
    }

    // pagination
    const countProducts = await Products.countDocuments(find);
    const pagination = paginationHelper({}, req.query, countProducts);

    // sort
    let sort = {};
    if (req.query.sort) {
      const [key, value] = req.query.sort.split("-");
      sort[key] = value === "asc" ? 1 : -1;
    }
    
    if(req.query.sort === "featured-yes"){
      const [featured, type] = req.query.sort.split("-");
      find.featured = type;
    }
    if(req.query.sort === "featured-no"){
      const [featured, type] = req.query.sort.split("-");
      find.featured = type;
    }

    const products = await Products.find(find)
      .sort(sort)
      .limit(pagination.limit)
      .skip(pagination.skip);

    return res.status(200).json({
      message: "OK",
      products,
      pagination
    });
  } catch (error) {
    return res.status(400).json({ message: `Lỗi: ${error}` });
  }
};

//POST /admin/products/change-multi 
module.exports.changeMulti = async (req, res) => {
  try {
    const type = req.body.bulkAction;
    const ids = req.body.selectedIds;

    const account = await Accounts.findOne({
      deleted: false,
      token: req.token
    }).select("_id fullname");

    const fullname = account?.fullname || "Admin";

    switch (type) {
      case "inactive":
        await Products.updateMany(
          { _id: { $in: ids } },
          { status: "inactive" }
        );

        await logAdminActivity({
          adminId: account._id,
          action: "change-status",
          module: "products",
          message: `${fullname} đổi trạng thái nhiều sản phẩm sang inactive`,
          metadata: { ids, status: "inactive" }
        });

        return res.status(200).json({
          message: "Đã chuyển sang không hoạt động"
        });

      case "active":
        await Products.updateMany(
          { _id: { $in: ids } },
          { status: "active" }
        );

        await logAdminActivity({
          adminId: account._id,
          action: "change-status",
          module: "products",
          message: `${fullname} đổi trạng thái nhiều sản phẩm sang active`,
          metadata: { ids, status: "active" }
        });

        return res.status(200).json({
          message: "Đã chuyển sang hoạt động"
        });

      case "delete-all":
        await Products.updateMany(
          { _id: { $in: ids } },
          { deleted: true }
        );

        await logAdminActivity({
          adminId: account._id,
          action: "delete",
          module: "products",
          message: `${fullname} xoá nhiều sản phẩm`,
          metadata: { ids }
        });

        return res.status(200).json({
          message: "Đã chuyển vào thùng rác"
        });

      default:
        return res.status(400).json({
          message: "Hành động không hợp lệ"
        });
    }
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi ${error}`
    });
  }
};

// POST /admin/products
module.exports.create = async (req, res) => {
  try {
    req.body.slug = generateSlug(req.body.title);

    if (req.body.specs) {
      req.body.specs = JSON.parse(req.body.specs);
    }

    const account = await Accounts.findOne({
      deleted: false,
      token: req.token
    }).select("_id fullname");

    const fullname = account?.fullname || "Admin";

    const createProducts = new Products(req.body);
    await createProducts.save();

    await logAdminActivity({
      adminId: account._id,
      action: "create",
      module: "products",
      targetId: createProducts._id,
      message: `${fullname} tạo sản phẩm ${req.body.title}`
    });

    return res.status(200).json({
      message: "Thêm sản phẩm thành công"
    });
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error}`
    });
  }
};

// GET /admin/products/:slug
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug;

    const record = await Products.findOne({
      deleted: false,
      slug
    }).lean();

    if (!record) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    if (record.product_category_id) {
      const category = await Category.findOne({
        deleted: false,
        _id: record.product_category_id
      }).select("title");

      record.title_category = category?.title || "";
    }

    return res.status(200).json({
      message: "OK",
      record
    });
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error}`
    });
  }
};


// PATCH /admin/products/:slug

module.exports.update = async (req, res) => {
  try {
    const slug = req.params.slug;
    req.body.slug = generateSlug(req.body.title);
    if (req.body.specs) {
      req.body.specs = JSON.parse(req.body.specs);
    }

    const oldProduct = await Products.findOne({ slug });

    await Products.updateOne({ slug }, req.body);

    const account = await Accounts.findOne({
      deleted: false,
      token: req.token
    }).select("_id fullname");

    const fullname = account?.fullname || "Admin";

    await logAdminActivity({
      adminId: account._id,
      action: "update",
      module: "products",
      targetId: oldProduct?._id,
      message: `${fullname} cập nhật sản phẩm ${req.body.title}`,
      metadata: {
        before: {
          title: oldProduct?.title,
          price: oldProduct?.price,
          status: oldProduct?.status
        },
        after: {
          title: req.body.title,
          price: req.body.price,
          status: req.body.status
        }
      }
    });

    return res.status(200).json({
      message: "Cập nhật thành công"
    });
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error}`
    });
  }
};
