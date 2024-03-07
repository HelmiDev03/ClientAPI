const Users = require('../models/user');
const Companies = require('../models/company');
const bcrypt = require('bcryptjs')
const  uploadImage = require('../mediaUpload/uploadmediaconfig')
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


































module.exports = {
    GetAllEmployees,
    AddNewEmployee,
}