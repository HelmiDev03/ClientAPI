const mongoose = require('mongoose');


const Schema = mongoose.Schema;




const ProjectSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: 'companie' },
        name: { type: String, required: true, unique: true },
        startdate: { type: Date, required: true },
        enddate: { type: Date, required: true },
        createdAt: { type: Date, default: Date.now },
        budget: { type: Number, required: true },
        status: { type: String, required: true, default: "Active" },
        users: [
            {
                user: { type: Schema.Types.ObjectId, ref: 'user' },
                position: { type: String, },
            }
        ]
    },
    {
        timestamps: true,
        
    }

);
/*crete user if not exist*/

const Projects= mongoose.model("project", ProjectSchema);
module.exports =  Projects;