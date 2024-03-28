const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  logo: { type: String, required: false },
  name: { type: String, required: true },
  domaine: { type: String, required: true },
  phonenumber: { type: String, required: true },
  anniversaire: { type: Date, required: false },
  adress: { type: String, required: false },
  city: { type: String, required: false },
  zip: { type: String, required: false },
  country: { type: String, required: false },
  package: { type: String, required: false },
  nationaldays: { type: Array, required: false },
  workingdays: {
    type: Array,
    required: false,
    default: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
    ]
  },
  
},
{
  timestamps: true
});

/*crete user if not exist*/
const Companies = mongoose.model("companie", CompanySchema);
module.exports = Companies;