const jwt = require('jsonwebtoken');
const { user } = require('../model/user');
const { createGroup } = require('../model/group');
const { GroupChat } = require('../model/groupchat');
const { pipeline } = require('nodemailer/lib/xoauth2');
const { default: mongoose } = require('mongoose');

exports.GroupMessage = async (io, socket, body) => {
    try {
        const UserId = socket.decoded._id
        // console.log("========User ID=====>>>>>", UserId);

        const findGroup = await createGroup.findOne({ _id: body.data.GroupId })
        // console.log("============Find Group========>>>", findGroup);

        if (!findGroup) return socket.emit("res", { message: "Enter Group Does Not Exists...." })


        let GroupMember = findGroup.GroupMember
        GroupMember.push(findGroup.Admin)

        let checkGroupMember;
        checkGroupMember = GroupMember.includes(UserId)
        // console.log(checkGroupMember);

        if (checkGroupMember == true) {
            let groupchat = new GroupChat({
                GroupId: body.data.GroupId,
                Message: body.data.Message,
                SendBy: UserId
            })

            const result = await groupchat.save();
            // console.log("============Result=========>>>>>", result);
            GroupMember.map(ele => {
                io.to(ele.toString()).emit('res', result)
            })
        } else {
            return socket.emit('res', { message: "You Are Not Group Member Or Admin.." })
        }
    } catch (error) {
        // console.log("=======Error====>>>>>>", error);
        return socket.emit("res", { message: "Please Try Again Later...." })
    }
}

exports.GroupChatHistory = async (socket, body) => {
    try {
        console.log(body);
        const findGroupChat = await GroupChat.aggregate([
            { $match: { GroupId: new mongoose.Types.ObjectId(body.data.GroupId) } },
            {
                $lookup: {
                    from: "creategroups",
                    let: { groupId: "$GroupId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$groupId"] } } }

                    ],
                    as: "GroupName"
                }
            },
            {
                $unwind: "$GroupName"
            },
            { $addFields: { GroupName: { $concat: ["$GroupName.GroupName"] } } },
            {
                $project: { "GroupId": 0, "GroupName._id": 0, "GroupName.Admin": 0, "GroupName.GroupMember": 0, "GroupName.__v": 0 }
            },
            {
                $lookup: {
                    from: "users",
                    let: { sendby: "$SendBy" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$sendby"] } } }
                    ],
                    as: "SendBy"
                }
            },
            {
                $unwind: "$SendBy"
            },
            { $addFields: { SendBy: { $concat: ["$SendBy.firstname", " ", "$SendBy.lastname"] } } },
            { $project: { "_id": 0, "email": 0, "password": 0, "role": 0, "__v": 0 } },
            { $sort: { DateTime: -1 } },
            { $skip: (body.data.page - 1) * body.data.limit },
            { $limit: body.data.limit }
        ])
        console.log(findGroupChat);
        return socket.emit("res", findGroupChat)
    } catch (error) {
        console.log("=======Error====>>>>>>", error);
        return socket.emit("res", { message: "Please Try Again Later...." })

    }
}

exports.LatestMessageGroup = async (socket, body) => {
    try {
        const findlatestmsg = await GroupChat.aggregate([
            { $match: { GroupId: new mongoose.Types.ObjectId(body.data.GroupId) } },
            {
                $group: {
                    _id: "$GroupId",
                    Message: { $last: "$Message" },
                    SendBy: { $last: "$SendBy" },
                    LatestMessageTime: { $last: "$DateTime" }
                }
            },
            {
                $lookup: {
                    from: "creategroups",
                    let: { id: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$id"] } } },

                    ],
                    as: "GroupName"
                }
            },
            {
                $unwind: "$GroupName"
            },
            { $project: { "_id": 0, "GroupName._id": 0, "GroupName.Admin": 0, "GroupName.GroupMember": 0, "GroupName.__v": 0 } },
            { $addFields: { GroupName: { $concat: ["$GroupName.GroupName"] } } },
            {
                $lookup: {
                    from: "users",
                    let: { sendBy: "$SendBy" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$sendBy"] } } }
                    ],
                    as: "SendBy"
                }
            },
            {
                $unwind: "$SendBy"
            },
            { $addFields: { Username: { $concat: ["$SendBy.firstname", " ", "$SendBy.lastname"] } } },
            { $project: { "SendBy": 0 } }
        ])
        // console.log("==========Find Latest Group Message=========>>>>", findlatestmsg);
        return socket.emit('res', findlatestmsg)
    } catch (error) {
        // console.log("=======Error====>>>>>>", error);
        return socket.emit("res", { message: "Please Try Again Later...." })
    }
}