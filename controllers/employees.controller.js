const Users = require('../models/user');
const Attendance  = require('../models/attendance');
const Companies = require('../models/company');
const bcrypt = require('bcryptjs')
const uploadImage = require('../mediaUpload/uploadmediaconfig')
const deleteImage = require('../mediaUpload/deletemediaconfig')
const SendWelcomeEmail = require('../Emails/createnewemployee/sendwelcomeemail')
const Policies = require('../models/policy');
const PermissionGroup = require('../models/permissiongroup');


const GetAllEmployees = async (req, res) => {
    try {
        const employees = await Users.find({ company: req.user.company });
        //remove password from employees
        employees.forEach(employee => {
            employee.password = undefined;
        });
        return res.status(200).json({ employees });
    }

    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}




const AddNewEmployee = async (req, res) => {
    console.log(req.body);
    try {
        const policy = await Policies.findOne({ isdefault: true, company: req.user.company });
        const permissinGroup = await PermissionGroup.findOne({  isdefault: true, company: req.user.company });
        let user = {}

        const {
            firstname,
            lastname,
            phonenumber,
            cin,
            adress,
            dateofbirth,
            role,
            email,
            password,
            profilepicture,
            
        } = req.body;
       
        const hashed = await bcrypt.hashSync(password, 10);


        if (profilepicture ) {
            const url = await uploadImage(profilepicture);




            user = new Users({
                firstname,
                lastname,
                phonenumber,
                cin,
                adress,
                dateofbirth,
                role,
                email,
                password: hashed,
                profilepicture: url,
                company: req.user.company,
                isVerified: true,
                policy : policy._id,
                permissionGroup : permissinGroup._id,
                manager : req.user._id
            });
            await user.save();
        }
        else {
            user = new Users({
                firstname,
                lastname,
                phonenumber,
                cin,
                adress,
                dateofbirth,
                role,
                email,
                password: hashed,
                company: req.user.company,
                isVerified: true,
                policy : policy._id,
                permissionGroup : permissinGroup._id,
                manager : req.user._id
            });
            await user.save();
        }

        const company = await Companies.findOne({ _id: req.user.company });
        SendWelcomeEmail(user,password, company.name , req.user);
        let policies = await Policies.find({ company: req.user.company });

        let policiesWithUsers = [];


        await Promise.all(policies.map(async (policy) => {

            const employees = await Users.find({ policy: policy._id });
            const policyWithUsers = { ...policy.toObject(), employees };
            policiesWithUsers.push(policyWithUsers);
        }));
        let permissionGroups = await PermissionGroup.find({ company: req.user.company });

        let permissionGroupsWithUsers = [];

        await Promise.all(permissionGroups.map(async (permissionGroup) => {

            const users = await Users.find({ permissionGroup: permissionGroup._id });
            const permissionGroupWithUsers = { ...permissionGroup.toObject(), users };
            permissionGroupsWithUsers.push(permissionGroupWithUsers);
        }));
        const attendance = await Attendance.create({
            user : user._id,
        })
        await attendance.save()
     

        return res.status(201).json({ message: 'Employee added successfully'  ,  policies: policiesWithUsers ,  permissionGroups: permissionGroupsWithUsers});

    }





    catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message });
    }


}


const GetEmployee = async (req, res) => {
    try {
        const employee = await Users.findOne({ _id: req.params.id });
        if (employee) {
            employee.password = undefined;
            return res.status(200).json({ employee });
        }
        return res.status(404).json({ message: 'Employee not found' });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}



















const DeleteEmployee = async (req, res) => {
    try {
        const employee = await Users.findOne({ _id: req.params.id });
        console.log(employee)
        if (employee) {
             await Users.deleteOne({ _id: req.params.id });

            if (req.params.publicId!="error")
                       deleteImage(req.params.publicId)
                       let policies = await Policies.find({ company: req.user.company });

                       let policiesWithUsers = [];
               
               
                       await Promise.all(policies.map(async (policy) => {
               
                           const employees = await Users.find({ policy: policy._id });
                           const policyWithUsers = { ...policy.toObject(), employees };
                           policiesWithUsers.push(policyWithUsers);
                       }));
            return res.status(200).json({ message: 'Employee deleted successfully' , policies: policiesWithUsers });
        }
        return res.status(404).json({ message: 'Employee not found' });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message });
    }
}












const UpdateEmployeeManager = async (req, res) => {
    try {
        const employee = await Users.findOne({ _id: req.params.employeeid });
        const manager = await Users.findOne({ _id: req.params.managerid });
        console.log(employee);
        console.log(manager);
        
            employee.manager = manager._id;
            await employee.save();
            return res.status(200).json({ message: 'Employee manager updated successfully' });
        
    }


    catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message });
    }


}





















module.exports = {
    GetAllEmployees,
    AddNewEmployee,
    GetEmployee,
    DeleteEmployee,
    UpdateEmployeeManager,
}