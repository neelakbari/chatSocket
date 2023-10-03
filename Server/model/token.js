const mongoose = require('mongoose');

const token = mongoose.model('token', new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    Token: {
        type: String,
        // required: true
    },
    resetTokenExpireTime: {
        type: Date,
        default: Date.now()
    }
}))

module.exports.token = token