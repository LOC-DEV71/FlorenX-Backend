const nodemailer = require('nodemailer');

module.exports.sendMail = (email, subject, html) =>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            // user: '1945musictrending@gmail.com',         
            // pass: 'pxme hqyl ngra bhij'    
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const mailOptions = {
        // from: '1945musictrending@gmail.com',
        from: process.env.MAIL_USER,
        to: email,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error:", error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

}