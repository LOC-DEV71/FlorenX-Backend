// RAILWAY KO CHO PHÉP SMTP (block outbound mail)
// const nodemailer = require('nodemailer');
// module.exports.sendMail = (email, subject, html) =>{
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {    
//             user: process.env.MAIL_USER,
//             pass: process.env.MAIL_PASS
//         }
//     });

//     const mailOptions = {
//         from: process.env.MAIL_USER,
//         to: email,
//         subject: subject,
//         html: html
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.log("Error:", error);
//         } else {
//             console.log('Email sent:', info.response);
//         }
//     });

// }



// fix cho railway tạm
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports.sendMail = async (email, subject, html) => {
  try {
    const data = await resend.emails.send({
      from: "FlorenX <onboarding@resend.dev>",
      to: email,
      subject,
      html
    });

    console.log("Email sent:", data);
  } catch (err) {
    console.error("Send mail error:", err);
  }
};