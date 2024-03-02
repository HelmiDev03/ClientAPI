const transporter = require('../mailSetup');
const crypto = require('crypto');
const VerificationToken = require('../../models/authverification/VerificationToken');
const fs = require('fs');
const path = require('path');

const htmlFilePath = path.join(__dirname, 'verificationmail.html');



const SendVerificationMail = async (user) => {
    try {
        console.log(user)
         newToken = {}
        let existingToken = await VerificationToken.findOne({ userId: user._id });
        
        console.log("Existing token is", existingToken);
        if (!existingToken) {            
             newToken = new VerificationToken({ userId: user._id, token: crypto.randomBytes(16).toString('hex') });
            await newToken.save();
            console.log("New token created:", newToken);
        }

        const tokenToUse = existingToken ? existingToken.token : newToken.token;
        const verificationUrl = `http://localhost:3000/8f4b5e36d2a1c9f7b3e0d8c2a9f1e3c7/pack?userId=${user._id}&token=${tokenToUse}`;

        const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
        
        const filledHtmlContent = htmlContent.replace('{{name}}', user.firstname + " " + user.lastname).replace(/{{verificationUrl}}/g, verificationUrl);



        await transporter.sendMail({
            from: process.env.AUTH_EMAIL,
            to: user.email,
            subject: "VerifyEmail",
            html: filledHtmlContent
        }).then(() => {
            console.log('Email sent');
        }).catch((error) => {
            console.error(error);
        });

    } catch (error) {
        console.log(error);
    }
}

module.exports = SendVerificationMail;