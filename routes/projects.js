const express = require('express');
const router = express.Router();
const passport = require('passport');
const { GetAllProjects,GetProject,AddNewProject, CloseProject,DeleteProject ,RemoveMemberFromProject} = require('../controllers/projects.controller');





router.get('/',passport.authenticate('jwt' , {session : false}) , GetAllProjects)

router.get('/:id',passport.authenticate('jwt' , {session : false}) , GetProject)

router.post('/addnewproject',passport.authenticate('jwt' , {session : false}) , AddNewProject)

router.put('/closeproject/:id',passport.authenticate('jwt' , {session : false}) , CloseProject)

router.delete('/deleteproject/:id',passport.authenticate('jwt' , {session : false}) , DeleteProject)


router.put('/removememebrfromproject/:projectid/:memberid',passport.authenticate('jwt' , {session : false}) , RemoveMemberFromProject)









module.exports = router;