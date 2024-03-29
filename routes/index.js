const express = require('express');
const router = express.Router();
const { inRole  } = require('../apiprotection/Rolemiddleware');
const { VerifyEmail ,
        VerifyCin,
        Verifyphone , 
        VerifyUserPhone,
        Register , 
        ConfirmMail,
        Login , 
        UpdatePersonalInformation ,
        UpdatePassword,
        UpdateProfilePicture,
        UpdateProfilePictureDecision,
        ForgetPassword,
        VerifyTokenResetPasswordExist,
        VerifyOtp,
        ChangePassword,
        SendTfaOtp,
        VerifyTokenTfaExist,
        VerifytfaOtp,
        VerifytfaOtpBeforeLogin,
        SendTfaOtpBeforeLogin,
        UpdateTfa } = require('../controllers/auth.controller');
const { RefreshToken } = require('../controllers/refreshtoken.controller');
const passport = require('passport');







router.post('/verifyemail', VerifyEmail )

router.post('/verifycin', VerifyCin )
router.post('/verifyphone', Verifyphone )
router.post('/verifyuserphone', VerifyUserPhone )
router.post('/register', Register)
router.get('/confirm-email/:Userid/:token' , ConfirmMail)
router.post('/login', Login)
router.post('/refreshToken' , RefreshToken)
router.put('/update/personalinformation',passport.authenticate('jwt' , {session : false}), UpdatePersonalInformation)
router.put('/update/password',passport.authenticate('jwt' , {session : false}), UpdatePassword)
router.put('/update/profilepicture',passport.authenticate('jwt' , {session : false}),UpdateProfilePicture)
router.post('/updateprofilepicture/decison',passport.authenticate('jwt' , {session : false}), UpdateProfilePictureDecision)





//forget password
router.post('/forgetpassword/verifytokenixist', VerifyTokenResetPasswordExist)
router.post('/forgetpassword/sendotp', ForgetPassword)
router.post('/forgetpassword/verifyotp', VerifyOtp)
router.post('/forgetpassword/changepassword', ChangePassword)


//tfa (after login)
router.post('/tfa/sendotp',passport.authenticate('jwt' , {session : false}), SendTfaOtp)
router.post('/tfa/verifyotp',passport.authenticate('jwt' , {session : false}), VerifytfaOtp)
router.put('/tfa/disable',passport.authenticate('jwt' , {session : false}), UpdateTfa)


//tfa (before login)
router.post('/tfa/verifytokenexist', VerifyTokenTfaExist)
router.post('/tfa/beforelogin/sendotp', SendTfaOtpBeforeLogin)
router.post('/tfa/beforelogin/verifyotp', VerifytfaOtpBeforeLogin)


























module.exports = router;