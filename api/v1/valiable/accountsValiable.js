module.exports.createValiable = async (req, res, next) => {
    try {
        console.log(req.body)
        if (!req.body.fullname) {
            return res.status(400).json({
                message: "Vui lòng nhập họ và tên"
            })
        }
        if (!req.body.email) {
            return res.status(400).json({
                message: "Vui lòng nhập email"
            })
        }
        if (!req.body.role_slug) {
            return res.status(400).json({
                message: "Vui lòng chọn quyền"
            })
        }

        if (!req.body.confirmpassword) {
            return res.status(400).json({
                message: "Vui lòng nhập mật khẩu"
            })
        }
        if (!req.body.confirmpassword) {
            return res.status(400).json({
                message: "Vui lòng xác nhận mật khẩu"
            })
        }
        if (req.body.confirmpassword != req.body.password) {
            return res.status(400).json({
                message: "Mật khẩu xác nhận không giống mật khẩu đã nhập"
            })
        }
        next()
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi: ${error}`
        })

    }

}