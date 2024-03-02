const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD
    }
});

transporter.verify().then(() => {
    console.log("Ready to send mail");
}).catch((error) => {
    console.log("Error occurred");
});


module.exports = transporter;