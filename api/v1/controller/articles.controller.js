const Articles = require("../models/articles.models");
const slugHelper = require("../../../helper/slugHelper");
module.exports.create = async (req, res) => {
    try {
        if(req.body.title){
            req.body.slug = slugHelper(req.body.title);
        }
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

module.exports.getDetail = async (req, res) => {
    try {
        const slug = req.query.slug || "";
        if(!slug){
            return res.status(400).json({
                message: "Bài viết không tồn tại"
            })
        }

        const articleDetail = await Articles.findOne({
            slug: slug
        })

        return res.status(200).json({
            message: "OK",
            article: articleDetail
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi ${error}`
        })
    }
}

module.exports.update = async (req, res) => {
    try {
        const slug = req.query.slug || "";
        if(!slug){
            return res.status(400).json({
                message: "Bài viết không tồn tại"
            })
        }

        if(req.body.title){
            req.body.slug = slugHelper(req.body.title)
        }

        await Articles.updateOne(
            {slug: slug},
            req.body
        )

        return res.status(200).json({
            message: "Cập nhật thành công",
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi ${error}`
        })
    }
}