const Articles = require("../../models/articles.models");
module.exports.getList = async (req, res) => {
    try {
        const articles = await Articles.find({
            featured: "yes",
        }).limit(4)
        return res.status(200).json({
            message: "OK",
            articles
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi ${error}`
        })
    }
}
module.exports.getDetail = async (req, res) => {
    try {
        const slug = req.query.slug || "";
        if(!slug){
            return res.status(400).json({
                message: `Lỗi ${error}`
            })
        }
        const article = await Articles.findOne({
            slug: slug
        })
        return res.status(200).json({
            message: "OK",
            article
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi ${error}`
        })
    }
}