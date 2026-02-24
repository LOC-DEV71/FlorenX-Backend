module.exports.productsValiable = async (req, res, next) => {
    if(!req.body.title){
        return res.status(400).json({
            message: `Vui lòng nhập tên sản phẩm`
        })
    }
    if(!req.body.price){
        return res.status(400).json({
            message: `Vui lòng nhập giá sản phẩm`
        })
    }
    if(!req.body.stock){
        return res.status(400).json({
            message: `Vui lòng nhập số lượng`
        })
    }

    next();

}