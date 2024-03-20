const mongoose = require('mongoose');


const Schema = mongoose.Schema;





const   NotificationSchema = new Schema({

    createdAt: { type: Date, default: Date.now },
    content: {type : Array , required : true},
     

},
  {
   
    timestamps: true,
  }

);
/*crete user if not exist*/

const Notifications= mongoose.model("notification", NotificationSchema);
module.exports =  Notifications;