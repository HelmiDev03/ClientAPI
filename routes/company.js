const express = require('express');
const router = express.Router();
const passport = require('passport');
const { UpdateCompanyPackage ,UpdateCompany,GetCompanyData } = require('../controllers/company.controller');




router.get('/', passport.authenticate('jwt' , {session : false}), GetCompanyData ) 
router.put('/update',passport.authenticate('jwt' , {session : false}) , UpdateCompany )
router.put('/updatePackage',passport.authenticate('jwt' , {session : false}) , UpdateCompanyPackage )



























module.exports = router;