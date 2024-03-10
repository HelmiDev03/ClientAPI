const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const TfaTokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 300 },
    expiredAt: { type: Date, required: true, default: () => new Date(Date.now() + 300 * 1000) } // Set default value to current time + 300 seconds
   
    
    
    },
   
    );
    TfaTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });
const TfaToken = mongoose.model('TfaToken', TfaTokenSchema );
module.exports = TfaToken;