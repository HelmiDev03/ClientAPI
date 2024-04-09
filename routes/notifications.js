const express = require('express');
const router = express.Router();
const passport = require('passport');

const { GetNotifications,DeleteNotification,GetUnseenNotifications,MarkAsSeen   } = require('../controllers/notifications.controller');




router.get('/', passport.authenticate('jwt' , {session : false}), GetNotifications )
router.delete('/delete/:id' , passport.authenticate('jwt' , {session : false}),DeleteNotification )

router.get('/unseen', passport.authenticate('jwt' , {session : false}), GetUnseenNotifications )
router.put('/seen', passport.authenticate('jwt' , {session : false}), MarkAsSeen )




module.exports = router;