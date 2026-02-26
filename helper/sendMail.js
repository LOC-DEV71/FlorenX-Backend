const nodemailer = require("nodemailer");

module.exports.sendMail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, 
      },
    });

    // verify kết nối SMTP
    await transporter.verify();
    console.log("SMTP READY");

    const info = await transporter.sendMail({
      from: `"FlorenX" <${process.env.MAIL_USER}>`,
      to: email,
      subject,
      html,
    });

    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("SEND MAIL ERROR:", err);
  }
};