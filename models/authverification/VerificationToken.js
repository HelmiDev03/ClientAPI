const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const VerificationTokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now , expires: 3600},
    
    });

const VerificationToken = mongoose.model('VerificationToken', VerificationTokenSchema);
module.exports = VerificationToken;