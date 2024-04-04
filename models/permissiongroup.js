const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PermissionGroupSchema = new Schema({

    company: { type: Schema.Types.ObjectId, ref: 'companie' },
    name : { type: String, required:  false },
    isadministrators : { type: Boolean, required:  false , default:  false},
    isdefault : { type: Boolean, required:  false , default:  false},
    iscustom : { type: Boolean, required:  false , default: true},

    //employees page
    viewallemployees: { type: Boolean, required:  false , default:  true},
    viewemployeedetails : { type: Boolean, required:  false , default:   false},
    deleteemployee : { type: Boolean, required:  false , default:   false},
    addnewemployee : { type: Boolean, required:  false , default:   false},
    //end employees page
    
    //employee page
    editemployeedetails : { type: Boolean, required:  false , default:   false},
    //end employee page
   
    
   

    //company details page
    viewcompanydetails : { type: Boolean, required:  false , default:  true},
    editcompanyinfo : { type: Boolean, required:  false , default:   false},
    //end company details page


    canbemanager : { type: Boolean, required:  false , default:   false},

    //policies page
    viewtimeoffpiliciespage : { type: Boolean, required:  false , default:  true},
    viewtimeoffpolicydetails : { type: Boolean, required:  false , default:  false},
    addnewtimeoffpolicy : { type: Boolean, required:  false , default:   false},
    removepolicy : { type: Boolean, required:  false , default:   false},
    setpolicyasdefault : { type: Boolean, required:  false , default:   false},
    addnationalday : { type: Boolean, required:  false , default:   false},
    deletenationaldays : { type: Boolean, required:  false , default:   false},
    //end policies page
    //policy page
    editpolicyconfig : { type: Boolean, required:  false , default:   false},
    addnewemployeetoapolicy : { type: Boolean, required:  false , default:   false},
    changeemployeepolicy : { type: Boolean, required:  false , default:   false},
    //end policy page
    
   
  
  
},
{
  timestamps:  false
});

/*crete user if not exist*/
const PermissionsGroup = mongoose.model("permissiongroup", PermissionGroupSchema);
module.exports = PermissionsGroup;