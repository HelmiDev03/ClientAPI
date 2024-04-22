
const Companies = require('../../models/company');
const Policies = require('../../models/policy');
const Users = require('../../models/user');
const TimeOffs = require('../../models/timeoff');









const GetPolicies = async (req, res) => {
    try {

        let policies = await Policies.find({ company: req.user.company });

        let policiesWithUsers = [];


        await Promise.all(policies.map(async (policy) => {

            const employees = await Users.find({ policy: policy._id });
            const policyWithUsers = { ...policy.toObject(), employees };
            policiesWithUsers.push(policyWithUsers);
        }));
        //sortedby older createdt
        policiesWithUsers.sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt);
        });

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
        policiesWithUsers.sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt);
        });
        return res.status(200).json({ policies: policiesWithUsers });
    } catch (error) {
       

        res.status(500).json({ message: error.message });
    }
};


const DeletePolicy = async (req, res) => {

    try {
        console.log(req.params.id)
        const usersPolicies = await Users.find({ policy: req.params.id });
        const defaultpolicy = await Policies.findOne({ isdefault: true, company: req.user.company });
        await Promise.all(usersPolicies.map(async (user) => {
            await Users.findByIdAndUpdate(user._id, { policy: defaultpolicy._id }, { new: true });
        }));

        await Policies.findByIdAndDelete(req.params.id);
        let policies = await Policies.find({ company: req.user.company });

        let policiesWithUsers = [];


        await Promise.all(policies.map(async (policy) => {

            const employees = await Users.find({ policy: policy._id });
            const policyWithUsers = { ...policy.toObject(), employees };
            policiesWithUsers.push(policyWithUsers);
        }));
        policiesWithUsers.sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt);
        });
        return res.status(200).json({ policies: policiesWithUsers, message: 'Policy deleted successfully' });
    }

    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}




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
        policiesWithUsers.sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt);
        });
        return res.status(200).json({ policies: policiesWithUsers, message: "Policy updated successfully" });


    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const setnewDefaultPolicy = async (req, res) => {
    try {
        const policy = await Policies.findById(req.params.id);
        if (!policy) {
            return res.status(404).json({ message: 'Policy not found' });
        }
        //seting old dault policy to faslelse
        await Policies.findOneAndUpdate({ isdefault: true , company:req.user.company }, { isdefault: false } , { new: true })
        await Policies.findByIdAndUpdate(req.params.id, { isdefault: true } , { new: true });
        let policies = await Policies.find({ company: req.user.company });

        let policiesWithUsers = [];


        await Promise.all(policies.map(async (policy) => {

            const employees = await Users.find({ policy: policy._id });
            const policyWithUsers = { ...policy.toObject(), employees };
            policiesWithUsers.push(policyWithUsers);
        }));
        policiesWithUsers.sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt);
        });
        return res.status(200).json({ policies: policiesWithUsers, message: 'Default policy updated successfully' });
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
            policiesWithUsers.sort((a, b) => {
                return new Date(a.createdAt) - new Date(b.createdAt);
            });
            return res.status(200).json({ message: 'Employee policy updated successfully', policies: policiesWithUsers });
        }

    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


const AddNewEmployeesToPolicy = async (req, res) => {
    try {
        const policy = await Policies.findById(req.params.id);
        const employeesId = req.body.employeesId;
        const employees = await Users.find({ _id: { $in: employeesId } });
        await Promise.all(employees.map(async (employee) => {
            await Users.findByIdAndUpdate(employee._id, { policy: policy._id, accruedDays: 0 }, { new: true });
        }));
        let policies = await Policies.find({ company: req.user.company });

        let policiesWithUsers = [];


        await Promise.all(policies.map(async (policy) => {

            const employees = await Users.find({ policy: policy._id });
            const policyWithUsers = { ...policy.toObject(), employees };
            policiesWithUsers.push(policyWithUsers);
        }));
        policiesWithUsers.sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt);
        });

        return res.status(200).json({ message: 'Employees added to policy successfully', policies: policiesWithUsers });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}





