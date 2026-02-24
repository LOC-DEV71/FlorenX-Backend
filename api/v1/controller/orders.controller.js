const Orders = require("../models/order.models");
const Products = require("../models/products.models");
const Vouchers = require("../models/voucher.models");
const Users = require("../models/users.models");
const Accounts = require("../models/accounts.models");
const AdminActivity = require("../models/adminActivitySchema");
const paginationHelper = require("../../../helper/pagination");
const mailOrder = require("../service/returnEmai.service")
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
module.exports.index = async (req, res) => {
    try {
        const query = req.query || null;
        const countOrders = await Orders.countDocuments();
        const find = {
            status: "pending"
        }

        if(req.query.sort){
            find.status = req.query.sort || null
        }

        const ordersList = await Orders
            .find(find)
        const pagination = paginationHelper({}, query, countOrders)
        return res.status(200).json({
            message: "OK",
            orders: ordersList,
            pagination
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi ${error}`
        })
    }
}
module.exports.orderDetail = async (req, res) => {
  try {
    const { general } = req.params;

    const order = await Orders.findOne({ general }).lean()
    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng"
      });
    }

    let voucher = null;

    if (order.voucher_id) {
      voucher = await Vouchers.findById(order.voucher_id);
    }

    order.value = voucher?.value || 0;
    order.type = voucher?.type || null;

    return res.status(200).json({
      message: "OK",
      order
    });

  } catch (error) {
    return res.status(400).json({
      message: `Lỗi ${error}`
    });
  }
};
module.exports.changeMulti = async (req, res) => {
    try {
        const {ids, type} = req.body;
        const account = await Accounts.findOne({
            deleted: false,
            token: req.cookies.token
        }).select("_id fullname");
        
        const fullname = account?.fullname || "Admin";
        switch (type) {
            case "confirm":
                await Orders.updateMany(
                    {_id: {$in: ids}},
                    {status: type}
                )
                 await logAdminActivity({
                    adminId: account._id,
                    action: "change-status",
                    module: "orders",
                    message: `${fullname} đã xác nhận đơn hàng`,
                    metadata: { ids, status: type }
                });
                return res.status(200).json({
                    message: "Đã xác nhận đơn hàng",
                });
            case "shipping":
                await Orders.updateMany(
                    {_id: {$in: ids}},
                    {status: type}
                )
                 await logAdminActivity({
                    adminId: account._id,
                    action: "change-status",
                    module: "orders",
                    message: `${fullname} đã chuyển cho đơn vị vận chuyển`,
                    metadata: { ids, status: type }
                });
                
                return res.status(200).json({
                    message: "Chuyển cho đơn vị vận chuyển",
                });
            case "done":
                await Orders.updateMany(
                    {_id: {$in: ids}},
                    {status: type}
                )
                 await logAdminActivity({
                    adminId: account._id,
                    action: "change-status",
                    module: "orders",
                    message: `${fullname} đã xác nhận đơn hàng`,
                     metadata: { ids, status: type }
                });
                return res.status(200).json({
                    message: "Đã hoàn thành đơn hàng",
                });
            case "cancel":
                await Orders.updateMany(
                    {_id: {$in: ids}},
                    {status: type}
                )
                 await logAdminActivity({
                    adminId: account._id,
                    action: "change-status",
                    module: "orders",
                    message: `${fullname} đã hủy đơn hàng `,
                    metadata: { ids, status: type }
                });
                return res.status(200).json({
                    message: "Đã hoàn thành đơn hàng",
                });
                
            default:
                return
        }
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi ${error}`
        })
    }
}
module.exports.changeStatus = async (req, res) => {
    try {
        const {type, general} = req.query || null;
        switch (type) {
            case "confirm":
                await Orders.updateOne(
                    {general: general},
                    {status: type}
                )
                return res.status(200).json({
                    message: "Đã xác nhận đơn hàng"
                })
            case "cancel":
                await Orders.updateOne(
                    {general: general},
                    {status: type}
                )
                return res.status(200).json({
                    message: "Đã hủy đơn hàng"
                })
        
            default:
                return;
        }
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi ${error}`
        })
    }
}