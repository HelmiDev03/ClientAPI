const Users = require('../models/user');
const Companies = require('../models/company');

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


































module.exports = {
    GetAllEmployees
}