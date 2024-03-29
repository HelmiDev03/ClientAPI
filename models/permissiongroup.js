const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PermissionGroupSchema = new Schema({

    company: { type: Schema.Types.ObjectId, ref: 'companie' },
    name : { type: String, required: false },
    isadministrators : { type: Boolean, required: false , default: false},
    isdefault : { type: Boolean, required: false , default: false},
    iscustom : { type: Boolean, required: false , default: true},
    viewallemployees: { type: Boolean, required: false , default: true},
    viewemployeedetails : { type: Boolean, required: false , default: false},
    editemployeedetails : { type: Boolean, required: false , default: false},
    deleteemployee : { type: Boolean, required: false , default: false},
    addnewemployee : { type: Boolean, required: false , default: false},
    editcompanyinfo : { type: Boolean, required: false , default: false},
    edittimeoffpolicy : { type: Boolean, required: false , default: false},
    addnewtimeoffpolicy : { type: Boolean, required: false , default: false},
    addnationalday : { type: Boolean, required: false , default: false},
    deletenationaldays : { type: Boolean, required: false , default: false},
    editpermissions : { type: Boolean, required: false , default: false},
    addnewpermissiongroup : { type: Boolean, required: false , default: false},
  
  
},
{
  timestamps: false
});

/*crete user if not exist*/
const PermissionsGroup = mongoose.model("permissiongroup", PermissionGroupSchema);
module.exports = PermissionsGroup;