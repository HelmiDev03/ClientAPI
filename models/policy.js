const mongoose = require('mongoose');


const Schema = mongoose.Schema;





const PolicySchema = new Schema({
    name: { type: String, required: true },
    description : { type: String, required: false},
    isdefault : { type: Boolean, default : false},
    absences : { type: Array,  },
    
    startMonth : { type: String,  },
    duration : { type: String,  },
    workingDays : { type: Number,  },
    TimeOffDaysPerWorkingDays : { type: Number,  },
    MaxTimeOffDays : { type: Number,  },
    nationaldays : { type: Boolean, default : true},
    timeofflastforever : { type: Boolean, default : true},
    company : { type: Schema.Types.ObjectId, ref: 'companie' },
    

},
  {
   
    timestamps: true,
  }

);
/*crete user if not exist*/

const Policies = mongoose.model("policy", PolicySchema);
module.exports =  Policies;