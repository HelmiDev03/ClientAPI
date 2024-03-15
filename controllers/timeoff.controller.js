
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
        res.status(200).json({ policies: policiesWithUsers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




























module.exports = {
    GetPolicies,
};