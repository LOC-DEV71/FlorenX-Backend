const Accounts = require("../models/accounts.models");
const Role = require("../models/roles.models");
module.exports.login = async (req, res) => {
    try {
        const checkEmail = await Accounts.findOne({
            deleted: false,
            email: req.body.email
        })

        if(!checkEmail){
            return res.status(400).json({
                message: "Email không tồn tại"
            })
        }
        if(checkEmail.status === "inactive"){
            return res.status(400).json({
                message: "Tài khoản của bạn bị khóa"
            })
        }

        if(req.body.password != checkEmail.password){
            return res.status(400).json({
                message: "Mật khẩu không chính xác"
            })
        } 
        res.cookie("token", checkEmail.token, {
            // locals
            // httpOnly: true,
            // sameSite: "lax",
            // maxAge: 2 * 24 * 60 * 60 * 1000
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 2 * 24 * 60 * 60 * 1000
        });

        await Accounts.updateOne(
            { _id: checkEmail._id },
            { loginAt: Date.now() }
        );

        return res.status(200).json({
            message: "Đăng nhập thành công"
        })

    } catch (error) {
        return res.status(400).json({
            message: "Đăng nhập thất bại"
        })
    }
}

module.exports.getme = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ 
        message: "Bạn không có quyền" 
    });
    }

    const admin = await Accounts.findOne({ 
        token, 
        deleted: false 
    }).lean().select("-password -token")

    if (!admin) {
      return res.status(401).json({ 
        message: "Không xác thực"
     });
    }

    const role = await Role.findOne({ slug: admin.role_slug });

    admin.role_title = role.title
    admin.role_permission = role.permissions

    return res.status(200).json({
        admin
    });

  } catch (err) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
};

module.exports.logout = async (req, res) =>{
    try {
        res.clearCookie("token", {
            // sameSite: "none",
            // secure: true
        })
        return res.status(200).json({
            message: "OK"
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi: ${error}`
        })
    }
}