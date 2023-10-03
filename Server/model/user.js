const Joi = require('joi');
const mongoose = require('mongoose');

const user = mongoose.model('user', new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Consumer', 'Support'],
        default: 'Consumer'
    },
    Status: {
        type: String,
        enum: ["Online", "Offline"],
        default: "Offline"
    }
}));

function validateUser(user) {
    const Schema = {
        firstname: Joi.string().min(3).max(30).required(),
        lastname: Joi.string().min(3).max(30).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required(),
        password: Joi.string().pattern("/^[a-zA-Z0-9]{3,30}$/").required(),
        role: Joi.string().enum("Consumer", "Support").default("Consumer").require(),
        Status: Joi.string().enum("Online", "Offline").default("Offline").require()
    }
    return Schema.validate(user)
}

module.exports.user = user
module.exports.validate = validateUser
