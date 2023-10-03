const { PrivateMessage, GetHistory, LatestMessage } = require('../controller/message');
const { CreateGroup, GroupDetails, AddGroupMember, RemoveGroupMember } = require('../controller/creategroup');
const { GroupMessage, GroupChatHistory, LatestMessageGroup } = require('../controller/groupchat');

exports.handler = async (io, socket, body) => {
    // console.log("**********", body.event);
    switch (body.event) {
        case "PrivateMessage":
            PrivateMessage(io, socket, body)
            break;
        case "GetHistory":
            GetHistory(socket, body)
            break;
        case "LatestMessage":
            LatestMessage(socket, body)
            break;
        case "CreateGroup":
            CreateGroup(socket, body)
            break;
        case "GroupDetails":
            GroupDetails(socket, body)
            break;
        case "AddGroupMember":
            AddGroupMember(io, socket, body)
            break;
        case "RemoveGroupMember":
            RemoveGroupMember(io, socket, body)
            break;
        case "GroupMessage":
            GroupMessage(io, socket, body)
            break;
        case "GroupChatHistory":
            GroupChatHistory(socket, body)
            break;
        case "LatestMessageGroup":
            LatestMessageGroup(socket, body)
            break;
    }
}