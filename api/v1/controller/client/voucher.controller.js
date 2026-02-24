const Vouchers = require("../../models/voucher.models");
module.exports.index = async (req, res) => {
    try {
        const vouchers = await Vouchers.find({
            status: "active",
        })
        return res.status(200).json({
            message: "OK",
            vouchers
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi: ${error}`
        })
    }
}