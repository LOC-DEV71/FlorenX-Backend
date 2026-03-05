const sendMailHelper = require("../../../helper/sendMail");

module.exports.mailService = async (email, otp) => {
    const subject = `Mã OTP xác minh lấy lại mật khẩu: ${otp}`;

    const html = `
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
            <tr>
                <td align="center" style="padding: 20px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                    <td align="center" bgcolor="#1976d2" style="padding: 30px 20px; background-color: #1976d2; color: #ffffff;">
                        <h1 style="margin: 0; font-size: 24px; color: #ffffff;">FlorenX</h1>
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
                        © 2025 FLORENX. All rights reserved.<br>
                        Email tự động - vui lòng không reply.
                    </td>
                    </tr>
                </table>
                </td>
            </tr>
            </table>
        `;

    sendMailHelper.sendMail(email, subject, html);
}


module.exports.mailOrder = async (email, orderCode, items = []) => {
  console.log(email, orderCode, items)
  const subject = `Xác nhận đơn hàng ${orderCode} - FlorenX`;

  const productHtml = items.map(item => {
    const priceAfterDiscount =
      item.price - (item.price * (item.discountPercentage || 0)) / 100;

    return `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #eeeeee;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <!-- Thumbnail -->
              <td width="90" valign="top">
                <img 
                  src="${item.thumbnail}" 
                  width="80" 
                  height="80"
                  style="border-radius:8px;object-fit:cover;"
                />
              </td>

              <!-- Info -->
              <td valign="top" style="padding-left:12px;">
                <p style="margin:0;font-size:14px;color:#333;font-weight:bold;">
                  ${item.slug}
                </p>

                <p style="margin:6px 0 0;font-size:13px;color:#666;">
                  Số lượng: ${item.quantity}
                </p>

                ${
                  item.discountPercentage
                    ? `<p style="margin:6px 0 0;font-size:12px;color:#999;text-decoration:line-through;">
                        ${item.price.toLocaleString("vi-VN")}₫
                      </p>`
                    : ``
                }

                <p style="margin:4px 0 0;font-size:14px;color:#1976d2;font-weight:bold;">
                  ${priceAfterDiscount.toLocaleString("vi-VN")}₫
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  }).join("");

  const html = `
    <table width="100%" style="max-width:600px;margin:0 auto;font-family:Arial;background:#f4f4f4;">
      <tr>
        <td align="center" style="padding:20px;">
          <table width="100%" style="background:#fff;border-radius:12px;overflow:hidden;">

            <!-- Header -->
            <tr>
              <td align="center" style="background:#1976d2;padding:30px;color:#fff;">
                <h1 style="margin:0;font-size:24px;">FlorenX</h1>
                <p style="margin:10px 0 0;font-size:16px;">
                  Xác nhận đặt hàng thành công
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px 40px;">
                <p style="font-size:16px;color:#333;text-align:center;">
                  Cảm ơn bạn đã đặt hàng tại <strong>FlorenX</strong>.
                </p>

                <!-- Order Code -->
                <table align="center" style="margin:25px auto;">
                  <tr>
                    <td style="padding:16px 36px;border:3px dashed #1976d2;background:#e3f2fd;">
                      <span style="font-size:22px;font-weight:bold;color:#1976d2;">
                        ${orderCode}
                      </span>
                    </td>
                  </tr>
                </table>

                <!-- Product List -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                  <tr>
                    <td style="font-size:16px;font-weight:bold;color:#333;padding-bottom:10px;">
                      Sản phẩm đã đặt
                    </td>
                  </tr>
                  ${productHtml}
                </table>

                <p style="font-size:14px;color:#888;margin-top:30px;text-align:center;">
                  Đơn hàng sẽ sớm được xử lý và giao đến bạn.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background:#f5f5f5;padding:20px;font-size:12px;color:#999;">
                © 2025 FLORENX · Email tự động · Không reply
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  `;

  sendMailHelper.sendMail(email, subject, html);
};