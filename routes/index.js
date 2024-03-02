const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { inRole  } = require('../apiprotection/Rolemiddleware');
const { VerifyEmail ,VerifyCin,Verifyphone , Register , ConfirmMail,Login , UpdatePersonalInformation , UpdatePassword } = require('../controllers/auth.controller');
const { RefreshToken } = require('../controllers/refreshtoken.controller');
const passport = require('passport');







router.post('/verifyemail', VerifyEmail )
router.post('/verifycin', VerifyCin )
router.post('/verifyphone', Verifyphone )
router.post('/register', Register)
router.get('/confirm-email/:Userid/:token' , ConfirmMail)
router.post('/login', Login)
router.post('/refreshToken' , RefreshToken)
router.put('/update/personalinformation',passport.authenticate('jwt' , {session : false}), UpdatePersonalInformation)
router.put('/update/password',passport.authenticate('jwt' , {session : false}), UpdatePassword)




























module.exports = router;