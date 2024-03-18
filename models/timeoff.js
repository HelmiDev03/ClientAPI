const mongoose = require('mongoose');


const Schema = mongoose.Schema;





const TimeOffSchema = new Schema({

    userId : { type: Schema.Types.ObjectId, ref: 'user' },
    type :  { type : String , required : true},
    description  :  { type : String , required : false},
    daterange : {type:Array , required : true},
    response : { type : String , required : false},
    supervisor : { type: Schema.Types.ObjectId, ref: 'user' },
     

},
  {
   
    timestamps: true,
  }

);
/*crete user if not exist*/

const TimeOffs = mongoose.model("timeoff", TimeOffSchema);
module.exports =  TimeOffs;