const express = require('express');
const router = express.Router();
const passport = require('passport');
const { GetPolicies} = require('../controllers/timeoff.controller');




router.get('/', passport.authenticate('jwt' , {session : false}), GetPolicies ) 



























module.exports = router;