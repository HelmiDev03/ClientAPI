





const PermissionGroup = require('../models/permissiongroup');
const Users = require('../models/user');








const GetPermissionGroups = async (req, res) => {

    try {

        let permissionGroups = await PermissionGroup.find({ company: req.user.company });

        let permissionGroupsWithUsers = [];

        await Promise.all(permissionGroups.map(async (permissionGroup) => {

            const users = await Users.find({ permissionGroup: permissionGroup._id });
            const permissionGroupWithUsers = { ...permissionGroup.toObject(), users };
            permissionGroupsWithUsers.push(permissionGroupWithUsers);
        }));

        return res.status(200).json({ permissionGroups: permissionGroupsWithUsers });


    }




    catch (error) {
        return res.status(500).json({ message: error.message });

    }

}


const GetPermissionGroup = async (req, res) => {
    try {
        const permissionGroup = await PermissionGroup.findOne({ _id: req.params.id });
        if (!permissionGroup) {
            return res.status(404).json({ message: 'Permission Group not found' });
        }
        let permissionGroupsWithUsers = { ...permissionGroup.toObject(), users: [] };
        const users = await Users.find({ permissionGroup: permissionGroup._id });
        permissionGroupsWithUsers.users = users;


        return res.status(200).json({ permissionGroup: permissionGroupsWithUsers });
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}








const CreatePermissionGroup = async (req, res) => {




    try {
        if (await PermissionGroup.findOne({ name: req.body.name })) {
            return res.status(400).json({ name: 'Permission Group already exists' });
        }

        const permissionGroup = new PermissionGroup({
            company: req.user.company,
            name: req.body.name,


        });

        const newPermissionGroup = await permissionGroup.save();
        let permissionGroups = await PermissionGroup.find({ company: req.user.company });

        let permissionGroupsWithUsers = [];

        await Promise.all(permissionGroups.map(async (permissionGroup) => {

            const users = await Users.find({ permissionGroup: permissionGroup._id });
            const permissionGroupWithUsers = { ...permissionGroup.toObject(), users };
            permissionGroupsWithUsers.push(permissionGroupWithUsers);
        }));

        return res.status(201).json({ permissionGroups: permissionGroupsWithUsers });
    }

    catch (error) {

        return res.status(500).json({ message: error.message });
    }

}





const GetUserPermissionGroup = async (req, res) => {



    try {
        console.log(req)
        const group = await PermissionGroup.findOne({ _id: req.user.permissionGroup });
        console.log(group)  

        return res.status(200).json({ group });

    }

    catch {
        return res.status(500).json({ message: error.message });
    }

}



const DeletePermissionGroup = async (req, res) => {
    try {
        const users = await Users.find({ permissionGroup: req.params.id });
        console.log(users)
        const defaultgroup = await PermissionGroup.findOne({ company: req.user.company , isdefault : true})
        
        //change to group default
        await Promise.all(users.map(async (user) => {
            
            await Users.findByIdAndUpdate(user._id, { permissionGroup:  defaultgroup._id }, { new: true });
        }));
        const permissionGroup = await PermissionGroup.findOneAndDelete({ _id: req.params.id });


        let permissionGroups = await PermissionGroup.find({ company: req.user.company });

        let permissionGroupsWithUsers = [];

        await Promise.all(permissionGroups.map(async (permissionGroup) => {

            const users = await Users.find({ permissionGroup: permissionGroup._id });
            const permissionGroupWithUsers = { ...permissionGroup.toObject(), users };
            permissionGroupsWithUsers.push(permissionGroupWithUsers);
        }));

        return res.status(200).json({ permissionGroups: permissionGroupsWithUsers });
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}





const UpdateCustomPermissionGroup = async (req, res) => {

    try {
        const permissionGroup = await PermissionGroup.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        let permissionGroups = await PermissionGroup.find({ company: req.user.company });

        let permissionGroupsWithUsers = [];

        await Promise.all(permissionGroups.map(async (permissionGroup) => {

            const users = await Users.find({ permissionGroup: permissionGroup._id });
            const permissionGroupWithUsers = { ...permissionGroup.toObject(), users };
            permissionGroupsWithUsers.push(permissionGroupWithUsers);
        }));

        return res.status(200).json({ message: 'updated', permissionGroups: permissionGroupsWithUsers });

    }




    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}



const UpdateCustomPermissionGroupEmployees = async (req, res) => {



    try {
        const permissionGroup = await PermissionGroup.findOne({ _id: req.params.id });
        const employeesId = req.body.employeesId;
        const employees = await Users.find({ _id: { $in: employeesId } });
        await Promise.all(employees.map(async (employee) => {
            await Users.findByIdAndUpdate(employee._id, { permissionGroup: permissionGroup._id }, { new: true });
        }));

        let permissionGroups = await PermissionGroup.find({ company: req.user.company });

        let permissionGroupsWithUsers = [];

        await Promise.all(permissionGroups.map(async (permissionGroup) => {

            const users = await Users.find({ permissionGroup: permissionGroup._id });
            const permissionGroupWithUsers = { ...permissionGroup.toObject(), users };
            permissionGroupsWithUsers.push(permissionGroupWithUsers);
        }));

        return res.status(200).json({ message: 'Employees added to permission group successfully', permissionGroups: permissionGroupsWithUsers });
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}



const UpdateEmployeeGroup = async (req, res) => {

    try {
        const employee = await Users.findById(req.params.id);

        const permissionGroup = await PermissionGroup.findOne({ name: req.body.name, company: req.user.company });
        await Users.findByIdAndUpdate(req.params.id, { permissionGroup: permissionGroup._id }, { new: true });

        let permissionGroups = await PermissionGroup.find({ company: req.user.company });

        let permissionGroupsWithUsers = [];

        await Promise.all(permissionGroups.map(async (permissionGroup) => {

            const users = await Users.find({ permissionGroup: permissionGroup._id });
            const permissionGroupWithUsers = { ...permissionGroup.toObject(), users };
            permissionGroupsWithUsers.push(permissionGroupWithUsers);
        }));

        return res.status(200).json({ message: 'Employees added to permission group successfully', permissionGroups: permissionGroupsWithUsers });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }

}



const GetManagers = async (req, res) => {

    try {
        const group_managers = await PermissionGroup.find({ company: req.user.company, canbemanager:true });
        
        const managers = await Users.find({ permissionGroup: { $in: group_managers.map(group => group._id) } });
        console.log(managers)
        return res.status(200).json({ managers });
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}















module.exports = {
    GetPermissionGroups,
    GetPermissionGroup,
    CreatePermissionGroup,
    GetUserPermissionGroup,
    DeletePermissionGroup,
    UpdateCustomPermissionGroup,
    UpdateCustomPermissionGroupEmployees,
    UpdateEmployeeGroup,
    GetManagers,
}