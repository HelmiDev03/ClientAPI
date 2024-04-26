const mongoose = require('mongoose');


const Schema = mongoose.Schema;




const ArticleSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: 'companie' },
        title: { type: String, required: true },
        description : { type: String, required: true },
        image : { type: String, },
        author: { type: Schema.Types.ObjectId, ref: 'user' },

    },
    {
        timestamps: true,

    }

);
/*crete user if not exist*/

const Articles = mongoose.model("article", ArticleSchema);
module.exports = Articles;