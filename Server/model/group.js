const mongoose = require('mongoose')

const createGroup = mongoose.model('createGroup', new mongoose.Schema({
    Admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    GroupName: {
        type: String,
        required: true
    },
    GroupMember: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: []
    }]
}))

module.exports.createGroup = createGroup