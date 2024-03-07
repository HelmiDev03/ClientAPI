const express = require('express');
const router = express.Router();
const passport = require('passport');
const { UpdateCompanyPackage } = require('../controllers/company.controller');





router.put('/updatePackage',passport.authenticate('jwt' , {session : false}) , UpdateCompanyPackage )



























module.exports = router;