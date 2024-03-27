const Notifications = require('../models/notification');








const GetNotifications = async (req,res)=>{
    try{
        const notifications = await Notifications.find({company : req.user.company}).sort({createdAt : -1})
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




























module.exports = {
    GetNotifications,
    DeleteNotification,
}