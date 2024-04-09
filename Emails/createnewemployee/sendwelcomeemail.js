const transporter = require('../mailSetup');
const fs = require('fs');
const path = require('path');
const htmlFilePath = path.join(__dirname, 'welcomeemployee.html');

const SendWelcomeEmail = async (user, userpassword, companyname, manager) => {
    try {
        const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
        const filledHtmlContent = htmlContent
            .replace('{{companyname}}', companyname)
            .replace('{{userrole}}', user.role) // Assuming user role is available
            .replace('{{useremail}}', user.email)
            .replace('{{userpassword}}', userpassword)
            .replace('{{managerfirstname}}', manager.firstname)
            .replace('{{managerlastname}}', manager.lastname);


        await transporter.sendMail({
            from: process.env.AUTH_EMAIL,
            to: user.email,
            subject: `Welcome to ${companyname} !`,
            html: filledHtmlContent
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = SendWelcomeEmail;