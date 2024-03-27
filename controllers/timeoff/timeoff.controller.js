
const  TimeOffs = require('../../models/timeoff')
const Users = require('../../models/user')
const  Notifications = require('../../models/notification')

const { io}  = require('../../server');


const AddNewTimeOff = async (req,res)=>{
   

    try{
        console.log(req.body)
    const errors={}
    const {type , description , daterange}  = req.body
    if(!type){
        errors.type = "Type is required"
    }
    if (Date.now() > daterange[0]){
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