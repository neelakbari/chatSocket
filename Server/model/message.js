const mongoose = require('mongoose');

const message = mongoose.model("message", new mongoose.Schema({
    sendBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    message: {
        type: String
    },
    receiveBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    DateTime: {
        type: Date,
        default: Date.now()
    }

}))

module.exports.message = message;