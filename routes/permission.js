const express = require('express');
const router = express.Router();
const passport = require('passport');

const { GetPermissionGroups ,GetPermissionGroup ,  CreatePermissionGroup } = require('../controllers/permissions.controller');






router.get('/', passport.authenticate('jwt', { session: false }), GetPermissionGroups )
router.get('/:id', passport.authenticate('jwt', { session: false }), GetPermissionGroup )
router.post('/create', passport.authenticate('jwt', { session: false }), CreatePermissionGroup )























module.exports = router;