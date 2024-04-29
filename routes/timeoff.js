const express = require('express');
const router = express.Router();
const passport = require('passport');
const { GetPolicies, GetPolicy, CreatePolicy , DeletePolicy,UpdatePolicy ,setnewDefaultPolicy, UpdateEmployeePolicy,AddNewEmployeesToPolicy,CalculateTimeOffDays,CalculateTimeOffDaysOfEmployee   } = require('../controllers/timeoff/policy.controller');

const {AddNewTimeOff,UpdateTimeOff,GetUserTimeOffs,GetEmployeeTimeOffs,GetCompanyPenindgTimeOffs,GetCompanyTimeOffs,GtAllEmployeesAcceptedTimeOffs} = require('../controllers/timeoff/timeoff.controller');

//policy
router.get('/', passport.authenticate('jwt' , {session : false}), GetPolicies ) 
router.get('/get/:id', passport.authenticate('jwt' , {session : false}), GetPolicy )
router.post('/create', passport.authenticate('jwt' , {session : false}), CreatePolicy )
router.delete('/delete/:id', passport.authenticate('jwt' , {session : false}), DeletePolicy )
router.put('/update/:id', passport.authenticate('jwt' , {session : false}), UpdatePolicy )
router.put('/setnewdefaultpolicy/:id', passport.authenticate('jwt' , {session : false}), setnewDefaultPolicy )
router.put('/updateemployeepolicy/:id', passport.authenticate('jwt' , {session : false}), UpdateEmployeePolicy )
router.put('/addemployeestopolicy/:id', passport.authenticate('jwt' , {session : false}), AddNewEmployeesToPolicy )
router.get('/calculate' , passport.authenticate('jwt' , {session : false}), CalculateTimeOffDays )
router.get('/calculate/auth/:id' , passport.authenticate('jwt' , {session : false}), CalculateTimeOffDaysOfEmployee )

//absence

router.post('/createtimeoff' ,  passport.authenticate('jwt' , {session : false}), AddNewTimeOff)
router.put('/updatetimeoff/:id' ,  passport.authenticate('jwt' , {session : false}), UpdateTimeOff)
router.get('/gettimeoff' ,  passport.authenticate('jwt' , {session : false}), GetUserTimeOffs)
router.get('/gettimeoff/auth/:id' ,  passport.authenticate('jwt' , {session : false}), GetEmployeeTimeOffs)
router.get('/getpendingtimeoff' ,  passport.authenticate('jwt' , {session : false}), GetCompanyPenindgTimeOffs)
router.get('/getacceptedtimeoff' ,  passport.authenticate('jwt' , {session : false}), GtAllEmployeesAcceptedTimeOffs)



//mobile
router.get('/getcompanytimeoff' ,  passport.authenticate('jwt' , {session : false}), GetCompanyTimeOffs)



















module.exports = router;