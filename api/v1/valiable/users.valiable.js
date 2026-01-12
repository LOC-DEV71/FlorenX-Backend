module.exports.registerValiable = async (req, res, next) => {
    if(!req.body.email){
        return res.status(400).json({
            message: `Vui lòng nhập email`
        })
    }
    if(!req.body.fullname){
        return res.status(400).json({
            message: `Vui lòng nhập họ tên`
        })
    }
    if(!req.body.password){
        return res.status(400).json({
            message: `Vui lòng nhập mật khẩu`
        })
    }

    next();

}
module.exports.loginValiable = async (req, res, next) => {
    if(!req.body.email){
        return res.status(400).json({
            message: `Vui lòng nhập email`
        })
    }
    if(!req.body.password){
        return res.status(400).json({
            message: `Vui lòng nhập mật khẩu`
        })
    }

    next();

}