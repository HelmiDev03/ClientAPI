const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const crypto = require('crypto');





const UserSchema = new Schema({
  isVerified: { type: Boolean, default: false },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true },
  cin : { type: String, required: true , unique: true},
  role: { type: String, required: true, default: 'employee'},

  password: { type: String, required: false },
  username : { type: String, required: false , unique: true},
  phonenumber: { type: String, required: false , unique: true},
  profilepicture: { type: String, required: false },
  dateofbirth: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now },
  matricule : { type: String, required: false , unique: true , default :crypto.randomBytes(12).toString('hex')},
  gender: { type: String, required: false },
  maritalstatus : { type: String, required: false , default: 'single'},

  address: { type: String, required: false },
  city: { type: String, required: false },
  country: { type: String, default: 'tunisia'},
  postalcode: { type: String, required: false },

  googleid: { type: String, required: false ,unique: true},
  secret: { type: String, required: false , unique: true},



  company : { type: Schema.Types.ObjectId, ref: 'companie' },

},
  {
    timestamps: true,
  }

);
/*crete user if not exist*/

const Users = mongoose.model("user", UserSchema);
module.exports = Users;