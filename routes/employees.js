const express = require('express');
const router = express.Router();
const passport = require('passport');
const { GetAllEmployees } = require('../controllers/employees.controller');





router.get('/',passport.authenticate('jwt' , {session : false}) , GetAllEmployees)



























module.exports = router;