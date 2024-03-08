const Users = require('../models/user');
const Companies = require('../models/company');
const bcrypt = require('bcryptjs')
const  uploadImage = require('../mediaUpload/uploadmediaconfig')
const deleteImage = require('../mediaUpload/deletemediaconfig')
const GetAllEmployees = async (req, res) => {
    try{
        const employees = await Users.find({company: req.user.company});
        //remove password from employees
        employees.forEach(employee => {
            employee.password = undefined;
        });
        return res.status(200).json({employees});
    }

    catch(err){
        return res.status(500).json({message: err.message});
    }
}




const AddNewEmployee = async (req, res) => {

try{
    const data = {
            firstname,
            lastname,
            phonenumber,
            cin,
            adress,
            dateofbirth,
            role,
            email,
            password,
            profilepicture
        } = req.body;
        
        const url = await uploadImage(profilepicture);

        const hashed = await bcrypt.hashSync(password, 10);
        const user = new Users({
            firstname,
            lastname,
            phonenumber,
            cin,
            adress,
            dateofbirth,
            role,
            email,
            password : hashed,
            profilepicture: url,
            company: req.user.company,
            isVerified: true
        });
        await user.save();
        return res.status(201).json({message: 'Employee added successfully'});

}





  catch(err){
    return res.status(500).json({message: err.message});
  }


}


const GetEmployee = async (req, res) => {
    try{
        const employee = await Users.findOne({_id: req.params.id});
        if(employee){
            employee.password = undefined;
            return res.status(200).json({employee});
        }
        return res.status(404).json({message: 'Employee not found'});
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}



















const DeleteEmployee = async (req, res) => {
    try{
        const employee = await Users.findOne({_id: req.params.id});
        if(employee){
            await Users.deleteOne({_id: req.params.id});
             deleteImage(req.params.publicId);
            return res.status(200).json({message: 'Employee deleted successfully'});
        }
        return res.status(404).json({message: 'Employee not found'});
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}


































module.exports = {
    GetAllEmployees,
    AddNewEmployee,
    GetEmployee,
    DeleteEmployee,
}