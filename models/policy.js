const mongoose = require('mongoose');


const Schema = mongoose.Schema;





const PolicySchema = new Schema({
    name: { type: String, required: true },
    description : { type: String, required: false},
    isdefault : { type: Boolean, default : false},
    absences : { type: Array, default : ["Holidays" , "Sick leave" ,"Compassionate leave","Parental leave"]},
    
    startMonth : { type: String, default : "January"},
    duration : { type: String, default : "12 months"},
    workingDays : { type: Number, default : 22},
    TimeOffDaysPerWorkingDays : { type: Number, default : 2},
    MaxTimeOffDays : { type: Number, default : 7},
    nationaldays : { type: Boolean, default : true},
    timeofflastforever : { type: Boolean, default : true},
    includerest: { type: Boolean, required: false, default: false },
    maxcounter : { type: Number, default : 0},
    company : { type: Schema.Types.ObjectId, ref: 'companie' },
    

},
  {
   
    timestamps: true,
  }

);
/*crete user if not exist*/

const Policies = mongoose.model("policy", PolicySchema);
module.exports =  Policies;