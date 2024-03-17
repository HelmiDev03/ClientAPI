const express = require('express');
const router = express.Router();
const passport = require('passport');
const { GetPolicies, GetPolicy, CreatePolicy , UpdatePolicy , UpdateEmployeePolicy,AddNewEmployeesToPolicy  } = require('../controllers/timeoff.controller');




router.get('/', passport.authenticate('jwt' , {session : false}), GetPolicies ) 
router.get('/get/:id', passport.authenticate('jwt' , {session : false}), GetPolicy )
router.post('/create', passport.authenticate('jwt' , {session : false}), CreatePolicy )
router.put('/update/:id', passport.authenticate('jwt' , {session : false}), UpdatePolicy )
router.put('/updateemployeepolicy/:id', passport.authenticate('jwt' , {session : false}), UpdateEmployeePolicy )
router.put('/addemployeestopolicy/:id', passport.authenticate('jwt' , {session : false}), AddNewEmployeesToPolicy )
























module.exports = router;