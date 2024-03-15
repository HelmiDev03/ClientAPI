const express = require('express');
const router = express.Router();
const passport = require('passport');
const { UpdateCompanyPackage ,UpdateCompany,GetCompanyData ,UpdateNationalDays,DeleteNationalDays} = require('../controllers/company.controller');




router.get('/', passport.authenticate('jwt' , {session : false}), GetCompanyData ) 
router.put('/update',passport.authenticate('jwt' , {session : false}) , UpdateCompany )
router.put('/updatePackage',passport.authenticate('jwt' , {session : false}) , UpdateCompanyPackage )
router.put('/updateNationalDays',passport.authenticate('jwt' , {session : false}) , UpdateNationalDays )
router.put('/deleteNationalDays',passport.authenticate('jwt' , {session : false}) , DeleteNationalDays )



























module.exports = router;