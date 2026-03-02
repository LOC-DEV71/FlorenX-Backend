const Products = require("../models/products.models");
const Vouchers = require("../models/voucher.models");
const Orders = require("../models/order.models");
const Users = require("../models/users.models");
module.exports.index = async (req, res) => {
    try {

        // Doanh thu
        const orders = await Orders.find(
            {
                status: "done"
            }
        );
        const prices = orders.flatMap(order =>
            order.items.map(item => item.price)
        );

        const evenue = prices.reduce((item, totals) => totals + item, 0)
        //Tổng đơn
        const totalsOrder = await Orders.countDocuments();

        //tổng người dùng
        const totalUsers = await Users.countDocuments();

        //tổng voucher
        const totalVouchers = await Vouchers.countDocuments();



        const now = new Date();
        const currentYear = now.getFullYear();

        // Lấy năm từ query, nếu không có thì mặc định năm hiện tại
        const year = parseInt(req.query.year) || currentYear;

        // Nếu là năm hiện tại → lấy đến tháng hiện tại
        // Nếu là năm cũ → lấy đủ 12 tháng
        const isCurrentYear = year === currentYear;

        const start = new Date(year, 0, 1);
        const end = isCurrentYear
            ? new Date(year, now.getMonth() + 1, 1)
            : new Date(year + 1, 0, 1);

        const result = await Orders.aggregate([
            {
                $match: {
                    status: "done",
                    createdAt: { $gte: start, $lt: end }
                }
            },
            { $unwind: "$items" },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalRevenue: {
                        $sum: {
                            $multiply: ["$items.price", "$items.quantity"]
                        }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Format sang dạng chart
        const monthNames = [
            "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
            "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
        ];

        const totalMonths = isCurrentYear ? now.getMonth() + 1 : 12;

        const data = Array.from({ length: totalMonths }, (_, i) => {
            const found = result.find(r => r._id === i + 1);

            return {
                month: monthNames[i],
                value: found ? found.totalRevenue : 0
            };
        });
        return res.status(200).json({
            message: "OK",
            totalEvenue: evenue,
            totalsOrder: totalsOrder,
            totalUsers: totalUsers,
            totalVouchers: totalVouchers,
            data
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi: ${error}`
        })
    }
}
