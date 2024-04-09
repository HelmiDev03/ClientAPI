const Notifications = require('../models/notification');
const PermissionGroup = require('../models/permissiongroup');







const GetNotifications = async (req,res)=>{
    try{
        const notifications = await Notifications.find({company : req.user.company ,userId : req.user._id}).sort({createdAt : -1})
        return res.status(200).json({notifications})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({error})
    }
}


const DeleteNotification = async (req,res)=>{
    try{
        
        const notif = await Notifications.findByIdAndDelete(req.params.id)
        return  res.status(200).json({msg : 'deleted notif'})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({error})
    }
}

const GetUnseenNotifications = async (req,res)=>{
    try{
        const notifications = await Notifications.find({company : req.user.company ,userId : req.user._id , seen : false})
        const number = notifications.length
        return res.status(200).json({unssennotifications:number})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({error})
    }
}


const MarkAsSeen = async (req,res)=>{
    try{
        await Notifications.updateMany({company : req.user.company ,userId : req.user._id , seen : false} , {seen : true})
        return res.status(200).json({msg : 'marked as seen'})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({error})
    }
}


























module.exports = {
    GetNotifications,
    DeleteNotification,
    GetUnseenNotifications,
    MarkAsSeen
}