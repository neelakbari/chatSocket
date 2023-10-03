const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/Chat-Socket-Redis")
    .then(() => console.log("MongoDB Connected SuccessFully.."))
    .catch((error) => console.log("MongoDB Connection Failed..", error))

module.exports.mongoose = mongoose.connect