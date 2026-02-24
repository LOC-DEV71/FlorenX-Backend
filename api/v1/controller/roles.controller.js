const slugHelper = require("../../../helper/slugHelper");
const Roles = require("../models/roles.models");
const Accounts = require("../models/accounts.models");
const Chats = require("../models/roomChat.model");
const AdminActivity = require("../models/adminActivitySchema");
const paginationHelper = require("../../../helper/pagination");

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

module.exports.create = async (req, res) => {
  try {
    if (!req.body.slug) {
      req.body.slug = slugHelper(req.body.title);
    }

    const createRoles = new Roles(req.body);
    await createRoles.save();

    const account = await Accounts.findOne({
      deleted: false,
      token: req.token
    }).select("_id fullname");

    const fullname = account?.fullname || "Admin";

    await logAdminActivity({
      adminId: account?._id,
      action: "create",
      module: "roles",
      targetId: createRoles._id,
      message: `${fullname} tạo role ${createRoles.title}`
    });

    return res.status(200).json({
      message: "Tạo role thành công"
    });
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error}`
    });
  }
};

module.exports.update = async (req, res) => {
  try {
    const oldRole = await Roles.findOne({ _id: req.body._id });
    console.log(oldRole)

    await Roles.updateOne(
      { _id: req.body._id },
      req.body
    );

    const account = await Accounts.findOne({
      deleted: false,
      token: req.token
    }).select("_id fullname");
    console.log(account)  

    const fullname = account?.fullname || "Admin";

    await logAdminActivity({
      adminId: account?._id,
      action: "update",
      module: "roles",
      targetId: oldRole?._id,
      message: `${fullname} cập nhật role ${oldRole?.title || ""}`,
      metadata: {
        before: {
          title: oldRole?.title,
          permissions: oldRole?.permissions
        },
        after: {
          title: req.body.title,
          permissions: req.body.permissions
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

module.exports.get = async (req, res) => {
  try {
    const find = {
      deleted: false
    };

    const countRoles = await Roles.countDocuments({});
    const pagination = paginationHelper({}, req.query, countRoles);

    const roles = await Roles.find(find).limit(pagination.limit).skip(pagination.skip)

    return res.status(200).json({
      message: "Lấy thành công",
      roles,
      pagination
    });
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error}`
    });
  }
};
module.exports.getList = async (req, res) => {
  try {
    const roles = await Roles.find()
    return res.status(200).json({
      message: "Lấy thành công",
      roles,
    });
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error}`
    });
  }
};
