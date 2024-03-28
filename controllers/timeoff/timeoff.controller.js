
const  TimeOffs = require('../../models/timeoff')
const Users = require('../../models/user')
const  Notifications = require('../../models/notification')




const AddNewTimeOff = async (req,res)=>{
   

    try{
        console.log(req.body)
    const errors={}
    let {type , description , daterange}  = req.body
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

     
    if(!type){
        errors.type = "Type is required"
    }
    if (Date.now() > new Date(daterange[0])){
        errors.daterange = "Date range is invalid"
    }
    if (!description){
        errors.description = "Description is required"
    }
    if (Object.keys(errors).length > 0){
        return res.status(400).json(errors)
    }
   
    const timeoff = await TimeOffs.create({
        type,
        description,
        daterange,
        userId: req.user.id
    })

const user = await Users.findById(req.user.id)
user.password = undefined
    await Notifications.create({
        company : req.user.company,
        content:{
            reason : "Time off request",
            timeoffid : timeoff._id,
            user : user,
            type: type,
            startdate : daterange[0],
            enddate : daterange[1],
            requestedat : Date.now(),
        }
        // Add other necessary fields
    });

    // Emit an event to notify clients about the new notification
  
    
    return res.status(200).json({message : "Time off request created successfully"})


    }

    catch(error){
        console.log(error)
        return res.status(500).json({error})
    }


}



const UpdateTimeOff = async (req,res)=>{
    try{
        console.log(req.body)
        await TimeOffs.findByIdAndUpdate(req.params.id , {etat : req.body.etat , response : req.body.response,supervisor:{firstname:req.user.firstname,lastname:req.user.lastname,profilepicture:req.user.profilepicture}})
        return res.status(200).json({message : "Time off updated successfully"})
    }

    catch(error){
        return res.status(500).json({error})
    }
}



















const GetUserTimeOffs = async (req,res)=>{
    try{
        const timeoffs = await TimeOffs.find({userId : req.user.id}).populate('supervisor' , 'firstname lastname profilepicture ')
        return res.status(200).json({timeoffs})
    }
    catch(error){
        return res.status(500).json({error})
    }
}






















module.exports = {
    AddNewTimeOff,
    UpdateTimeOff,
    GetUserTimeOffs,
}