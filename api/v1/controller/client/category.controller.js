const Category = require("../../models/product.category.models");
const categoryHelper = require("../../../../helper/categoryTreeHelper");
module.exports.index = async (req, res) => {
    try {
        const geCategory = await Category.find();
        const category = categoryHelper.buildTree(geCategory)

        return res.status(200).json({
            category
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi: ${error}`
        })
    }
}