const ActivityAdminn = require("../models/adminActivitySchema");
module.exports.getNotifications = async (req, res) => {
    const notifications = await ActivityAdminn.find().sort({ createdAt: -1 }).limit(req.query.limit || 30);
    return res.status(200).json({
        message: "OK",
        notifications
    });
}