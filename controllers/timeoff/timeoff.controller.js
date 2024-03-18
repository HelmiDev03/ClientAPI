
const  TimeOffs = require('../../models/timeoff')
const Users = require('../../models/user')



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
    await TimeOffs.create({
        type,
        description,
        daterange,
        userId: req.user.id
    })
    return res.status(200).json({message : "Time off request created successfully"})


    }

    catch(error){
        return res.status(500).json({error})
    }


}






















module.exports = {
    AddNewTimeOff
}