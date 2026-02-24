module.exports.categoryValiable = async (req, res, next) => {
    if(!req.body.title){
        return res.status(400).json({
            message: `Vui lòng nhập tên danh mục `
        })
    }
    next();
}