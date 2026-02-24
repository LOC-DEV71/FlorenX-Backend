const Articles = require("../models/articles.models");
module.exports.create = async (req, res) => {
    try {
        const createArticle = new Articles(req.body);
        await createArticle.save();

        return res.status(200).json({
            message: "OK"
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi ${error}`
        })
    }
}