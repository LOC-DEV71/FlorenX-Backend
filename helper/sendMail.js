const nodemailer = require('nodemailer');

module.exports.sendMail = (email, subject, html) =>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '1945musictrending@gmail.com',         
            pass: 'pxme hqyl ngra bhij'    
        }
    });

    const mailOptions = {
        from: '1945musictrending@gmail.com',
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