const Users = require('../models/user');
const Companies = require('../models/company');



const GetCompanyData = async (req, res) => {

    try {
        const company = await Companies.findOne({ _id: req.user.company });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        
        return res.status(200).json({ company: company });
    
   }
catch (error) {
       
        return res.status(500).json({ message: "Internal server error" });
    }


}

const UpdateCompanyPackage = async (req, res) => {
    try {
        const {package } = req.body;
        const company = await Companies.findOne({ _id: req.user.company });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        company.package = package;
        await company.save();
        return res.status(200).json({ message: "Package updated" , company : company});
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}










module.exports = {
     GetCompanyData,
     UpdateCompanyPackage
 }