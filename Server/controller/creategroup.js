const jwt = require('jsonwebtoken');
const { user } = require('../model/user');
const { createGroup } = require('../model/group');
const { default: mongoose } = require('mongoose');

exports.CreateGroup = async (socket, body) => {
    try {
        // console.log(socket.decoded._id);
        // console.log(body.data.GroupName);
        const finduser = await user.findOne({ _id: socket.decoded._id })
        // console.log("======FindUser==>>>>>>", finduser);

        if (!finduser) return socket.emit("res", { message: "User Does Not Exists..." })

        let group = new createGroup({
            Admin: finduser._id,
            GroupName: body.data.GroupName
        })

        const result = await group.save()
        console.log(result.GroupMember);
        return socket.emit("res", result)
    } catch (error) {
        // console.log(error);
        return socket.emit("res", { message: "Please Try Again Later..." })
    }
}

exports.AddGroupMember = async (io, socket, body) => {
    try {
        const findGroup = await createGroup.findOne({ _id: body.data._id })
        console.log("======FindGroup======>>>>>>", findGroup);

        if (!findGroup) return socket.emit("res", { message: "Enter Group Does Not Exists...." })

        const TotalMember = findGroup.GroupMember
        TotalMember.push(findGroup.Admin)
        console.log("TotalMember=====>>>", TotalMember);

        const GroupMember = body.data.GroupMember
        console.log("GroupMember=========>>>>>>", GroupMember);

        const CheckMember = GroupMember.filter(i => TotalMember.includes(i));
        console.log("CheckMember=====?>>>>>", CheckMember);

        const User = await user.find({ _id: CheckMember })
        console.log("User=====>>>>", User);

        if (!CheckMember == GroupMember) {
            const AddMember = await createGroup.updateOne(
                { _id: findGroup._id },
                { $addToSet: { GroupMember: GroupMember } },
                { new: true })
            console.log("************Add Member========>>>>>", AddMember);
            // GroupMember.map(ele => {
            //     io.to(ele.toString()).emit('res', { Message: `` })
            // })    

        } else {
            return socket.emit('res', { message: "User Are Allready Group Member.." })
        }

    } catch (error) {
        console.log(error);
        return socket.emit("res", { message: "Please Try Again Later..." })
    }
}

exports.RemoveGroupMember = async (io, socket, body) => {
    try {
        const findGroup = await createGroup.findOne({ _id: body.data._id })
        // console.log("===========Find Group========>>>>>", findGroup);

        if (!findGroup) return socket.emit("res", { message: "Group ID Not Found..." })

        let TotalMember = findGroup.GroupMember
        TotalMember.push(findGroup.Admin)

        await createGroup.findOneAndUpdate({ _id: findGroup._id }, { $pull: { GroupMember: { $in: [socket.decoded._id] } } }, { new: true })
        const User = await user.findOne({ _id: socket.decoded._id })
        // console.log("===========User Group Member==========>>>>>>>", User);

        TotalMember.map(ele => {
            io.to(ele.toString()).emit('res', { Message: `${User.firstname} ${User.lastname} Leave ${findGroup.GroupName} Group.` })
        })
    } catch (error) {
        console.log(error);
        return socket.emit("res", { message: "Please Try Again Later..." })
    }
}

exports.GroupDetails = async (socket, body) => {
    try {
        const findGroup = await createGroup.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(body.data._id) } },
            {
                $lookup: {
                    from: 'users',
                    let: { admin: "$Admin" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$admin"] } } }
                    ],
                    as: 'Admin'
                }
            },
            {
                $unwind: "$Admin"
            },
            { $addFields: { Adminname: { $concat: ["$Admin.firstname", " ", "$Admin.lastname"] } } },
            {
                $unwind: "$GroupMember"
            },
            {
                $lookup: {
                    from: "users",
                    let: { member: "$GroupMember" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$member"] } } }
                    ],
                    as: "GroupMember"
                }
            },
            {
                $unwind: "$GroupMember"
            },
            { $addFields: { GroupMember: { $concat: ["$GroupMember.firstname", " ", "$GroupMember.lastname"] } } },
            {
                $group: {
                    _id: "$_id",
                    GroupName: { $first: "$GroupName" },
                    Adminname: { $first: "$Adminname" },
                    GroupMember: { $push: "$GroupMember" }
                }
            },
            { $project: { "Admin": 0, "__v": 0, "_id": 0 } }
        ])
        console.log("==========Find Group==========>>>>>>>", findGroup);
        return socket.emit("res", findGroup)
    } catch (error) {
        console.log(error);
        return socket.emit("res", { message: "Please Try Again Later..." })
    }
}