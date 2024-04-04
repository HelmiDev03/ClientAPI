const mongoose = require('mongoose');


const Schema = mongoose.Schema;





const   NotificationSchema = new Schema({
    userId : { type: Schema.Types.ObjectId, ref: 'user' },
    company : { type: Schema.Types.ObjectId, ref: 'companie' },
    createdAt: { type: Date, default: Date.now },
    content: {type : Object , required : true},
    seen : {type : Boolean , default : false},
  
     

},
  {
   
    timestamps: true,
  }

);
/*crete user if not exist*/

const Notifications= mongoose.model("notification", NotificationSchema);
module.exports =  Notifications;