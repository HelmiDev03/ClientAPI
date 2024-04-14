
const TimeOffs = require('../../models/timeoff')
const Users = require('../../models/user')
const Notifications = require('../../models/notification')
const Policies = require('../../models/policy')


const { authorize } = require('../../mediaUpload/googledrive/config')
const { google } = require('googleapis');

const stream = require("stream"); // Added
const { file } = require('googleapis/build/src/apis/file')


const AddNewTimeOff = async (req, res) => {
    /* in the client side 
     if (!fileName.endsWith('.pdf')) {
            - Display an error message
            - Exit the function if fileName doesn't end with .pdf (return  ;); 

        }
    */


    try {
        console.log(req.body)
        const errors = {}
        let { type, description, daterange, file } = req.body
        daterange = daterange.map(dateString => {
            let date = new Date(dateString);
            date.setDate(date.getDate() + 1);
            return date.toISOString();
        });



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
            if (daysdiff + 1 > Policy.SickLeaveMaxTimeOffDays) {
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
            if (req.user.gender === 'Male') {
                if (daysdiff + 1 > Policy.ParentalLeaveMaxTimeOffDaysForMen) {
                    errors.daterange = `Parental leave days should not exceed ${Policy.ParentalLeaveMaxTimeOffDaysForMen}`
                }
            }
            else if (req.user.gender === 'Female') {
                if (daysdiff + 1 > Policy.ParentalLeaveMaxTimeOffDaysForWomen) {
                    errors.daterange = `Parental leave days should not exceed ${Policy.ParentalLeaveMaxTimeOffDaysForWomen}`
                }
            }
            else {
                errors.daterange = "You must choose a gender before in your profile settings"
            }

        }



        if (Object.keys(errors).length > 0) {
            return res.status(400).json(errors)
        }

        let timeoff = {}
        if (file !== '') {
            const templateBuffer = Buffer.from(req.body.file.split(',')[1], 'base64');
            const authClient = await authorize();
            const drive = google.drive({ version: 'v3', auth: authClient });
            const fileMetaData = {
                name: 'file.pdf',
                parents: ['1MKwnPNBybSbhG27ENoU6XJ44ppexNCNX'] // A folder ID to which file will get uploaded
            };
            const uploadedFile = await drive.files.create({
                resource: fileMetaData,
                media: {
                    body: new stream.PassThrough().end(templateBuffer),
                    mimeType: 'application/pdf'
                },
                fields: 'id'
            });
            const fileLink = `https://drive.google.com/file/d/${uploadedFile.data.id}/view`;
            timeoff = await TimeOffs.create({
                type,
                description,
                daterange,
                file: fileLink,
                userId: req.user.id,
                company: req.user.company,
            });
        } else {
            timeoff = await TimeOffs.create({
                type,
                description,
                daterange,
                userId: req.user.id,
                company: req.user.company,
            });
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
                file: timeoff.file,
                startdate: daterange[0],
                enddate: daterange[1],
                requestedat: Date.now(),
            }
            // Add other necessary fields
        });

        // Emit an event to notify clients about the new notification

        const unreadNotificationsCount = await Notifications.countDocuments({ userId: req.user.manager, seen: false });
        io.emit('unreadNotificationsCount', { userId: req.user.manager, unreadNotificationsCount });

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
        const timeoff = await TimeOffs.findById(req.params.id)
        await TimeOffs.findByIdAndUpdate(req.params.id, { etat: req.body.etat, response: req.body.response, supervisor: { firstname: req.user.firstname, lastname: req.user.lastname, profilepicture: req.user.profilepicture } })
        const user = await Users.findById(req.user.id)
        user.password = undefined
        await Notifications.create({
            company: req.user.company,
            userId: timeoff.userId,
            content: {

                reason: "Time off request Answered",
                timeoffid: timeoff._id,
                user: user,
                type: timeoff.type,
                etat: req.body.etat,
                response: req.body.response,
                startdate: timeoff.daterange[0],
                enddate: timeoff.daterange[1],
                answredat: new Date(),
            }
            // Add other necessary fields
        });


        const unreadNotificationsCount = await Notifications.countDocuments({ userId: timeoff.userId, seen: false });
        io.emit('unreadNotificationsCount', { userId: timeoff.userId, unreadNotificationsCount });
        return res.status(200).json({ message: "Time off updated successfully" })
    }

    catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}


















const GetUserTimeOffs = async (req, res) => {
    try {
        const timeoffs = await TimeOffs.find({ userId: req.user.id }).populate('supervisor', 'firstname lastname profilepicture')

        timeoffs.sort((a, b) => b.createdAt - a.createdAt)

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
        timeoffs.sort((a, b) => b.createdAt - a.createdAt)
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