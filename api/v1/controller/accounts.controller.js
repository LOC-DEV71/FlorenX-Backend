const Accounts = require("../models/accounts.models");
const Roles = require("../models/roles.models");
const paginationHelper = require("../../../helper/pagination");
module.exports.index = async (req, res) => {
  try {
    const countAccounts = await Accounts.countDocuments({ deleted: false });
    const pagination = paginationHelper({}, req.query, countAccounts);

    const recordAccounts = await Accounts.find({})
      .limit(pagination.limit)
      .skip(pagination.skip)
    const recordRoles = await Roles.find({ deleted: false });

    const result = [];

    recordAccounts.forEach(account => {
      const role = recordRoles.find(
        r => r.slug === account.role_slug
      );

      result.push({
        ...account.toObject(),
        role_title: role ? role.title : null
      });
    });



    return res.status(200).json({
      message: "OK",
      accounts: result,
      pagination
    });
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error}`
    });
  }
};

module.exports.create = async (req, res) => {
  try {

    delete req.body.confirmpassword;

    if (req.body.thumbnail) {
      req.body.avatar = req.body.thumbnail;
      delete req.body.thumbnail;
    }
    const createAccount = new Accounts(req.body);
    await createAccount.save();

    return res.status(200).json({
      message: "Tạo tài khoản thành công"
    })
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error}`
    })
  }
}
module.exports.changeMultiAccounts = async (req, res) => {
  try {
    switch (req.body.changeMulti) {
      case "active":
        await Accounts.updateMany(
          { _id: { $in: req.body.selectIds } },
          { status: req.body.changeMulti }
        )
        return res.status(200).json({
          message: "Cập nhật trạng thái các tài khoản quản trị thành công",
        })
      case "inactive":
        await Accounts.updateMany(
          { _id: { $in: req.body.selectIds } },
          { status: req.body.changeMulti }
        )
        return res.status(200).json({
          message: "Cập nhật trạng thái các tài khoản quản trị thành công",
        })
      case "delete-all":
        await Accounts.deleteMany(
          { _id: { $in: req.body.selectIds } }
        )
        return res.status(200).json({
          message: "Đã xóa các tài khoản quản trị",
        })

      default:
        return;
    }
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error}`
    })
  }
}

module.exports.delete = async (req, res) => {
  try {
    await Accounts.deleteOne({_id: req.query.id})
    return res.status(200).json({
      message: "Đã xóa tài khoản thành công"
    })
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error}`
    })
  }
}