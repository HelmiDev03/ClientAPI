const express = require('express');
const router = express.Router();
const passport = require('passport');

const { GetPermissionGroups ,GetPermissionGroup ,  CreatePermissionGroup ,  GetUserPermissionGroup,DeletePermissionGroup,UpdateCustomPermissionGroup,UpdateCustomPermissionGroupEmployees ,
    UpdateEmployeeGroup,
} = require('../controllers/permissions.controller');






router.get('/', passport.authenticate('jwt', { session: false }), GetPermissionGroups )
router.get('/usergroup', passport.authenticate('jwt', { session: false }), GetUserPermissionGroup )
router.get('/:id', passport.authenticate('jwt', { session: false }), GetPermissionGroup )
router.post('/create', passport.authenticate('jwt', { session: false }), CreatePermissionGroup )
router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), DeletePermissionGroup )
router.put('/update/:id', passport.authenticate('jwt', { session: false }), UpdateCustomPermissionGroup )
router.put('/addemployeestopermissiongroup/:id', passport.authenticate('jwt', { session: false }), UpdateCustomPermissionGroupEmployees )
router.put('/updateemployeegroup/:id', passport.authenticate('jwt', { session: false }), UpdateEmployeeGroup )





















module.exports = router;