const Users = require('../models/user');
const Companies = require('../models/company');
const VerificationToken = require('../models/authverification/VerificationToken');
const ForgetPasswordToken = require('../models/forgetpassword/forgetPasswordToken');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const SendVerificationMail = require('../Emails/registerverification/sendverificationmail')
const SendOtp = require('../Emails/forgetpassword/sendOtp')
const SendTFAOtp = require('../Emails/tfalogin/SendTFAOtp')
const { emailPattern, namePattern, phonePattern } = require('..//pattern')
const uploadImage = require('../mediaUpload/uploadmediaconfig')
const deleteImage = require('../mediaUpload/deletemediaconfig');
const TfaToken = require('../models/tfaverification/tfatoken');
const Policies = require('../models/policy');



const VerifyEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const findeuser = await Users.findOne({ email: email });


        if (findeuser) {
            return res.status(400).json({ message: 'Email is already taken' })

        }
        else {
            return res.status(200).json({ message: 'Email is available' })
        }

    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
}


const EmailExist = async (req, res) => {

    try {
        const user = await Users.findOne({ email: req.body.email })
        if (user) {
            return res.status(200).json({ exist: true })
        }
        else {
            return res.status(401).json({ 'email': 'Email not found' })
        }
    }
    catch (error) {
        return res.status(500).json({ error: error })
    }

}

const VerifyCin = async (req, res) => {
    try {


        const findeuser = await Users.findOne({ cin: req.body.cin });
        console.log(findeuser)


        if (findeuser) {
            return res.status(400).json({ message: 'Cin is already used' })

        }
        else {
            return res.status(200).json({ message: 'Cin is available' })
        }

    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }

}