function getMonthNumber(monthName) {
    switch (monthName.toLowerCase()) {
        case 'january': return 0;
        case 'february': return 1;
        case 'march': return 2;
        case 'april': return 3;
        case 'may': return 4;
        case 'june': return 5;
        case 'july': return 6;
        case 'august': return 7;
        case 'september': return 8;
        case 'october': return 9;
        case 'november': return 10;
        case 'december': return 11;
        default: throw new Error('Invalid month name: ' + monthName);
    }
}
//reciproque
function getMonthName(monthIndex) {
    switch (monthIndex) {
        case 0: return 'January';
        case 1: return 'February';
        case 2: return 'March';
        case 3: return 'April';
        case 4: return 'May';
        case 5: return 'June';
        case 6: return 'July';
        case 7: return 'August';
        case 8: return 'September';
        case 9: return 'October';
        case 10: return 'November';
        case 11: return 'December';
        default: throw new Error('Invalid month index: ' + monthIndex);
    }
}

const CalculateTimeOffDaysOfEmployee = async(req,res)=>{
    try {
        const currentDate = new Date();
        const user = await Users.findById(req.params.id)
        console.log(user)

        const company = await Companies.findById(user.company);


        let policy = await Policies.findById(user.policy);
        let accruedDays = user.accruedDays;
        if (policyHasEnded(policy)) {
            const policyStart = calculatePolicyStartDate(policy);

            console.log('policystart', policyStart)
            console.log('userjoiin', user.createdAt)

            const userStartDate = user.createdAt > policyStart ? user.createdAt : policyStart;

            // Calculate days since the start date excluding Sundays for last cycle if policy , timeofflastforever is true
            if (policy.timeOffLastForever) {
                const startmonthnumber = getMonthNumber(policy.startMonth);
                const durationValue = parseInt(policy.duration[0]); // Extract duration value (e.g., 6)
                const endDate = new Date(Date.UTC(currentDate.getFullYear(), startmonthnumber + durationValue, 1));
                const daysSinceStartExcludingOffDays = calculateDaysSinceStartExcludingOffDays(userStartDate, endDate, company.workingdays, company.nationaldays, policy);
                user.accruedDays += calculateAccruedDays(policy, daysSinceStartExcludingOffDays, policyStart);
                accruedDays = user.accruedDays;
            }

            policy = await updatePolicyDuration(policy);
        }

        // Calculate the start date of the current policy cycle
        const policyStart = calculatePolicyStartDate(policy);
        console.log('policystart', policyStart)
        console.log('userjoiin', user.createdAt)
        // Determine the user's start date (either user creation date or policy start date)
        const userStartDate = user.createdAt > policyStart ? user.createdAt : policyStart;

        // Calculate days since the start date excluding Sundays
        const daysSinceStartExcludingOffDays = calculateDaysSinceStartExcludingOffDays(userStartDate, currentDate, company.workingdays, company.nationaldays, policy);
        // Calculate accrued days based on the policy's settings

        accruedDays += calculateAccruedDays(policy, daysSinceStartExcludingOffDays, policyStart);
        await user.save();
        const startmonthnumber = getMonthNumber(policy.startMonth);
        const durationValue = parseInt(policy.duration[0]); // Extract duration value (e.g., 6)
        const endDate = new Date(Date.UTC(currentDate.getFullYear(), startmonthnumber + durationValue, 1));
        const userTimeOffs = await TimeOffs.find({ userId:user.id, etat: "Approved" });

        let used = 0
        let timeoffapproved = []
        for (let i = 0; i < userTimeOffs.length; i++) {
            const startDate = new Date(userTimeOffs[i].daterange[0]);
            const endDate = new Date(userTimeOffs[i].daterange[1]);

            // Calculate difference in milliseconds
            const differenceMs = endDate.getTime() - startDate.getTime();

            // Convert difference to days and round it
            const daysdiff = Math.round(differenceMs / (1000 * 60 * 60 * 24));

            // Calculate total days between dates including both start and end dates
            const totalDays = daysdiff + 1;
            used += totalDays;
            timeoffapproved.push([startDate, endDate, totalDays, userTimeOffs[i].type]);

            // in case where the policy take national days as free days 
            if (policy.nationaldays) {
                for (let nationaldays = 0; nationaldays < company.nationaldays.length; nationaldays++) {
                    const nationaldate = company.nationaldays[nationaldays].day
                    console.log(nationaldate.getMonth() + 1, startDate.getMonth() + 1, nationaldate.getDate(), startDate.getDate(), nationaldate.getMonth() + 1, endDate.getMonth() + 1, nationaldate.getDate(), endDate.getDate())
                    const isWithinRange = (
                        (nationaldate.getMonth() + 1 == startDate.getMonth() + 1 && nationaldate.getDate() >= startDate.getDate()) &&
                        (nationaldate.getMonth() + 1 == endDate.getMonth() + 1 && nationaldate.getDate() <= endDate.getDate())
                    );

                    isWithinRange ? used-- : undefined;
                }

            }
            //end national days case
        }
        console.log(used)
        const available = accruedDays - used;

        return res.status(200).json({ daysSinceStartExcludingOffDays, accruedDays, used, available, timeoffapproved, userStartDate, endDate });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    }
}




















