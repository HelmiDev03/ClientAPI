const express = require('express');
const router = express.Router();
const passport = require('passport');
const { GetAllEmployees , AddNewEmployee } = require('../controllers/employees.controller');





router.get('/',passport.authenticate('jwt' , {session : false}) , GetAllEmployees)

router.post('/addnewemployee',passport.authenticate('jwt' , {session : false}) , AddNewEmployee)
























module.exports = router;