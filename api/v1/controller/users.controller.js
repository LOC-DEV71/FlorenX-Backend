const Users = require("../models/users.models")
const Roomchats = require("../models/roomChat.model");
const md5 = require("md5");
const Otp = require("../models/otp-register.models");
const randomOtp = require("../../../helper/generate");
const mailService = require("../service/returnEmai.service");
module.exports.index = async (req, res) => {
    return res.status(200).json({
        message: "OK"
    })
}

// [POST] /api/v1/users/register/verify
module.exports.verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp, fullname, password } = req.body;

    const otpRecord = await Otp.findOne({
      email,
      otp,
      type: "register"
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP không hợp lệ hoặc đã hết hạn"
      });
    }

    const newUser = new Users({
      fullname,
      email,
      password: md5(password)
    });
    await newUser.save();

    const roomChat = new Roomchats({
      user_id: newUser._id
    })
    await roomChat.save();

    await Otp.deleteMany({ email, type: "register" });

    res.cookie("token_client", newUser.tokenUser, {
      // httpOnly: true,
      // sameSite: "lax",
      // maxAge: 7 * 24 * 60 * 60 * 1000
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Đăng ký thành công"
    });
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error}`
    });
  }
};

// [POST] /api/v1/users/register/verify/otp
module.exports.sendRegisterOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if(!email){
        return res.status(400).json({
            message: "Vui lòng nhập đủ thông tin"
        });
    }

    const user = await Users.findOne({ email, deleted: false });
    if (user) {
      return res.status(400).json({
        message: "Email đã tồn tại"
      })
    }

    //random số ở helper
    const otp = randomOtp.generateRandomNumber(8);
    const expireInSeconds = 5;


    await Otp.create({
      email,
      otp,
      type: "register",
      expireAt: new Date(Date.now() + expireInSeconds * 60 * 1000) 
    });

    // gửi về mail ở service
    await mailService.mailService(email, otp)

    return res.status(200).json({
      message: "Đã gửi OTP"
    });
  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error}`
    });
  }
};

// [POST] /api/v1/users/login
module.exports.login = async (req, res) => {
    try {
        const user = await Users.findOne({
            deleted: false,
            email: req.body.email
        })

        if(!user){
            return res.status(400).json({
                message: `Email không tồn tại`
            })
        }

        if(md5(req.body.password) != user.password){
            return res.status(400).json({
                message: `Mật khẩu không chính xác`
            })
        }

        res.cookie("token_client", user.tokenUser, {
            // httpOnly: true,
            // secure: false,      // true nếu https
            // sameSite: "lax",    // QUAN TRỌNG
            // maxAge: 7 * 24 * 60 * 60 * 1000

            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

    
        return res.status(200).json({
            message: "Đăng nhập thành công",
            user: user.tokenUser
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi: ${error}`
        })
    }
}

// [GET] /api/v1/users/me
module.exports.me = async (req, res) => {
    return res.status(200).json({
        message: "OK"
    })
}

// [GET] /api/v1/users/my-account
module.exports.accountUser = async (req, res) =>{
    const user = req.user;

    return res.status(200).json({
        message: "OK",
        info: user
    })
        
}

// [POST] /api/v1/users/logout
module.exports.logout = async (req, res) =>{
    try {
        res.clearCookie("token_client", {
          sameSite: "none",
          secure: true
        })
        res.clearCookie("cartId")
        return res.status(200).json({
            message: "OK"
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi: ${error}`
        })
    }
}

// [POST] /api/v1/users/update
module.exports.update = async (req, res) =>{
    await Users.updateOne(
        {
            _id: req.body._id
        }, 
        req.body
    )

    return res.status(200).json({
        message: "Cập nhật thành công"
    })
}

/// [POST] /api/v1/users/forrgot-password
module.exports.forgotPassword = async (req, res) =>{
    try {
        const email = req.body.email;
        if(!email){
            return res.status(400).json({
                message: "vui lòng nhập email"
            })
        }
        const user = await Users.findOne({
            deleted: false,
            email: email
        })

        if(!user){
            return res.status(400).json({
                message: "Email không tồn tại"
            })
        }

        //random số ở helper
        const otp = randomOtp.generateRandomNumber(8);
        const expireInSeconds = 5;


        await Otp.create({
            email,
            otp,
            type: "forgot",
            expireAt: new Date(Date.now() + expireInSeconds * 60 * 1000) 
        });
        

        // gửi về mail ở service
        await mailService.mailService(email, otp)


        return res.status(200).json({
            message: "Đã gửi mã otp"
        })


    } catch (error) {
        return res.status(400).json({
            message: `Looix: ${error}`
        })
    }   
}
// [POST] /api/v1/users/forrgot-password/otp
module.exports.forgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Thiếu email" });
    }

    if (!otp) {
      return res.status(400).json({ message: "Vui lòng nhập OTP" });
    }

    const record = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!record || record.expiresAt < Date.now()) {
      await Otp.deleteMany({ email });
      return res.status(400).json({
        message: "OTP đã hết hạn, vui lòng gửi lại"
      });
    }

    if (record.otp !== otp) {
      return res.status(400).json({
        message: "Mã OTP không chính xác"
      });
    }

    const user = await Users.findOne({ deleted: false, email });

    if (!user) {
      return res.status(400).json({
        message: "Tài khoản không tồn tại"
      });
    }

    res.cookie("token_client", user.tokenUser, {
      // httpOnly: true,
      // sameSite: "lax",
      // maxAge: 15 * 60 * 1000
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 2 * 24 * 60 * 60 * 1000
    });

    await Otp.deleteMany({ email });

    return res.status(200).json({
      message: "Chuyển sang trang đổi mật khẩu"
    });

  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error}`
    });
  }
};
// [POST] /api/v1/users/forrgot-password/otp
module.exports.resetPassword = async (req, res) => {
  try {
    const {password, repassword} = req.body;
    const token = req.cookies.token;

    if(password != repassword){
        return res.status(400).json({
            message: `Mật khẩu không trùng khớp`
        });
    }

    const user = await Users.findOne({
        deleted: false,
        tokenUser: token
    })

    if(!user){
        return res.status(400).json({
            message: `Token không hợp lệ`
        });
    }
    if(md5(password) == user.password){
        return res.status(400).json({
            message: `Không dùng mật khẩu gần đây`
        });
    }

    await Users.updateOne(
        {
            tokenUser: token
        },
        {
            password: md5(password)
        }
    )


    return res.status(200).json({
      message: "Đổi mật khẩu thành công"
    });

  } catch (error) {
    return res.status(400).json({
      message: `Lỗi: ${error}`
    });
  }
};
