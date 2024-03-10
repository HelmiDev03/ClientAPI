const transporter = require('../mailSetup');
const TfaToken = require('../../models/tfaverification/tfatoken');





const SendTFAOtp = async (user) => {
    try {
        //generate 6 digit otp
        let otp = Math.floor(100000 + Math.random() * 900000);
        const newOtp = new TfaToken({ userId: user._id, token: otp });
        await newOtp.save();
        await transporter.sendMail({
            from: process.env.AUTH_EMAIL,
            to: user.email,
            subject: "Two Factor Authentication OTP",
            html: `Your OTP is ${otp}`
        });
        return { message: "OTP sent to your email"  , id : newOtp._id , expiredAt: newOtp.expiredAt};

    } catch (error) {
        console.log(error);
    }
}


module.exports = SendTFAOtp;