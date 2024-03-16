
const Policies = require('../models/policy');
const Users = require('../models/user');









const GetPolicies = async (req, res) => {
    try {

        let policies = await Policies.find({ company: req.user.company });

        let policiesWithUsers = [];


        await Promise.all(policies.map(async (policy) => {

            const employees = await Users.find({ policy: policy._id });
            const policyWithUsers = { ...policy.toObject(), employees };
            policiesWithUsers.push(policyWithUsers);
        }));

        // Return the populated policies
        return res.status(200).json({ policies: policiesWithUsers });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const GetPolicy = async (req, res) => {
    try {
        let policy = await Policies.findById(req.params.id);
        if (!policy) {
            return res.status(404).json({ message: 'Policy not found' });
        }
        let Policywithuser = {}
        if (policy) {
            const employees = await Users.find({ policy: policy._id });
            policy = { ...policy.toObject(), employees };
        }
        return res.status(200).json({ policy });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}









const CreatePolicy = async (req, res) => {
    try {
        const findPolicy = await Policies.findOne({ name: req.body.name, company: req.user.company });
        if (findPolicy) {
            return res.status(400).json({ name: 'Policy Name  Already Taken' });
        }
        const policy = new Policies({ ...req.body, company: req.user.company });
        await policy.save();
        let policies = await Policies.find({ company: req.user.company });

        let policiesWithUsers = [];


        await Promise.all(policies.map(async (policy) => {

            const employees = await Users.find({ policy: policy._id });
            const policyWithUsers = { ...policy.toObject(), employees };
            policiesWithUsers.push(policyWithUsers);
        }));
        return res.status(200).json({ policies: policiesWithUsers });
    } catch (error) {

        res.status(500).json({ message: error.message });
    }
};





const UpdatePolicy = async (req, res) => {
    try {
        console.log(req.body);
        const policy = await Policies.findById(req.params.id);
        if (!policy) {
            return res.status(404).json({ message: 'Policy not found' });
        }
        await Policies.findByIdAndUpdate(req.params.id, req.body);


        let policies = await Policies.find({ company: req.user.company });

        let policiesWithUsers = [];


        await Promise.all(policies.map(async (policy) => {

            const employees = await Users.find({ policy: policy._id });
            const policyWithUsers = { ...policy.toObject(), employees };
            policiesWithUsers.push(policyWithUsers);
        }));
        return res.status(200).json({ policies: policiesWithUsers, message: "Policy updated successfully" });


    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}




const UpdateEmployeePolicy = async (req, res) => {
    try {
        const employee = await Users.findById(req.params.id);
        if (employee) {
            const policy = await Policies.findOne({ name: req.body.name, company: req.user.company });
            await Users.findByIdAndUpdate(req.params.id, { policy: policy._id }, { new: true });


            let policies = await Policies.find({ company: req.user.company });

            let policiesWithUsers = [];


            await Promise.all(policies.map(async (policy) => {

                const employees = await Users.find({ policy: policy._id });
                const policyWithUsers = { ...policy.toObject(), employees };
                policiesWithUsers.push(policyWithUsers);
            }));
            return res.status(200).json({ message: 'Employee policy updated successfully', policies: policiesWithUsers });
        }

    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



























module.exports = {
    GetPolicies,
    GetPolicy,
    CreatePolicy,
    UpdatePolicy,
    UpdateEmployeePolicy,
};