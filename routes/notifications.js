const express = require('express');
const router = express.Router();
const passport = require('passport');

const { GetNotifications,DeleteNotification  } = require('../controllers/notifications.controller');




router.get('/', passport.authenticate('jwt' , {session : false}), GetNotifications )
router.delete('/delete/:id' , passport.authenticate('jwt' , {session : false}),DeleteNotification )






module.exports = router;