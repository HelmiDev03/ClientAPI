
const TimeOffs = require('../../models/timeoff')
const Users = require('../../models/user')
const Notifications = require('../../models/notification')
const Policies = require('../../models/policy')
const uploadImage = require('../../mediaUpload/uploadmediaconfig')



const AddNewTimeOff = async (req, res) => {


    try {
        console.log(req.body)
        const errors = {}
        let { type, description, daterange,file } = req.body
        daterange = daterange.map(dateString => {
            let date = new Date(dateString);
            date.setDate(date.getDate() + 1);
            return date.toISOString();
        });
        //daterange is format of 
        /*
        
      0
      "2024-05-14T23:00:00.000Z"
      1
      "2024-05-17T23:00:00.000Z"
      here the days are decremneted by 1 so we need to inccrement it by 1 , exemeple for 31/01/2010  , we need to send 01/02/2010
        */


        if (!type) {
            errors.type = "Type is required"
        }
        if (Date.now() > new Date(daterange[0])) {
            errors.daterange = "Date range is invalid"
        }
        if (!description) {
            errors.description = "Description is required"
        }
        const Policy = await Policies.findOne({ _id: req.user.policy })


        if (type === "Sick leave") {
            const startDate = new Date(daterange[0]);
            const endDate = new Date(daterange[1]);
            const differenceMs = endDate.getTime() - startDate.getTime();

            // Convert difference to days and round it
            const daysdiff = Math.round(differenceMs / (1000 * 60 * 60 * 24));
            console.log("daysdiff", daysdiff)
            console.log("Policy.SickLeaveMaxTimeOffDays", Policy.SickLeaveMaxTimeOffDays)
            if (daysdiff+1 > Policy.SickLeaveMaxTimeOffDays) {
                errors.daterange = `Sick leave days should not exceed ${Policy.SickLeaveMaxTimeOffDays}`
                                                          }
                                      }
        else if (type === "Parental leave") {
            const startDate = new Date(daterange[0]);
            const endDate = new Date(daterange[1]);
            const differenceMs = endDate.getTime() - startDate.getTime();

            // Convert difference to days and round it
            const daysdiff = Math.round(differenceMs / (1000 * 60 * 60 * 24));
            console.log("daysdiff", daysdiff)
            console.log("Policy.ParentalLeaveMaxTimeOffDaysForWomen", Policy.ParentalLeaveMaxTimeOffDaysForWomen)
            console.log("Policy.ParentalLeaveMaxTimeOffDaysForMen", Policy.ParentalLeaveMaxTimeOffDaysForMen)
            if (req.user.gender==='Male'){
                if (daysdiff+1 > Policy.ParentalLeaveMaxTimeOffDaysForMen) {
                    errors.daterange = `Parental leave days should not exceed ${Policy.ParentalLeaveMaxTimeOffDaysForMen}`
                }
            }
            else if (req.user.gender === 'Female'){
                if (daysdiff+1 > Policy.ParentalLeaveMaxTimeOffDaysForWomen) {
                    errors.daterange = `Parental leave days should not exceed ${Policy.ParentalLeaveMaxTimeOffDaysForWomen}`
                }
            }
            else{
                errors.daterange = "You must choose a gender before in your profile settings"
                }   
            
                                                }



        if (Object.keys(errors).length > 0) {
            return res.status(400).json(errors)
        }

        let timeoff = {}
        if (file!='') {
                const fileurl = await uploadImage(file)
                 timeoff = await TimeOffs.create({
                    type,
                    description,
                    daterange,
                    file : fileurl,
                    userId: req.user.id
                })
          }
        else{
           timeoff = await TimeOffs.create({
                type,
                description,
                daterange,
                userId: req.user.id
            })
        }



       

        const user = await Users.findById(req.user.id)
        user.password = undefined
        await Notifications.create({
            company: req.user.company,
            userId: req.user.manager,
            content: {

                reason: "Time off request",
                timeoffid: timeoff._id,
                user: user,
                type: type,
                startdate: daterange[0],
                enddate: daterange[1],
                requestedat: Date.now(),
            }
            // Add other necessary fields
        });

        // Emit an event to notify clients about the new notification


        return res.status(200).json({ message: "Time off request created successfully" })


    }

    catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }


}



const UpdateTimeOff = async (req, res) => {
    try {
        console.log(req.body)
        await TimeOffs.findByIdAndUpdate(req.params.id, { etat: req.body.etat, response: req.body.response, supervisor: { firstname: req.user.firstname, lastname: req.user.lastname, profilepicture: req.user.profilepicture } })
        return res.status(200).json({ message: "Time off updated successfully" })
    }

    catch (error) {
        return res.status(500).json({ error })
    }
}



















const GetUserTimeOffs = async (req, res) => {
    try {
        const timeoffs = await TimeOffs.find({ userId: req.user.id }).populate('supervisor', 'firstname lastname profilepicture')
        //mobile
        //const timeoffs = await TimeOffs.find({company : req.user.company}).populate('supervisor' , 'firstname lastname profilepicture ').populate('userId' , 'firstname lastname profilepicture')

        return res.status(200).json({ timeoffs })
    }
    catch (error) {
        return res.status(500).json({ error })
    }
}


const GetEmployeeTimeOffs = async (req, res) => {
    try {
        const timeoffs = await TimeOffs.find({ userId: req.params.id }).populate('supervisor', 'firstname lastname profilepicture')
        //mobile
        //const timeoffs = await TimeOffs.find({company : req.user.company}).populate('supervisor' , 'firstname lastname profilepicture ').populate('userId' , 'firstname lastname profilepicture')

        return res.status(200).json({ timeoffs })
    }
    catch (error) {
        return res.status(500).json({ error })
    }
}






















module.exports = {
    AddNewTimeOff,
    UpdateTimeOff,
    GetUserTimeOffs,
    GetEmployeeTimeOffs
}