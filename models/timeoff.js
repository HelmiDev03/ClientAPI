const mongoose = require('mongoose');


const Schema = mongoose.Schema;





const TimeOffSchema = new Schema({

    userId : { type: Schema.Types.ObjectId, ref: 'user' },
    type :  { type : String , required : true},
    description  :  { type : String , required : false},
    daterange : {type:Array , required : true},
    file : { type : String , required : false},
    response : { type : String , required : false},
    etat : { type : String , required : false , default : "Pending"},
    supervisor : {type:Object , required : false},
    company : { type: Schema.Types.ObjectId, ref: 'companie' },
    

},
  {
   
    timestamps: true,
  }

);
/*crete user if not exist*/

const TimeOffs = mongoose.model("timeoff", TimeOffSchema);
module.exports =  TimeOffs;