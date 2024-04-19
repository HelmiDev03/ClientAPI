const Users = require('../models/user');
const Companies = require('../models/company');
const Attendance = require('../models/attendance');













const ClockIn = async (req, res) => {
    try {
        const thisdate = new Date();


        const userAttandanceForToday = await Attendance.findOne({ user: req.user._id });
        for (let i = 0; i < userAttandanceForToday.workingHours.length; i++) {
            if (userAttandanceForToday.workingHours[i].date.toString().slice(0, 10) === thisdate.toString().slice(0, 10)) {
                //update lastclockin
                userAttandanceForToday.workingHours[i].lastclockin = thisdate;
                await userAttandanceForToday.save();
                return res.status(200).json({ message: "You have already clocked in", time: userAttandanceForToday.workingHours[i].time })
            }
        }

        userAttandanceForToday.workingHours.push({ date: thisdate, time: { sec: 0, min: 0, hr: 0 } });
        await userAttandanceForToday.save();
        return res.status(200).json({ message: "You have successfully clocked in", time: { min: 0, hr: 0 , sec: 0, } })










    }


    catch (error) {
        console.log(error)

        return res.status(500).json({ message: "Internal server error" })

    }
}









const ClockOut = async (req, res) => {
    try {
        const thisdate = new Date();
        const userAttandanceForToday = await Attendance.findOne({ user: req.user._id });
        for (let i = 0; i < userAttandanceForToday.workingHours.length; i++) {
            if (userAttandanceForToday.workingHours[i].date.toString().slice(0, 10) === thisdate.toString().slice(0, 10)) {
                //update lastclockin
                const newtime = req.body.newdiff;
                

                userAttandanceForToday.workingHours[i].time = {
                    sec: newtime.sec,
                    min: newtime.min,
                    hr: newtime.hr,
                
                };
                await userAttandanceForToday.save();

                return res.status(200).json({ message: "You have already clocked out", time: userAttandanceForToday.workingHours[i].time })
            }
        }
    }

    catch (error) {
        console.log(error)

        return res.status(500).json({ message: "Internal server error" })

    }
}


const History = async (req, res) => {
    try {
        let userAttandance = await Attendance.findOne({ user: req.user._id });
        //i wanna take only the one where attendance.workinghours.date(the year and moneth ) be equal to request body month and year
       /* userAttandance.filter((attendance) => {
            if (attendance.workingHours.date.getMonth() === req.body.month && attendance.workingHours.date.getFullYear() === req.body.year){
                return attendance
            }
        })*/

        const workingHours = []
        for (let i = 0; i < userAttandance.workingHours.length; i++) {
          
                workingHours.push(userAttandance.workingHours[i])
        
        }
        console.log(workingHours[workingHours.length - 1])
       console.log(workingHours[workingHours.length - 1]?.date.toString().slice(0, 10) , new Date().toString()?.slice(0, 10))
   
        return res.status(200).json({ workingHours })
    }

    catch (error) {
        console.log(error)

        return res.status(500).json({ message: "Internal server error" })

    }
}






















module.exports = {
    ClockIn,
    ClockOut,
    History,
}