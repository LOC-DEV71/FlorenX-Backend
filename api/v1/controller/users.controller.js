const Users = require("../models/users.models")
const md5 = require("md5");
const Otp = require("../models/otp-register.models");
const sendMailHelper = require("../../../helper/sendMail");
const randomOtp = require("../../../helper/generate");
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

    await Otp.deleteMany({ email, type: "register" });

    res.cookie("token", newUser.tokenUser, {
      httpOnly: true,
      sameSite: "lax",
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
      
    }

    const otp = randomOtp.generateRandomNumber(8);
    const expireInSeconds = 5;


    await Otp.create({
      email,
      otp,
      type: "register",
      expireAt: new Date(Date.now() + expireInSeconds * 60 * 1000) 
    });

    const subject = `Mã OTP xác minh lấy lại mật khẩu: ${otp}`;

    const html = `
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px 0;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
                
                <!-- Header -->
                <tr>
                <td align="center" bgcolor="#1976d2" style="padding: 30px 20px; background-color: #1976d2; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 24px; color: #ffffff;">VARUST VN</h1>
                    <p style="margin: 10px 0 0; font-size: 16px; color: #ffffff;">Xác minh lấy lại mật khẩu</p>
                </td>
                </tr>
                
                <!-- Body -->
                <tr>
                <td style="padding: 30px 40px; text-align: center;">
                    <p style="font-size: 16px; color: #333333; margin: 0 0 20px;">
                    Chào bạn,
                    </p>
                    <p style="font-size: 16px; color: #333333; margin: 0 0 30px;">
                    Chúng tôi nhận được yêu cầu lấy lại mật khẩu cho tài khoản<br>
                    <strong>${email}</strong>
                    </p>
                    
                    <!-- OTP Box -->
                    <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 30px 0;">
                    <tr>
                        <td align="center" bgcolor="#e3f2fd" style="padding: 20px 40px; background-color: #e3f2fd; border: 3px dashed #1976d2;">
                        <span style="font-size: 36px; font-weight: bold; color: #1976d2; letter-spacing: 8px;">${otp}</span>
                        </td>
                    </tr>
                    </table>
                    
                    <p style="font-size: 16px; color: #333333; margin: 30px 0 0;">
                    Mã OTP có hiệu lực trong <strong>5 phút</strong>.<br>
                    Vui lòng không chia sẻ mã này với bất kỳ ai.
                    </p>
                    
                    <p style="font-size: 14px; color: #888888; margin: 40px 0 0; padding-top: 20px; border-top: 1px solid #eeeeee;">
                    Nếu bạn không yêu cầu lấy lại mật khẩu, vui lòng bỏ qua email này.
                    </p>
                </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                <td align="center" bgcolor="#f5f5f5" style="padding: 20px; font-size: 12px; color: #999999;">
                    © 2025 Varust VN. All rights reserved.<br>
                    Email tự động - vui lòng không reply.
                </td>
                </tr>
            </table>
            </td>
        </tr>
        </table>
    `;

    sendMailHelper.sendMail(email, subject, html);

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

        res.cookie("token", user.tokenUser, {
            httpOnly: true,
            secure: false,      // true nếu https
            sameSite: "lax",    // QUAN TRỌNG
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
    try {
        const token = req.cookies.token;
        const user = await Users.findOne({
            deleted: false,
            tokenUser: token
        })
        if(!user){
            return res.status(400).json({
                message: "Token không hợp lệ"
            })
        }
        
        return res.status(200).json({
            message: "OK"
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi: ${error}`
        })
    }
}

// [GET] /api/v1/users/my-account
module.exports.accountUser = async (req, res) =>{
    try {
        const token = req.cookies.token;
        const user = await Users.findOne({
            deleted: false,
            tokenUser: token
        }).select("-password -tokenUser")

        if(!user){
            return res.status(400).json({
                message: "token không hợp lệ"
            })
        }

        return res.status(200).json({
            message: "OK",
            info: user
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi: ${error}`
        })
    }
}

// [POST] /api/v1/users/logout
module.exports.logout = async (req, res) =>{
    try {
        res.clearCookie("token")
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
    try {
       const token = req.cookies.token;
       const user = await Users.findOne({
        deleted: false,
        tokenUser: token
       })
       if(!user){
            return res.status(400).json({
                message: "token không hợp lệ"
            })
        }

        await Users.updateOne(
            {
                _id: req.body._id
            }, 
            req.body
        )

        return res.status(200).json({
            message: "Cập nhật thành công"
        })
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi: ${error}`
        })
    }
}

//// [POST] /api/v1/users/forrgot-password
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

        const otp = randomOtp.generateRandomNumber(8);
        const expireInSeconds = 5;


        await Otp.create({
            email,
            otp,
            type: "forgot",
            expireAt: new Date(Date.now() + expireInSeconds * 60 * 1000) 
        });

        const subject = `Mã OTP xác minh lấy lại mật khẩu: ${otp}`;

        const html = `
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
            <tr>
                <td align="center" style="padding: 20px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                    <td align="center" bgcolor="#1976d2" style="padding: 30px 20px; background-color: #1976d2; color: #ffffff;">
                        <h1 style="margin: 0; font-size: 24px; color: #ffffff;">VARUST VN</h1>
                        <p style="margin: 10px 0 0; font-size: 16px; color: #ffffff;">Xác minh lấy lại mật khẩu</p>
                    </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                    <td style="padding: 30px 40px; text-align: center;">
                        <p style="font-size: 16px; color: #333333; margin: 0 0 20px;">
                        Chào bạn,
                        </p>
                        <p style="font-size: 16px; color: #333333; margin: 0 0 30px;">
                        Chúng tôi nhận được yêu cầu lấy lại mật khẩu cho tài khoản<br>
                        <strong>${email}</strong>
                        </p>
                        
                        <!-- OTP Box -->
                        <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 30px 0;">
                        <tr>
                            <td align="center" bgcolor="#e3f2fd" style="padding: 20px 40px; background-color: #e3f2fd; border: 3px dashed #1976d2;">
                            <span style="font-size: 36px; font-weight: bold; color: #1976d2; letter-spacing: 8px;">${otp}</span>
                            </td>
                        </tr>
                        </table>
                        
                        <p style="font-size: 16px; color: #333333; margin: 30px 0 0;">
                        Mã OTP có hiệu lực trong <strong>5 phút</strong>.<br>
                        Vui lòng không chia sẻ mã này với bất kỳ ai.
                        </p>
                        
                        <p style="font-size: 14px; color: #888888; margin: 40px 0 0; padding-top: 20px; border-top: 1px solid #eeeeee;">
                        Nếu bạn không yêu cầu lấy lại mật khẩu, vui lòng bỏ qua email này.
                        </p>
                    </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                    <td align="center" bgcolor="#f5f5f5" style="padding: 20px; font-size: 12px; color: #999999;">
                        © 2025 Varust VN. All rights reserved.<br>
                        Email tự động - vui lòng không reply.
                    </td>
                    </tr>
                </table>
                </td>
            </tr>
            </table>
        `;

        sendMailHelper.sendMail(email, subject, html);

        return res.status(200).json({
            message: "Đã gửi mã otp"
        })


    } catch (error) {
        return res.status(400).json({
            message: `Looix: ${error}`
        })
    }   
}
//// [POST] /api/v1/users/forrgot-password/otp
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

    res.cookie("token", user.tokenUser, {
      httpOnly: true,
      sameSite: "lax",
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
//// [POST] /api/v1/users/forrgot-password/otp
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
