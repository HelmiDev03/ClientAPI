const Users = require('../models/user');
const Companies = require('../models/company');
const Attendance = require('../models/attendance');
const VerificationToken = require('../models/authverification/VerificationToken');
const ForgetPasswordToken = require('../models/forgetpassword/forgetPasswordToken');
const Notifications = require('../models/notification');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const SendVerificationMail = require('../Emails/registerverification/sendverificationmail')
const SendOtp = require('../Emails/forgetpassword/sendOtp')
const SendTFAOtp = require('../Emails/tfalogin/SendTFAOtp')
const { namePattern, phonePattern } = require('..//pattern')
const uploadImage = require('../mediaUpload/uploadmediaconfig')
const deleteImage = require('../mediaUpload/deletemediaconfig');
const uploadImageformobile = require('../mediaUpload/mobile/uploadmediaconfigformobile')
const TfaToken = require('../models/tfaverification/tfatoken');
const Policies = require('../models/policy');
const PermissionGroup = require('../models/permissiongroup');


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
            company: company._id,

        })
        await user.save()
        await Users.findByIdAndUpdate(user._id, { manager: user._id }, { new: true })

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
        const permissionGroup = await PermissionGroup.create({
            company: company._id,
            name: 'Administrators',
            isadministrators: true,
            isdefault: false,
            iscustom: false,
            viewallemployees: true,
            viewemployeedetails: true,
            deleteemployee: true,
            addnewemployee: true,
            editemployeedetails: true,
            viewcompanydetails: true,
            editcompanyinfo: true,
            canbemanager: true,
            viewtimeoffpiliciespage: true,
            viewtimeoffpolicydetails: true,
            addnewtimeoffpolicy: true,
            removepolicy: true,
            setpolicyasdefault: true,
            addnationalday: true,
            deletenationaldays: true,
            editpolicyconfig: true,
            addnewemployeetoapolicy: true,
            changeemployeepolicy: true
        })
        await permissionGroup.save()

        const defaultpermissionGroup = await PermissionGroup.create({
            company: company._id,
            name: 'DefaultGroup',
            isadministrators: false,
            isdefault: true,
            iscustom: false,

        })
        await defaultpermissionGroup.save();
        const attendance = await Attendance.create({
            user: user._id,
        })
        await attendance.save()

        // update user with policy
        await Users.findByIdAndUpdate(user._id, { policy: policy._id, permissionGroup: permissionGroup._id }, { new: true })

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

        findUser.password = undefined
        const token = jwt.sign(
            findUser.toJSON(),
            process.env.PRIVATE_KEY,
            { expiresIn: '8h' }
        );

        const refreshToken = jwt.sign(
            { _id: findUser._id },
            process.env.PRIVATE_KEY,
            { expiresIn: '7d' }
        )


        if (!findUser.tfa) {
            const notifications = await Notifications.find({ userId: findUser._id, seen: false })
            const unssennotifications = notifications.length
            let userAttandance = await Attendance.findOne({ user: findUser._id });
            const workingHours = userAttandance.workingHours.map(hour => hour);
            const group = await PermissionGroup.findOne({ _id: findUser.permissionGroup });
            const company = await Companies.findOne({ _id: findUser.company });


            return res.status(200).json({
                message: "Success",
                email: findUser.email,
                token: "Bearer " + token,
                refreshToken: "Bearer " + refreshToken,
                company,
                group,
                workingHours,
                unssennotifications,

            });

        }

        else {
            return res.status(200).json({
                message: "Success",
                email: findUser.email,
            })
        }


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
            updateduser.password = undefined
            const token = jwt.sign(
                updateduser.toJSON(),
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
                updateduser.password = undefined
                const token = jwt.sign(
                    updateduser.toJSON(),
                    process.env.PRIVATE_KEY,
                    { expiresIn: '8h' }
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

//mobile
const UpdateProfilePictureMobile = async (req, res) => {

    try {


        let ImageUrl = await uploadImageformobile(req.body.image)



        const updateduser = await Users.findByIdAndUpdate(req.user._id, { profilepicture: ImageUrl }, { new: true });
        updateduser.password = undefined
        const token = jwt.sign(
            updateduser.toJSON(),
            process.env.PRIVATE_KEY,
            { expiresIn: '8h' }
        );
        return res.status(200).json({
            message: "profile picture updated ",
            token: "Bearer " + token,

        });








    }


    catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })

    }

}














const ForgetPassword = async (req, res) => {
    try {
        const emailorcin = req.body.email;

        let user = await Users.findOne({ email: emailorcin });
        let usernotfound = false;
        if (!user) {
            usernotfound = true;
            user = await Users.findOne({ cin: emailorcin });
        }


        if (!user) {
            return res.status(400).json({ message: 'User not found' });
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
            updateduser.password = undefined
            const token = jwt.sign(
                updateduser.toJSON(),
                process.env.PRIVATE_KEY,
                { expiresIn: '8h' }
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
            updateduser.password = undefined
            const token = jwt.sign(
                updateduser.toJSON(),
                process.env.PRIVATE_KEY,
                { expiresIn: '8h' }
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







const SendTfaOtpBeforeLogin = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Users.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: 'Email not found' })
        }

        const findToken = await TfaToken.findOne({ userId: user._id });
        if (findToken) {
            return res.status(400).json({ message: 'please try again later for security reasons' })
        }
        const result = await SendTFAOtp(user);
        return res.status(200).json({ message: 'Otp sent to your email', email: email, token: result.id, expiredAt: result.expiredAt })
    }



    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const VerifyTokenTfaExist = async (req, res) => {
    try {
        const { tokenid } = req.body;
        const findToken = await TfaToken.findById(tokenid);
        if (!findToken) {
            return res.status(400).json({ message: 'Invalid token' })
        }
        return res.status(200).json({ message: 'Token verified successfully' })

    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


const VerifytfaOtpBeforeLogin = async (req, res) => {
    const { email, otp } = req.body;
    console.log(email, otp)
    try {
        const findUser = await Users.findOne({ email });
        if (!findUser) {
            return res.status(400).json({ message: 'Email not found' })
        }
        const findToken = await TfaToken.findOne({ userId: findUser._id });
        if (!findToken) {
            return res.status(400).json({ message: 'Otp not found' })
        }
        if (findToken.token !== otp) {
            return res.status(400).json({ message: 'Invalid Otp' })
        }
        if (findToken.expiresIn < Date.now()) {
            return res.status(400).json({ message: 'Otp expired' })
        }


        findUser.password = undefined
        const token = jwt.sign(
            findUser.toJSON(),
            process.env.PRIVATE_KEY,
            { expiresIn: '8h' }
        );

        const refreshToken = jwt.sign(
            { _id: findUser._id },
            process.env.PRIVATE_KEY,
            { expiresIn: '7d' }
        )
        const notifications = await Notifications.find({ userId: findUser._id, seen: false })
        const unssennotifications = notifications.length
        let userAttandance = await Attendance.findOne({ user: findUser._id });
        const workingHours = userAttandance.workingHours.map(hour => hour);
        const group = await PermissionGroup.findOne({ _id: findUser.permissionGroup });
        const company = await Companies.findOne({ _id: findUser.company });




        return res.status(200).json({
            message: "Success",


            token: "Bearer " + token,
            refreshToken: "Bearer " + refreshToken,
            company,
            group,
            workingHours,
            unssennotifications,


        });


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
    SendTfaOtpBeforeLogin,
    VerifyTokenTfaExist,
    VerifytfaOtpBeforeLogin,
    UpdateProfilePictureMobile,
}
