const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const crypto = require('crypto');





const UserSchema = new Schema({
  isVerified: { type: Boolean, default: false },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true },
  cin : { type: String, required: true , unique: true},
  role: { type: String, required: true, default: 'employee'},//pour le momoen
  //permisiion taw baed

  password: { type: String, required: false },
  phonenumber: { type: String, required: false, sparse: true ,default:""},

  profilepicture: { type: String, required: false },
  dateofbirth: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now },
  matricule : { type: String, required: false , unique: true , default :crypto.randomBytes(12).toString('hex')},
  gender: { type: String, required: false },
  maritalstatus : { type: String, required: false , default: 'single'},

  adress: { type: String, required: false },
  city: { type: String, required: false },
  country: { type: String, default: 'tunisia'},
  postalcode: { type: String, required: false },


  //tfa
  tfa: { type: Boolean, required: false , default: false},

  //needed for time off
  accruedDays: { type: Number, required: false , default: 0},
  availableDays: { type: Number, required: false , default: 0},
  usedDays: { type: Number, required: false , default: 0},


  //hedhom lezem kinged fazt google
  googleid: { type: String, required: false ,unique: true},
  secret: { type: String, required: false , unique: true},



  company : { type: Schema.Types.ObjectId, ref: 'companie' },
  policy : { type: Schema.Types.ObjectId, ref: 'policy' },

},
  {
    timestamps: true,
  }

);
/*crete user if not exist*/

const Users = mongoose.model("user", UserSchema);
module.exports = Users;