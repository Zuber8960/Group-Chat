const Chat = require('../models/chat');
const User = require('../models/user');
const Group = require('../models/group');
const UserGroup = require('../models/usergroup');

exports.sendMessage = async (req, res, next) => {
    try {
        console.log(req.body);
        const { message } = req.body;
        const { groupId } = req.params;

        const isUserInGroup = await UserGroup.findOne({ where: { userId: req.user.id, groupId: groupId } });
        if (!isUserInGroup) {
            return res.status(400).json({ success: false, message: 'You are no longer in group now !' });
        }

        if (!message) {
            return res.status(400).json({ success: false, message: 'Nothing entered !' });
        }

        let result = await req.user.createChat({
            message: message,
            groupId: groupId
        })
        // const name = req.user.name;
        // data.dataValues.name = req.user.name;
        
        const data = { message: result.message, createdAt: result.createdAt };

        return res.status(200).json({ success: true, data});
    } catch (err) {
        console.log(err);
        return res.status(404).json({ success: false, error: err })
    }
}


exports.getMessage = async (req, res, next) => {

    let msgId = req.query.lastMessageId;
    let { groupId } = req.params;
    console.log(`groupid ==> ${groupId}`);

    let messages = await Chat.findAll({
        include: ['user'],
        where: { groupId: groupId }
    });

    const { email } = req.user;

    const msgs = [];
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].id > msgId) {
            msgs.push(messages[i]);
        }
    }

    console.log(`msgId`, msgId);
    console.log(`message's length ==> ${msgs.length}`);

    const data = msgs.map(chat => {
        let currentUser;
        if (chat.user.email === email) {
            currentUser = 'Same user';
        }
        return { message: chat.message, name: chat.user.name, createdAt: chat.createdAt, currentUser: currentUser, id: chat.id };
    })

    // console.log(messages);

    res.status(200).json({ success: true, messages: data });
}



exports.addUser = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { email } = req.body;



        if (!email) {
            return res.status(500).json({ success: false, message: `Bad request !` });
        }

        const checkUserIsAdmin = await UserGroup.findOne({ where: { userId: req.user.id, groupId: groupId } });
        if (!checkUserIsAdmin.isAdmin) {
            return res.status(500).json({ success: false, message: `Only admin can add users !` });
        }

        if (req.user.email == email) {
            return res.status(500).json({ success: false, message: `Admin is already in group !` });
        }

        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(500).json({ success: false, message: `User doesn't exist !` });
        }

        const alreadyInGroup = await UserGroup.findOne({ where: { userId: user.id, groupId: groupId } });

        if (alreadyInGroup) {
            return res.status(500).json({ success: false, message: `User already in group !` });
        }

        const data = await UserGroup.create({
            userId: user.id,
            groupId: groupId,
            isAdmin: false
        })

        // const group = await UserGroup.findOne({where : {groupId : groupId}});

        res.status(200).json({ success: true, message: 'User successfully added !', data });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: `Something went wrong !` });
    }

}




exports.getUsers = async (req, res, next) => {
    const { groupId } = req.params;

    try{
        const data = await UserGroup.findAll({ where: { groupId: groupId } });
        const users = data.map(element => {
            return { id: element.userId, isAdmin: element.isAdmin };
        });
        const userDetails = [];
        let adminEmail = [];
    
        for (let i = 0; i < users.length; i++) {
            const user = await User.findOne({ where: { id: users[i].id } });
            userDetails.push({ name: user.name, isAdmin: users[i].isAdmin, email: user.email });
            if (users[i].isAdmin) {
                adminEmail.push(user.email);
            }
        }
    
        res.status(200).json({ success: true, userDetails, adminEmail });
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: 'Something went wrong !'})
    }
}


exports.makeAdmin = async (req, res, next) => {
    console.log(req.body);
    const { email } = req.body;
    const { groupId } = req.params;

    if (!email) {
        return res.status(500).json({ success: false, message: 'bad request !' });
    }

    try {
        const checkUserIsAdmin = await UserGroup.findOne({ where: { groupId: groupId, userId: req.user.id } });
        if (checkUserIsAdmin.isAdmin == false) {
            return res.status(500).json({ success: false, message: `Only Admin have this permission !` });
        }

        const user = await User.findOne({ where: { email: email } });
        // console.log(user);
        const data = await UserGroup.update({
            isAdmin: true
        }, { where: { groupId: groupId, userId: user.id } });


        res.status(200).json({ success: true, message: `Now ${user.name} is also Admin !` });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, message: 'Something went wrong !' });
    }
}



exports.deleteUser = async (req, res, next) => {

    console.log(req.body, req.params);
    const { groupId } = req.params;
    const { email } = req.body;
    try {

        const checkUser = await UserGroup.findOne({ where: { groupId: groupId, userId: req.user.id } });
        if(!checkUser){
            return res.status(500).json({ success: false, message: `You are no longer in group !` });
        }

        //check whether user is admin or not.
        if (checkUser.isAdmin == false) {
            //if user try to delete ourself.

            if (req.user.email == email) {
                await checkUser.destroy();
                return res.status(200).json({ success: true, message: `User has been deleted from group !` });
            }

            return res.status(500).json({ success: false, message: `Only admin can delete members from groups !` });
        }

        const user = await User.findOne({ where: { email: email } });
        // console.log(user);
        const usergroup = await UserGroup.findOne({ where: { userId: user.id, groupId: groupId } });
        // console.log(usergroup);

        if (usergroup.isAdmin == false) {
            usergroup.destroy();
            return res.status(200).json({ success: true, message: `User ${user.name} is deleted successfully !` });
        } else if(req.user.email == email){
            return res.status(500).json({ success: false, message: `Admin have to remove admin himself before leaving group !` });
        }else{
            return res.status(500).json({ success: false, message: `first remove admin before deleting user: ${user.name} !` });
        }


    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: `Something went wrong !` });
    }

}


exports.removeAdmin = async (req, res, next) => {
    console.log(req.body, req.params);
    const { email } = req.body;
    const { groupId } = req.params;
    try {

        const checkUserIsAdmin = await UserGroup.findOne({ where: { groupId: groupId, userId: req.user.id } });
        if (checkUserIsAdmin.isAdmin == false) {
            return res.status(500).json({ success: false, message: `Only Admin have this permission !` });
        }

        const user = await User.findOne({ where: { email: email } });
        const allAdmins = await UserGroup.findAll({ where: { groupId: groupId, isAdmin: true } });

        if (allAdmins.length == 1) {
            return res.status(500).json({ success: false, message: `make another user as an Admin !` })
        }

        const data = await UserGroup.update({
            isAdmin: false
        }, { where: { userId: user.id, groupId: groupId } });

        res.status(200).json({ success: true, message: `User ${user.name} is no longer admin now !` });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: `Something went wrong !` });
    }

}