const mongoose = require('mongoose');


const Schema = mongoose.Schema;





const   NotificationSchema = new Schema({
  
    company : { type: Schema.Types.ObjectId, ref: 'companie' },
    createdAt: { type: Date, default: Date.now },
    content: {type : Object , required : true},
  
     

},
  {
   
    timestamps: true,
  }

);
/*crete user if not exist*/

const Notifications= mongoose.model("notification", NotificationSchema);
module.exports =  Notifications;