const nodemailer = require('nodemailer');

module.exports.sendMail = (email, subject, html) =>{
    const transporter = nodemailer.createTransport({
        // service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // BẮT BUỘC false
        auth: {    
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: subject,
        html: html
    };
    console.log("MAIL_USER:", process.env.MAIL_USER);
    console.log("MAIL_PASS:", process.env.MAIL_PASS ? "OK" : "MISSING");    

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error:", error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

}