const CalculateTimeOffDays = async (req, res) => {
    try {
        const currentDate = new Date();
        const user = req.user;
        const company = await Companies.findById(user.company);


        let policy = await Policies.findById(user.policy);
        let accruedDays = user.accruedDays;
        if (policyHasEnded(policy)) {
            const policyStart = calculatePolicyStartDate(policy);

            console.log('policystart', policyStart)
            console.log('userjoiin', user.createdAt)

            const userStartDate = user.createdAt > policyStart ? user.createdAt : policyStart;

            // Calculate days since the start date excluding Sundays for last cycle if policy , timeofflastforever is true
            if (policy.timeOffLastForever) {
                const startmonthnumber = getMonthNumber(policy.startMonth);
                const durationValue = parseInt(policy.duration[0]); // Extract duration value (e.g., 6)
                const endDate = new Date(Date.UTC(currentDate.getFullYear(), startmonthnumber + durationValue, 1));
                const daysSinceStartExcludingOffDays = calculateDaysSinceStartExcludingOffDays(userStartDate, endDate, company.workingdays, company.nationaldays, policy);
                user.accruedDays += calculateAccruedDays(policy, daysSinceStartExcludingOffDays, policyStart);
                accruedDays = user.accruedDays;
            }

            policy = await updatePolicyDuration(policy);
        }

        // Calculate the start date of the current policy cycle
        const policyStart = calculatePolicyStartDate(policy);
        console.log('policystart', policyStart)
        console.log('userjoiin', user.createdAt)
        // Determine the user's start date (either user creation date or policy start date)
        const userStartDate = user.createdAt > policyStart ? user.createdAt : policyStart;

        // Calculate days since the start date excluding Sundays
        const daysSinceStartExcludingOffDays = calculateDaysSinceStartExcludingOffDays(userStartDate, currentDate, company.workingdays, company.nationaldays, policy);
        // Calculate accrued days based on the policy's settings

        accruedDays += calculateAccruedDays(policy, daysSinceStartExcludingOffDays, policyStart);
        await user.save();
        const startmonthnumber = getMonthNumber(policy.startMonth);
        const durationValue = parseInt(policy.duration[0]); // Extract duration value (e.g., 6)
        const endDate = new Date(Date.UTC(currentDate.getFullYear(), startmonthnumber + durationValue, 1));
        const userTimeOffs = await TimeOffs.find({ userId: req.user.id, etat: "Approved" });

        let used = 0
        let timeoffapproved = []
        for (let i = 0; i < userTimeOffs.length; i++) {
            const startDate = new Date(userTimeOffs[i].daterange[0]);
            const endDate = new Date(userTimeOffs[i].daterange[1]);

            // Calculate difference in milliseconds
            const differenceMs = endDate.getTime() - startDate.getTime();

            // Convert difference to days and round it
            const daysdiff = Math.round(differenceMs / (1000 * 60 * 60 * 24));

            // Calculate total days between dates including both start and end dates
            const totalDays = daysdiff + 1;
            used += totalDays;
            timeoffapproved.push([startDate, endDate, totalDays, userTimeOffs[i].type]);

            // in case where the policy take national days as free days 
            if (policy.nationaldays) {
                for (let nationaldays = 0; nationaldays < company.nationaldays.length; nationaldays++) {
                    const nationaldate = company.nationaldays[nationaldays].day
                    console.log(nationaldate.getMonth() + 1, startDate.getMonth() + 1, nationaldate.getDate(), startDate.getDate(), nationaldate.getMonth() + 1, endDate.getMonth() + 1, nationaldate.getDate(), endDate.getDate())
                    const isWithinRange = (
                        (nationaldate.getMonth() + 1 == startDate.getMonth() + 1 && nationaldate.getDate() >= startDate.getDate()) &&
                        (nationaldate.getMonth() + 1 == endDate.getMonth() + 1 && nationaldate.getDate() <= endDate.getDate())
                    );

                    isWithinRange ? used-- : undefined;
                }

            }
            //end national days case
        }
        console.log(used)
        const available = accruedDays - used;

        return res.status(200).json({ daysSinceStartExcludingOffDays, accruedDays, used, available, timeoffapproved, userStartDate, endDate });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    }
}

