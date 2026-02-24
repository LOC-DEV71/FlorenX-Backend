const PermissionGroup = require("../models/permission.group");
module.exports.getPermission = async (req, res) => {
    try {
        const permissionGroups = await PermissionGroup.find()

        return res.status(200).json({
            message: "OK", permissionGroups
        })
    } catch (error) {
        return res.status(400).json({
            message: "Lỗi"
        })
    }
}