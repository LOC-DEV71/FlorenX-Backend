const Vouchers = require("../models/voucher.models");
const VoucherUsages = require("../models/VoucherUsage.models");
const paginationHelper = require("../../../helper/pagination")
module.exports.getListVouchers = async (req, res) => {
    try {
        const find = {
           
        }

        // sắp xếp theo trạng thái
        if(req.query.sort){
            find.status = req.query.sort
        }

        // pagination
        const countVouchers = await Vouchers.countDocuments(find);
        const pagination = paginationHelper({}, req.query, countVouchers);
        
        const getVouchers = await Vouchers
            .find(find)
            .limit(pagination.limit)
            .skip(pagination.skip)
        return res.status(200).json({
            message: "Lấy vouchers thành công",
            vouchers: getVouchers,
            pagination
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi: ${error} `
        })
    }
}

module.exports.createVoucher = async (req, res) => {
    try {
        const createVoucher = new Vouchers(req.body);
        await createVoucher.save();

        const createVoucherUsage = new VoucherUsages({
            voucher_id: createVoucher._id.toString()
        })
        await createVoucherUsage.save();

        return res.status(200).json({
            message: "Tạo voucher mới thành công"
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi: ${error} `
        })
    }
}

module.exports.getOneVoucher = async (req, res) => {
    try {
        const id = req.params.id;
        const getVoucher = await Vouchers.findOne({
            _id: id
        });
        return res.status(200).json({
            message: "Lấy vouchers thành công",
            voucher: getVoucher
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi: ${error} `
        })
    }
}
module.exports.updateVoucher = async (req, res) => {
    try {
        const id = req.params.id;
        await Vouchers.updateOne(
            {_id: id},
            req.body
        );
        return res.status(200).json({
            message: "Cập nhật voucher thành công",
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi: ${error} `
        })
    }
}
module.exports.changeMultiVouchers = async (req, res) => {
    try {
        switch (req.body.changeMulti) {
            case "active":
                await Vouchers.updateMany(
                    {_id: {$in: req.body.selectedIds}},
                    {status: req.body.changeMulti}
                )
                return res.status(200).json({
                message: "Cập nhật trạng thái các voucher thành công",
                })
            case "inactive":
                await Vouchers.updateMany(
                    {_id: {$in: req.body.selectedIds}},
                    {status: req.body.changeMulti}
                )
                return res.status(200).json({
                message: "Cập nhật trạng thái các voucher thành công",
                })
            case "delete-all":
                await Vouchers.deleteMany(
                    {_id: {$in: req.body.selectedIds}}
                )
                return res.status(200).json({
                message: "Đã xóa các voucher",
                })
        
            default:
                return;
        }
        
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi: ${error} `
        })
    }
}

module.exports.deleteVoucher = async (req, res) => {
    try {
        await Vouchers.deleteOne({_id: req.query.id})
        return res.status(200).json({
            message: "Đã xóa thành công voucher"
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi: ${error}`
        })
    }
}