const updatePolicyDuration = async (policy) => {
    try {
        console.log(policy.duration)
        // Update policy duration as needed
        const months = policy.startMonth;
        const monthIndex = getMonthNumber(months);
        const durationValue = parseInt(policy.duration[0]); // Extract duration value (e.g., 6)
        //update monthstart with oldmont + duration
        const newMonth = getMonthName(new Date().getMonth());

        policy.startMonth = newMonth;


        // Save the updated policy
        return await policy.save();
    } catch (error) {
        throw new Error('Error updating policy duration: ' + error.message);
    }
}

const policyHasEnded = (policy) => {
    // Get the current date
    const currentDate = new Date();

    // Calculate the end date of the current policy cycle
    const policyStart = calculatePolicyStartDate(policy);
    const startmonthnumber = getMonthNumber(policy.startMonth);
    const durationValue = parseInt(policy.duration[0]); // Extract duration value (e.g., 6)
    const endDate = new Date(Date.UTC(currentDate.getFullYear(), startmonthnumber + durationValue, 1));




    console.log(policyStart)
    console.log(endDate)
    console.log(currentDate > endDate)
    return currentDate > endDate;
}


// Function to calculate the start date of the current policy cycle
const calculatePolicyStartDate = (policy) => {
    const policyStartMonth = policy.startMonth;
    const currentYear = new Date().getFullYear();
    const monthIndex = getMonthNumber(policyStartMonth);
    return new Date(Date.UTC(currentYear, monthIndex, 1));
}

// Function to calculate days since the start date excluding Sundays

const getDayName = (dayIndex) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
}

const calculateDaysSinceStartExcludingOffDays = (startDate, endDate, workingdays, nationaldays, policy) => {
    console.log(workingdays)

    let daysSinceStartExcludingOffDays = 0;
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {


        if (workingdays.includes(getDayName(date.getDay()))) {
            console.log(getDayName(date.getDay()))
            daysSinceStartExcludingOffDays++;
            if (policy.nationaldays) {
                for (let nationaldays = 0; nationaldays < nationaldays.length; nationaldays++) {
                    const nationaldate = nationaldays[nationaldays].day
                    const isWithinRange = (
                        nationaldate.getMonth() + 1 == date.getMonth() + 1 && nationaldate.getDate() == date.getDate()

                    );
                    isWithinRange ? daysSinceStartExcludingOffDays-- : undefined;
                }

            }
        }
    }
    return daysSinceStartExcludingOffDays;
}
// Function to calculate accrued days based on the policy's settings for all cycles
const calculateAccruedDays = (policy, daysSinceStartExcludingOffDays) => {
    const workingDaysPerMonth = policy.workingDays;
    const timeOffDaysPerWorkingDay = policy.TimeOffDaysPerWorkingDays;
    let accruedDays = 0;
    console.log('daysSinceStartExcludingOffDays', daysSinceStartExcludingOffDays)
    console.log('workingDaysPerMonth', workingDaysPerMonth)
    console.log('timeOffDaysPerWorkingDay', timeOffDaysPerWorkingDay)
    accruedDays += Math.floor(daysSinceStartExcludingOffDays / workingDaysPerMonth) * timeOffDaysPerWorkingDay;
    console.log('accruedDays', accruedDays);
    return accruedDays;
}



// Function to get the month name from the month index















module.exports = {
    GetPolicies,
    GetPolicy,
    CreatePolicy,
    DeletePolicy,
    UpdatePolicy,
    setnewDefaultPolicy,
    UpdateEmployeePolicy,
    AddNewEmployeesToPolicy,
    CalculateTimeOffDays,
    CalculateTimeOffDaysOfEmployee,
};