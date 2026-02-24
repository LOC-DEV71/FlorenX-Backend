module.exports.authValiable = async (req, res, next) => {
    try {
        if(!req.body.email){
            return res.status(400).json({
                message: "Vui lòng nhập email"
            })
        }
        if(!req.body.password){
            return res.status(400).json({
                message: "Vui lòng nhập mật khẩu"
            })
        }

        next()
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi: ${error}`
        })
    }
}