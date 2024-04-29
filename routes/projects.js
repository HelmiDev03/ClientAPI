const express = require('express');
const router = express.Router();
const passport = require('passport');
const { GetAllProjects,GetProject,AddNewProject, CloseProject,DeleteProject ,GetProjectTasks, CreateTask,DeleteTask,GetTask,UpdateTask ,GetEmployeeProject,GetActiveprojects} = require('../controllers/projects.controller');




router.get('/activeprojects',passport.authenticate('jwt' , {session : false}) , GetActiveprojects)
router.get('/',passport.authenticate('jwt' , {session : false}) , GetAllProjects)

router.get('/:id',passport.authenticate('jwt' , {session : false}) , GetProject)
router.get('/employee/:employeeid',passport.authenticate('jwt' , {session : false}) , GetEmployeeProject)
router.post('/addnewproject',passport.authenticate('jwt' , {session : false}) , AddNewProject)

router.put('/closeproject/:id',passport.authenticate('jwt' , {session : false}) , CloseProject)

router.delete('/deleteproject/:id',passport.authenticate('jwt' , {session : false}) , DeleteProject)






router.get('/:projectid/tasks',passport.authenticate('jwt' , {session : false}) , GetProjectTasks)
router.get('/tasks/:id',passport.authenticate('jwt' , {session : false}) , GetTask)
router.put('/tasks/update/:id',passport.authenticate('jwt' , {session : false}) , UpdateTask)
router.post('/:projectid/tasks/create',passport.authenticate('jwt' , {session : false}) , CreateTask)
router.delete('/:projectid/tasks/delete/:id',passport.authenticate('jwt' , {session : false}) , DeleteTask)



module.exports = router;