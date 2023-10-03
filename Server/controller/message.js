const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const { userLogger } = require('../log/logger');
const { message } = require('../model/message');
const { user } = require('../model/user');

exports.PrivateMessage = async (io, socket, body) => {
    // console.log(body);
    try {
        // console.log(socket.handshake.query.token);
        const userData = socket.decoded
        console.log("UserData=============>>>>", userData);

        let msg = new message({
            sendBy: userData._id,
            message: body.data.message,
            receiveBy: body.data.receiveBy
        })

        const result = await msg.save();
        console.log("===========Result MSG============", result);
        // return socket.emit("res", result);
        const oneMsg = await user.findOne({ $or: [{ _id: userData._id }, { _id: body.data.receiveBy }] }).distinct("_id");
        console.log("=========Multiple Message======>>>>>", oneMsg);
        oneMsg.map(ele => {
            io.to(ele.toString()).emit('res', result)
        });
    } catch (error) {
        // console.log("=======Error====>>>>>>", error);
        return socket.emit("res", { message: "Please Try Again Later..." })
    }
}

exports.GetHistory = async (socket, body) => {
    try {
        // console.log(socket.handshake.query.token);
        // console.log(body);

        const userData = jwt.verify(socket.handshake.query.token, process.env.my_secret_key)
        console.log("*********UserData************", userData);

        const sendBy = userData._id
        const receiveBy = body.data.receiveBy

        const findMsg = await message.aggregate([
            {
                $match: {
                    $or: [
                        {
                            $and:
                                [{ receiveBy: { $eq: new mongoose.Types.ObjectId(userData._id) } }, { sendBy: { $eq: new mongoose.Types.ObjectId(receiveBy) } }]
                        },
                        {
                            $and:
                                [{ sendBy: { $eq: new mongoose.Types.ObjectId(userData._id) } }, { receiveBy: { $eq: new mongoose.Types.ObjectId(receiveBy) } }]
                        }]
                }
            },
            {
                $lookup: {
                    from: "users",
                    let: { sendBy: "$sendBy" },
                    pipeline: [
                        {
                            $match: { $expr: { $eq: ["$_id", "$$sendBy"] } }
                        },
                        { $project: { "_id": 0, "email": 0, "password": 0, "role": 0, "__v": 0 } },
                    ],
                    as: "SendBy"
                }
            },
            {
                $unwind: "$SendBy"
            },
            { $addFields: { SendBy: { $concat: ["$SendBy.firstname", " ", "$SendBy.lastname"] } } },
            {
                $lookup: {
                    from: "users",
                    let: { receiveBy: "$receiveBy" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$receiveBy"] } } },
                        { $project: { "_id": 0, "email": 0, "password": 0, "role": 0, "__v": 0 } },
                    ],
                    as: "ReceiveBy"
                }
            },
            {
                $unwind: "$ReceiveBy"
            },
            { $addFields: { ReceiveBy: { $concat: ["$ReceiveBy.firstname", " ", "$ReceiveBy.lastname"] } } },
            { $project: { "sendBy": 0, "receiveBy": 0, "_id": 0, "__v": 0 } },
            { $sort: { DateTime: -1 } },
            { $skip: (body.data.page - 1) * body.data.limit },
            { $limit: body.data.limit }
        ])
        // console.log("=========Find MSG=============", findMsg);
        return socket.emit("res", findMsg)
    } catch (error) {
        // console.log("=======Error====>>>>>>", error);
        return socket.emit("res", { message: "Please Try Again Later..." })
    }
}

exports.LatestMessage = async (socket, body) => {
    try {
        const findlatestmsg = await message.aggregate([
            { $match: { receiveBy: new mongoose.Types.ObjectId(body.data.receiveBy) } },
            {
                $group: {
                    _id: "$receiveBy",
                    message: { $last: "$message" },
                    sendBy: { $last: "$sendBy" },
                    LatestMessageTime: { $last: "$DateTime" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    let: { id: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$id"] } } }
                    ],
                    as: "ReceiveBy"
                }
            },
            {
                $unwind: "$ReceiveBy"
            },
            { $addFields: { Receiver: { $concat: ["$ReceiveBy.firstname", " ", "$ReceiveBy.lastname"] } } },
            {
                $lookup: {
                    from: "users",
                    let: { send: "$sendBy" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$send"] } } }
                    ],
                    as: "Sender"
                }
            },
            {
                $unwind: "$Sender"
            },
            { $addFields: { Sender: { $concat: ["$Sender.firstname", " ", "$Sender.lastname"] } } },
            { $project: { "_id": 0, "ReceiveBy": 0, "sendBy": 0 } }
        ])
        console.log("==========Find Latest Message=======>>>>>>>", findlatestmsg);
        return socket.emit("res", findlatestmsg)
    } catch (error) {
        // console.log("=======Error====>>>>>>", error);
        return socket.emit("res", { message: "Please Try Again Later..." })
    }
}
