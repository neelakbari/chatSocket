const jwt = require('jsonwebtoken');
const { userLogger } = require('../log/logger');

exports.auth = async (req, res, next) => {
    try {
        const token = req.header('token');
        const user = jwt.verify(token, process.env.my_secret_key);
        // console.log("*********User**********", user);
        req.user = user
        next();
    } catch (error) {
        res.status(401).json({ message: 'Auth failed!' });
        userLogger.error("Error Auth:", error)
    }
}