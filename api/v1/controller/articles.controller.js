const Articles = require("../models/articles.models");
const slugHelper = require("../../../helper/slugHelper");
const paginationHelper = require("../../../helper/pagination");
module.exports.create = async (req, res) => {
    try {
        if(req.body.title){
            req.body.slug = slugHelper(req.body.title);
        }
        if(req.body.position){
            req.body.position = Number(req.body.position)
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

        if(req.body.position){
            req.body.position = Number(req.body.position)
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

module.exports.getList = async (req, res) => {
    try {
        const find = {}
        const sort = {}
        console.log(req.query.sort)
        if(req.query.sort){
            const [key, value] = req.query.sort.split("-");
            sort[key] = value === "asc" ? 1 : -1;
        }

        if(req.query.sort === "featured-yes"){
            const [featured, value] = req.query.sort.split("-");
            find.featured = value
        }

        if(req.query.sort === "featured-no"){
            const [featured, value] = req.query.sort.split("-");
            find.featured = value
        }

        if(req.query.sort === "articleCategory-vouchers"){
            const [articleCategory, value] = req.query.sort.split("-");
            find.articleCategory = value
        }
        if(req.query.sort === "articleCategory-news"){
            const [articleCategory, value] = req.query.sort.split("-");
            find.articleCategory = value
        }

        const countArticle = await Articles.countDocuments();
        const objectPagination = paginationHelper({}, req.query, countArticle);

        const articles = await Articles
            .find(find)
            .limit(objectPagination.limit)
            .skip(objectPagination.skip)
            .sort(sort)
        return res.status(200).json({
            message: "OK",
            articles,
            pagination: objectPagination
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi ${error}`
        })
    }
}

module.exports.changeMulti = async (req, res) => {
    try {
        const key = req.body.typeChange;
        const ids = req.body.selectIds;

        if(!key){
            return res.status(400).json({
                message: "Vui lòng chọn hàng động cần thay đổi"
            });
        }
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                message: "Vui lòng chọn bài viết cần thay đổi"
            });
        }
         switch (key) {
            case "active":
                await Articles.updateMany(
                     { _id: { $in: ids } },
                    { status: key }
                )
                return res.status(200).json({
                    message: "Chuyển bài viết sang hoạt động"
                });
            case "inactive":
                await Articles.updateMany(
                     { _id: { $in: ids } },
                    { status: key }
                )
                return res.status(200).json({
                    message: "Chuyển bài viết sang không hoạt động"
                });
        
            default:
                return;
        }
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi ${error}`
        })
    }
}

module.exports.deleteArticle = async (req, res) => {
    try {
        await Articles.deleteOne({_id: req.query.id})
        return res.status(200).json({
            message: "Đã xóa thành công bài viết"
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi: ${error}`
        })
    }
}