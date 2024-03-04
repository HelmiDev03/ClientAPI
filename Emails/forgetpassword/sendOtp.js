const transporter = require('../mailSetup');
const ForgetPasswordToken = require('../../models/forgetpassword/forgetPasswordToken');





const SendOtp = async (user) => {
    try {
        //generate 6 digit otp
        let otp = Math.floor(100000 + Math.random() * 900000);
        const newOtp = new ForgetPasswordToken({ userId: user._id, token: otp });
        await newOtp.save();
        await transporter.sendMail({
            from: process.env.AUTH_EMAIL,
            to: user.email,
            subject: "Forget Password OTP",
            html: `Your OTP is ${otp}`
        });
        return { message: "OTP sent to your email"  , id : newOtp._id , expiredAt: newOtp.expiredAt};

    } catch (error) {
        console.log(error);
    }
}


module.exports = SendOtp;