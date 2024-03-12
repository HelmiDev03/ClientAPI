const Users = require('../models/user');
const Companies = require('../models/company');
const  uploadImage = require('../mediaUpload/uploadmediaconfig')
const {  namePattern, phonePattern } = require('..//pattern')

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


const UpdateCompany = async (req, res) => {
    try{
        const { name, phonenumber, domaine, anniversaire,adress,city, country, zip, logo } = req.body;
        const errors = {}
        if ( !namePattern.test(name)) errors.name = "Invalid name";
        if ( !phonePattern.test(phonenumber)) errors.phonenumber = "Invalid phone number";
        if (Object.keys(errors).length) return res.status(400).json(errors );
        let company={}
      if (logo!=""){
        let url = await uploadImage(logo)

        company = await Companies.findOneAndUpdate({ _id: req.user.company }, {
            name,
            phonenumber,
            domaine,
            anniversaire,
            adress,
            city,
            country,
            zip,
            logo: url
        }, { new: true });
                }
      else {
         company = await Companies.findOneAndUpdate({ _id: req.user.company }, {
            name,
            phonenumber,
            domaine,
            anniversaire,
            adress,
            city,
            country,
            zip,
        }, { new: true });
      }          

       return res.status(200).json({ message: "Company updated" , company : company});
   }
                            


    catch (error) {
       console.log(error);
        return res.status(500).json({ message: error.message });
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
     UpdateCompany,
     UpdateCompanyPackage
 }