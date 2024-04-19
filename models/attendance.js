const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const clockInSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  workingHours: [{
    date: { type: Date, default:  Date.now() },
    lastclockin : { type: Date, default:  Date.now() },
    time: {
      sec: Number,
      min: Number,
      hr: Number,
      },
  }],
},
{
  timestamps: true
});

/*crete user if not exist*/
const Attendance = mongoose.model("attendance", clockInSchema);
module.exports = Attendance;