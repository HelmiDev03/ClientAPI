const express = require('express');
const router = express.Router();
const passport = require('passport');
const { GetAllEmployees , AddNewEmployee ,GetEmployee, DeleteEmployee ,UpdateEmployeeManager} = require('../controllers/employees.controller');





router.get('/',passport.authenticate('jwt' , {session : false}) , GetAllEmployees)

router.post('/addnewemployee',passport.authenticate('jwt' , {session : false}) , AddNewEmployee)
router.get('/employee/:id',passport.authenticate('jwt' , {session : false}) , GetEmployee)

router.delete('/deleteemployee/:id/:publicId',passport.authenticate('jwt' , {session : false}) , DeleteEmployee )
router.put('/updatemanager/:employeeid/:managerid',passport.authenticate('jwt' , {session : false}) , UpdateEmployeeManager)
























module.exports = router;