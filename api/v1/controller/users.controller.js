const Users = require("../models/users.models")
const Roomchats = require("../models/roomChat.model");
const md5 = require("md5");
const Otp = require("../models/otp-register.models");
const randomOtp = require("../../../helper/generate");
const jwtHelper = require("../../../helper/jwr.helper")
const mailService = require("../service/returnEmai.service");

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports.index = async (req, res) => {
    return res.status(200).json({
        message: "OK"
    })
}



module.exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await Users.findOne({ email });

    if (!user) {
      user = await Users.create({
        email,
        fullName: name,
        avatar: picture,
        password: null
      });
    }

    console.log("USER OK");

    const tokenSystem = jwtHelper.createToken(
      { id: user._id, type: "login" },
      "7d"
    );

    console.log("TOKEN CREATED:", tokenSystem);

    res.cookie("token_client", tokenSystem, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    console.log("COOKIE SET");

    return res.json({ ok: true });

  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);
    return res.json({ ok: false, data: error.message });
  }
};

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
      password: md5(password),
    });
    await newUser.save();

    const roomChat = new Roomchats({
      user_id: newUser._id
    })
    await roomChat.save();

    await Otp.deleteMany({ email, type: "register" });

    const token_client = jwtHelper.createToken(
      { id: newUser._id, type: "login" },
      "7d"
    );

    res.cookie("token_client", token_client, {
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

        const token_client = jwtHelper.createToken(
          { id: user._id, type: "login" },
          "7d"
        );
        res.cookie("token_client", token_client, {
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
        message: "OK",
        user: req.user
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
        mailService.mailService(email, otp)


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
    const token_client = jwtHelper.createToken(
      { id: user._id, type: "reset" },
      "15m"
    );


    res.cookie("token_client", token_client, {
      // httpOnly: true,
      // sameSite: "lax",
      // maxAge: 15 * 60 * 1000
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000
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
    const { password, repassword } = req.body;
    const token = req.cookies.token_client; 

    if (!token) {
      return res.status(401).json({
        message: "Chưa xác thực"
      });
    }

    if (password !== repassword) {
      return res.status(400).json({
        message: "Mật khẩu không trùng khớp"
      });
    }

    // Verify JWT
    const decoded = jwtHelper.verifyToken(token);

    // Bắt buộc phải là reset token
    if (decoded.type !== "reset") {
      return res.status(401).json({
        message: "Token không hợp lệ"
      });
    }

    const user = await Users.findOne({
      _id: decoded.id,
      deleted: false
    });

    if (!user) {
      return res.status(400).json({
        message: "User không tồn tại"
      });
    }

    if (md5(password) === user.password) {
      return res.status(400).json({
        message: "Không dùng mật khẩu gần đây"
      });
    }

    user.password = md5(password);
    await user.save();

    // Xóa reset token sau khi đổi mật khẩu
    res.clearCookie("token_client", {
      sameSite: "none",
      secure: true
    });

    return res.status(200).json({
      message: "Đổi mật khẩu thành công"
    });

  } catch (error) {
    return res.status(401).json({
      message: "Token không hợp lệ hoặc đã hết hạn"
    });
  }
};