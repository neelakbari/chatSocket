const mongoose = require('mongoose');

const GroupChat = mongoose.model('GroupChat', new mongoose.Schema({
    GroupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'createGroup',
        required: true
    },
    Message: {
        type: String,
        required: true
    },
    SendBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    DateTime: {
        type: Date,
        default: Date.now()
    }
}))

module.exports.GroupChat = GroupChat