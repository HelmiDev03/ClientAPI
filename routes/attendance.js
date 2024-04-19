const router = require('express').Router();
const passport = require('passport');



const {ClockIn ,ClockOut ,History} = require('../controllers/attendance.controller');





router.get('/history', passport.authenticate('jwt' , {session : false}), History )
router.get('/clockin', passport.authenticate('jwt' , {session : false}), ClockIn ) 
router.post('/clockout', passport.authenticate('jwt' , {session : false}), ClockOut )
























module.exports = router;