const Verifyphone = async (req, res) => {
    try {

        const findcompany = await Companies.findOne({ phonenumber: req.body.phonenumber });
        if (findcompany) {
            return res.status(400).json({ message: 'Phone number is already used by other company' })

        }
        else {
            return res.status(200).json({ message: 'Phone number is available' })
        }

    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const VerifyUserPhone = async (req, res) => {
    try {

        const finduser = await Users.findOne({ phonenumber: req.body.phonenumber });
        if (finduser) {
            return res.status(400).json({ message: 'Phone number is already used by other user' })

        }
        else {
            return res.status(200).json({ message: 'Phone number is available' })
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
}



const Register = async (req, res) => {

    try {
        console.log(req.body)
        const { email, role, firstname, lastname, cin, password, domaine, comanyname, phonenumber } = req.body;
        const findeuser = await Users.findOne({ email: email });
        if (findeuser) {
            return res.status(400).json({ message: 'Email is already taken' })

        }
        const hash = await bcrypt.hashSync(password, 10);
        const company = await Companies.create({
            name: comanyname,
            domaine,
            phonenumber,
        })
        await company.save()
        const user = await Users.create({
            firstname,
            lastname,
            email,
            cin,
            role,
            password: hash,
            company: company._id
        })
        await user.save()
        user.password = undefined
        SendVerificationMail(user)
        const policy = await Policies.create({
            name: 'Default',
            description: 'Default policy',
            isdefault: true,
            absences: ['Holidays', 'Sick leave', 'Compassionate leave', 'Parental leave'],
            startMonth: 'January',
            duration: '12 months',
            workingDays: 22,
            TimeOffDaysPerWorkingDays: 2,
            MaxTimeOffDays: 7,
            nationaldays: true,
            timeofflastforever: true,
            company: company._id
        })
        await policy.save()
        // update user with policy
        await Users.findByIdAndUpdate(user._id, { policy: policy._id } , { new: true })
        
        return res.status(200).json({ message: 'Successfully Created. Please Check Your Email For verification', user, company })
    }




    catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }







}

const Login = async (req, res) => {
    try {
        const { emailorcin, password } = req.body;

        const findUserWithEmail = await Users.findOne({ email: emailorcin });
        const findUserWithCin = await Users.findOne({ cin: emailorcin });

        if (!findUserWithEmail && !findUserWithCin) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Check if user's password is not undefined before comparing
        const findUser = findUserWithEmail ? findUserWithEmail : findUserWithCin;

        const comparePassword = await bcrypt.compare(password, findUser.password);

        if (!comparePassword) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        if (!findUser.isVerified) {


            return res.status(400).json({ message: "Please Check Your MailBox To Verify your email" });
        }
        const company = await Companies.findById(findUser.company)


        const token = jwt.sign(
            {
                _id: findUser._id,
                firstname: findUser.firstname,
                lastname: findUser.lastname,
                email: findUser.email,
                cin: findUser.cin,
                role: findUser.role,
                role: findUser.role,
                username: findUser.username,
                phonenumber: findUser.phonenumber,
                profilepicture: findUser.profilepicture,
                dateofbirth: findUser.dateofbirth,
                matricule: findUser.matricule,
                createdAt: findUser.createdAt,
                gender: findUser.gender,
                maritalstatus: findUser.maritalstatus,
                nationality: findUser.nationality,
                adress: findUser.adress,

                city: findUser.city,
                country: findUser.country,
                postalcode: findUser.postalcode,
                tfa: findUser.tfa,
                company: findUser.company,
                policy : findUser.policy
            },
            process.env.PRIVATE_KEY,
            { expiresIn: '10m' }
        );

        const refreshToken = jwt.sign(
            { _id: findUser._id },
            process.env.PRIVATE_KEY,
            { expiresIn: '7d' }
        )




        return res.status(200).json({
            message: "Success",
            token: "Bearer " + token,
            refreshToken: "Bearer " + refreshToken,
            company: company
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const ConfirmMail = async (req, res) => {
    try {


        const finduser = await Users.findById(req.params.Userid);
        console.log(finduser)

        if (!finduser) {
            return res.status(404).json({ message: "Invalid link" });
        }

        const token = await VerificationToken.findOne({ userId: req.params.Userid, token: req.params.token });
        console.log(token)

        if (finduser.isVerified) {
            return res.status(404).json({ message: "Email verified successfully" });
        }

        if (!token) {
            return res.status(404).json({ message: "Invalid link" });
        }
        if (token.expiresIn < Date.now()) {
            return res.status(404).json({ message: "Link expired" });
        }

        await Users.findByIdAndUpdate(req.params.Userid, { isVerified: true });

        await VerificationToken.findOneAndDelete({ userId: req.params.Userid });
        return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const UpdatePersonalInformation = async (req, res) => {

    try {
        const errors = {}
        const { firstname, lastname, phonenumber, birthday, maritalstatus, gender, country, adress, city, postalcode } = req.body;
        if (!namePattern.test(firstname)) {
            errors.firstname = 'Invalid firstname'
        }


        if (!namePattern.test(lastname)) {
            errors.lastname = 'Invalid lastname'
        }

        if (phonenumber) {
            if (!phonePattern.test(phonenumber)) {
                errors.phonenumber = 'Invalid phonenumber'
            }
            // Check if phone number is already used
            const finduser = await Users.findOne({ phonenumber: phonenumber });
            if (finduser && finduser._id.toString() !== req.user._id.toString()) {
                errors.phonenumber = 'Phone number is already used'
            }
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json(errors)
        }
        const updateduser = await Users.findByIdAndUpdate(req.user._id, {
            firstname,
            lastname,
            phonenumber,
            dateofbirth: birthday,
            maritalstatus,
            gender,
            country,
            adress,
            city,
            postalcode
        }, { new: true })

        if (updateduser) {
            const token = jwt.sign(
                {
                    _id: updateduser._id,
                    firstname: updateduser.firstname,
                    lastname: updateduser.lastname,
                    email: updateduser.email,
                    cin: updateduser.cin,
                    role: updateduser.role,
                    username: updateduser.username,
                    phonenumber: updateduser.phonenumber,
                    profilepicture: updateduser.profilepicture,
                    dateofbirth: updateduser.dateofbirth,
                    matricule: updateduser.matricule,
                    createdAt: updateduser.createdAt,
                    gender: updateduser.gender,
                    maritalstatus: updateduser.maritalstatus,
                    nationality: updateduser.nationality,
                    adress: updateduser.adress,
                    city: updateduser.city,
                    country: updateduser.country,
                    postalcode: updateduser.postalcode,
                    tfa: updateduser.tfa,
                    company: updateduser.company,
                    policy : updateduser.policy
                },
                process.env.PRIVATE_KEY,
                { expiresIn: '1h' }
            );
            return res.status(200).json({ message: 'Successfully Updated', token: "Bearer " + token, user: updateduser })
        }


    }


    catch (err) {
        return res.status(500).json({ message: err.message })
    }
}






const UpdatePassword = async (req, res) => {
    try {

        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const comparePassword = await bcrypt.compare(oldPassword, req.user.password);
        if (!comparePassword) {
            return res.status(400).json({ password: 'Password Incorrect' })
        }
        const hashed = await bcrypt.hashSync(newPassword, 10);
        const updateduser = await Users.findByIdAndUpdate(req.user._id, { password: hashed }, { new: true });
        if (updateduser) {
            return res.status(200).json({ message: 'Password Successfully Updated' })
        }
        else {
            return res.status(500).json({ message: 'Error' })

        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const UpdateProfilePicture = (req, res) => {
    uploadImage(req.body.image)
        .then((url) => res.status(200).send(url))
        .catch((err) => res.status(400).send(err));
}

const UpdateProfilePictureDecision = async (req, res) => {
    try {

        const choose = req.body.choose;
        const ImageUrl = req.body.ImageUrl;
        const publicId = req.body.publicId;
        if (choose === 'Cancel') {
            deleteImage(publicId)
            return res.status(400).json({ message: 'Image deleted' })
        }
        else if (choose === 'Confirm') {
            const updateduser = await Users.findByIdAndUpdate(req.user._id, { profilepicture: ImageUrl }, { new: true });
            if (updateduser) {
                const token = jwt.sign(
                    {
                        _id: updateduser._id,
                        firstname: updateduser.firstname,
                        lastname: updateduser.lastname,
                        email: updateduser.email,
                        cin: updateduser.cin,
                        role: updateduser.role,
                        username: updateduser.username,
                        phonenumber: updateduser.phonenumber,
                        profilepicture: updateduser.profilepicture,
                        dateofbirth: updateduser.dateofbirth,
                        matricule: updateduser.matricule,
                        createdAt: updateduser.createdAt,
                        gender: updateduser.gender,
                        maritalstatus: updateduser.maritalstatus,
                        nationality: updateduser.nationality,
                        adress: updateduser.adress,
                        city: updateduser.city,
                        country: updateduser.country,
                        postalcode: updateduser.postalcode,
                        tfa: updateduser.tfa,
                        company: updateduser.company,
                        policy : updateduser.policy
                    },
                    process.env.PRIVATE_KEY,
                    { expiresIn: '10m' }
                );
                return res.status(200).json({
                    message: "profile picture updated ",
                    token: "Bearer " + token,

                });
            }




            else {
                return res.status(500).json({ message: 'Error' })
            }
        }

    }


    catch (error) {
        return res.status(500).json({ message: error.message })

    }
}















const ForgetPassword = async (req, res) => {
    try {
        const email = req.body.email;

        const user = await Users.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Email not found' })
        }
        const findToken = await ForgetPasswordToken.findOne({ userId: user._id });
        if (findToken) {
            return res.status(400).json({ message: 'you attempt to send otp in the last 5 minutes , please try again later' })

        }
        const result = await SendOtp(user)
        return res.status(200).json({ message: 'Otp sent to your email', token: result.id, expiredAt: result.expiredAt })




    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }

}


const VerifyTokenResetPasswordExist = async (req, res) => {
    try {
        const { tokenid } = req.body;
        const findToken = await ForgetPasswordToken.findById(tokenid);
        if (!findToken) {
            return res.status(400).json({ message: 'Invalid token' })
        }
        return res.status(200).json({ message: 'Token verified successfully' })

    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const VerifyOtp = async (req, res) => {
    const { email, token } = req.body;
    console.log(email, token)
    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email not found' })
        }
        const findToken = await ForgetPasswordToken.findOne({ userId: user._id });
        if (!findToken) {
            return res.status(400).json({ message: 'Otp not found' })
        }
        if (findToken.token !== token) {
            return res.status(400).json({ message: 'Invalid Otp' })
        }
        if (findToken.expiresIn < Date.now()) {
            return res.status(400).json({ message: 'Otp expired' })
        }
        return res.status(200).json({ message: 'Otp verified successfully' })
    }


    catch (error) {
        return res.status(500).json({ message: error.message });
    }




}
const ChangePassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Email not found' })
        }
        const hashed = await bcrypt.hashSync(password, 10);
        const updateduser = await Users.findOneAndUpdate({ email }, { password: hashed }, { new: true });
        if (updateduser) {
            return res.status(200).json({ message: 'Password Successfully Updated' })
        }
        else {
            return res.status(500).json({ message: 'Error' })

        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}










const SendTfaOtp = async (req, res) => {
    try {

        const findToken = await TfaToken.findOne({ userId: req.user._id });
        if (findToken) {
            return res.status(400).json({ message: 'you attempt to send otp in the last 5 minutes , please try again later' })

        }
        const result = await SendTFAOtp(req.user)
        return res.status(200).json({ message: 'Otp sent to your email', token: result.id, expiredAt: result.expiredAt })




    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


const VerifytfaOtp = async (req, res) => {
    const { token } = req.body;
    try {
        const findToken = await TfaToken.findOne({ userId: req.user._id });
        if (!findToken) {
            return res.status(400).json({ message: 'Otp not found' })
        }
        if (findToken.token !== token) {
            return res.status(400).json({ message: 'Invalid Otp' })
        }
        if (findToken.expiresIn < Date.now()) {
            return res.status(400).json({ message: 'Otp expired' })
        }
        const updateduser = await Users.findByIdAndUpdate(req.user._id, { tfa: true }, { new: true });
        if (updateduser) {
            const token = jwt.sign(
                {
                    _id: updateduser._id,
                    firstname: updateduser.firstname,
                    lastname: updateduser.lastname,
                    email: updateduser.email,
                    cin: updateduser.cin,
                    role: updateduser.role,
                    username: updateduser.username,
                    phonenumber: updateduser.phonenumber,
                    profilepicture: updateduser.profilepicture,
                    dateofbirth: updateduser.dateofbirth,
                    matricule: updateduser.matricule,
                    createdAt: updateduser.createdAt,
                    gender: updateduser.gender,
                    maritalstatus: updateduser.maritalstatus,
                    nationality: updateduser.nationality,
                    adress: updateduser.adress,
                    city: updateduser.city,
                    country: updateduser.country,
                    postalcode: updateduser.postalcode,
                    tfa: updateduser.tfa,
                    company: updateduser.company,
                    policy : updateduser.policy,
                },
                process.env.PRIVATE_KEY,
                { expiresIn: '10m' }
            );
            return res.status(200).json({ token: "Bearer " + token, message: 'TFA Enabled Successfully' })
        }

    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }

}


const UpdateTfa = async (req, res) => {
    try {
        const updateduser = await Users.findByIdAndUpdate(req.user._id, { tfa: false }, { new: true });
        if (updateduser) {
            const token = jwt.sign(
                {
                    _id: updateduser._id,
                    firstname: updateduser.firstname,
                    lastname: updateduser.lastname,
                    email: updateduser.email,
                    cin: updateduser.cin,
                    role: updateduser.role,
                    username: updateduser.username,
                    phonenumber: updateduser.phonenumber,
                    profilepicture: updateduser.profilepicture,
                    dateofbirth: updateduser.dateofbirth,
                    matricule: updateduser.matricule,
                    createdAt: updateduser.createdAt,
                    gender: updateduser.gender,
                    maritalstatus: updateduser.maritalstatus,
                    nationality: updateduser.nationality,
                    adress: updateduser.adress,
                    city: updateduser.city,
                    country: updateduser.country,
                    postalcode: updateduser.postalcode,
                    tfa: updateduser.tfa,
                    company: updateduser.company,
                    policy: updateduser.policy
                },
                process.env.PRIVATE_KEY,
                { expiresIn: '10m' }
            );
            return res.status(200).json({
                message: "tfa disbaled ",
                token: "Bearer " + token,

            });
        }

    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}






module.exports = {
    VerifyEmail,
    EmailExist,
    VerifyCin,
    Verifyphone,
    VerifyUserPhone,
    Register,
    Login,
    ConfirmMail,
    UpdatePersonalInformation,
    UpdatePassword,
    UpdateProfilePicture,
    UpdateProfilePictureDecision,
    ForgetPassword,
    VerifyTokenResetPasswordExist,
    VerifyOtp,
    ChangePassword,
    SendTfaOtp,
    VerifytfaOtp,
    UpdateTfa,
}