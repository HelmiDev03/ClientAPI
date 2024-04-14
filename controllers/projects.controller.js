const Project = require('../models/project');
const User = require('../models/user');



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








const RemoveMemberFromProject = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.projectid });
        project.users = project.users.filter(user => req.params.memberid === user.user.toString());
        await project.save();
        const projects = await Project.find({ company: req.user.company }).populate({
            path: 'users.user',
            
        })
        res.status(200).json({ projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




module.exports = {
    GetAllProjects,
    GetProject,
    AddNewProject,
    CloseProject,
    DeleteProject,
    RemoveMemberFromProject,
    
};