const Users = require('../models/user');
const Companies = require('../models/company');






const UpdateCompanyPackage = async (req, res) => {
    try {
        const {package } = req.body;
        const company = await Companies.findOne({ _id: req.user.company });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        company.package = package;
        await company.save();
        res.status(200).json({ message: "Package updated" , company : company});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}










module.exports = {
     UpdateCompanyPackage
 }