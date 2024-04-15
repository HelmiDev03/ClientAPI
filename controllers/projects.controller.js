const Project = require('../models/project');
const Users = require('../models/user');
const Tasks = require('../models/task');



const GetAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({ company: req.user.company }).populate({
            path: 'users.user',
            
        })
        res.status(200).json({ projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const GetProject = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id }).populate({
            path: 'users.user',
            
        })
        res.status(200).json({ project });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}





const AddNewProject = async (req, res) => {
    try {
        console.log(req.body.projectemployees);
        
        const findproject = await Project.findOne({ name: req.body.name , company: req.user.company });
        if(findproject){
            return res.status(400).json({ message: 'Project with this name already exist' });
        }
        const project = new Project({
            company: req.user.company,
            name: req.body.name,
            startdate: req.body.startdate,
            enddate: req.body.enddate,
            budget: req.body.budget,
            users: req.body.projectemployees.map(key => ({ user: key.user._id, position : key.position}))
        });
        await project.save();
        const projects = await Project.find({ company: req.user.company }).populate({
            path: 'users.user',
            
        })

        res.status(200).json({ projects });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};


const GetEmployeeProject = async (req, res) => {
    try {
        const projects = await Project.find({ company: req.user.company , 'users.user': req.params.employeeid })
        res.status(200).json({ projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}






















const CloseProject = async (req, res) => {
    try {
        await Project.updateOne({ _id: req.params.id }, { status: 'Closed' });
        const projects = await Project.find({ company: req.user.company }).populate({
            path: 'users.user',
            
        })
        res.status(200).json({ projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const DeleteProject = async (req, res) => {
    try {
        await Project.deleteOne({ _id: req.params.id });
        const projects = await Project.find({ company: req.user.company }).populate({
            path: 'users.user',
            
        })
        res.status(200).json({ projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};


const GetProjectTasks = async (req, res) => {
    try {
        const tasks = await Tasks.find({ project: req.params.projectid}).populate({
            path: 'assignedto',
            
        }).populate({
            path: 'author',
            
        })
        
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const CreateTask = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.projectid });
        await Tasks.create({
            company: req.user.company,
            name: req.body.name,
            deadline: req.body.deadline,
            project: project._id,
            author: req.user._id,
            assignedto : req.body.assignedto
        });
        const tasks = await Tasks.find({ project: req.params.projectid}).populate({
            path: 'assignedto',
            
        }).populate({
            path: 'author',
            
        })
        res.status(200).json({ tasks });

    }


    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });

    }
}

const GetTask = async (req, res) => {
   

        try{
            const task = await Tasks.findOne({ _id: req.params.id }).populate({
                path: 'assignedto',
                
            }).populate({
                path: 'author',
                
            })
            res.status(200).json({ task });
        }

        catch(error){
            res.status(500).json({ message: error.message });
      }
}

const DeleteTask = async (req, res) => {
    try {
        await Tasks.deleteOne({ _id: req.params.id });
        const tasks = await Tasks.find({ project: req.params.projectid}).populate({
            path: 'assignedto',
            
        }).populate({
            path: 'author',
            
        })
        res.status(200).json({ tasks });

    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const UpdateTask = async (req, res) => {
    try {
        await Tasks.findOneAndUpdate({ _id: req.params.id },req.body  , { new: true });
     
        res.status(200).json({ message: 'Task updated successfully' });

    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}












module.exports = {
    GetAllProjects,
    GetProject,
    GetEmployeeProject,
    AddNewProject,
    CloseProject,
    DeleteProject,
    GetProjectTasks,
    CreateTask,
    DeleteTask,
    GetTask,
    UpdateTask

    
};