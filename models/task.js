const mongoose = require('mongoose');


const Schema = mongoose.Schema;




const TasksSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: 'companie' },
        name: { type: String, required: true, unique: true },
        createdAt: { type: Date, default: Date.now },
        deadline: { type: Date, required: true },
        file: { type: String },
        project : { type: Schema.Types.ObjectId, ref: 'project' },
        author: { type: Schema.Types.ObjectId, ref: 'user' },
        status: { type: String, required: true, default: "Active" },
        completedat : { type: Date },
        users: [{ type: Schema.Types.ObjectId, ref: 'user' }]
    },
    {
        timestamps: true,

    }

);
/*crete user if not exist*/

const Tasks = mongoose.model("task", TasksSchema);
module.exports = Tasks;