





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
    try{
        const permissionGroup = await PermissionGroup.findOne({ _id: req.params.id});
        if(!permissionGroup){
            return res.status(404).json({ message: 'Permission Group not found'});
        }
        return res.status(200).json({ permissionGroup });
    }

    catch(error){
        return res.status(500).json({ message: error.message });
    }
}








const CreatePermissionGroup = async (req, res) => {




    try {
         
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



























module.exports = {
    GetPermissionGroups,
    GetPermissionGroup ,
    CreatePermissionGroup,
}