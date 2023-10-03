const express = require('express');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const { user } = require('./model/user');
const app = express();
require('dotenv').config()
require('./db/conn');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { handler } = require('./handler/reqhandler');
const port = process.env.PORT

const users = require('./router/userroute');
app.use(express.json());
app.use('/', users);
app.get('/', (req, res) => {
    res.status(200).send("Chat Are Working...")
});

io.use(function (socket, next) {
    // console.log("====", socket.handshake.query.token);
    if (socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, process.env.my_secret_key, function (err, decoded) {
            if (err) return next(new Error('Authentication error'));
            socket.decoded = decoded;
            // console.log("++++++++", socket.decoded);
            next();
        });
    }
    else {
        next(new Error('Authentication error'));
    }
})

io.on('connection', async (socket) => {
    // if (socket.decoded._id) {
    //     let Status = socket.decoded;
    //     online = Status.online
    //     console.log("=======Online=======", online);
    // }
    await user.updateOne({ _id: socket.decoded._id }, {
        $set: { Status: "Online" }
    }, { new: true })

    socket.join(socket.decoded._id)
    // console.log(socket.decoded._id);

    socket.on("req", (body) => {
        handler(io, socket, body)
    })
    console.log('Socket Connected:' + socket.id);

    socket.on('disconnect', async () => {
        // console.log("==================", socket.decoded._id);
        // if (socket.decoded._id) {
        //     let Status = socket.decoded;
        //     offline = Status.offline;
        //     offline = new Date();
        //     console.log("=======Offline=======", offline);
        // }
        await user.updateOne({ _id: socket.decoded._id }, {
            $set: { Status: "Offline" }
        }, { new: true })

        console.log('Socket Disconnected:' + socket.id);
    });
})

server.listen(port, () => {
    console.log(`You Are Now Listing On Port ${port}`);
});