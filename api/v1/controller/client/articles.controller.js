const Articles = require("../../models/articles.models");
const paginationHelper = require("../../../../helper/pagination");
module.exports.getList = async (req, res) => {
    try {
        const category = req.query.category;
        const articles = await Articles.find({
            featured: "yes",
            status: "active",
            articleCategory: category
        }).limit(4).sort({position: 1})
        return res.status(200).json({
            message: "OK",
            articles,
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
module.exports.getByLocation = async (req, res) => {
    try { 
        const category = req.query.category || "";
        const limit = req.query.limit || 0;
        const skip = req.query.skip || 0;
        const articles = await Articles.find({
            featured: "yes",
            status: "active",
            articleCategory: category
        }).limit(Number(limit)).sort({position: 1}).skip((skip))
        return res.status(200).json({
            message: "OK",
            articles,
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi ${error}`
        })
    }
}
module.exports.getAll = async (req, res) => {
    try { 
        const category = req.query.category || "";
        const limit = req.query.limit || 0;
        const skip = req.query.skip || 0;
        const allArticles = await Articles.find({
            status: "active",
            featured: "no",
            articleCategory: category
        }).limit(Number(limit)).sort({position: 1}).skip((skip))
        return res.status(200).json({
            message: "OK",
            allArticles,
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi ${error}`
        })
    }
}
