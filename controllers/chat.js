const Chat = require('../models/chat');
const User = require('../models/user');
const Group = require('../models/group');

exports.sendMessage = async (req, res, next) => {
    try {
        console.log(req.body);
        const { message } = req.body;
        const {groupId} = req.params;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Nothing entered !' });
        }
        let data = await req.user.createChat({
            message: message,
            groupId: groupId
        })
        // const name = req.user.name;
        data.dataValues.name = req.user.name ;
        
        return res.status(200).json({ success: true , data: data});
    } catch (err) {
        console.log(err);
        return res.status(404).json({ success: false, error: err })
    }
}

exports.getMessage = async(req, res, next) => {

    let msgId = req.query.lastMessageId;
    let {groupId} = req.params;
    console.log(`groupid ==> ${groupId}`);
    
    let messages = await Chat.findAll({ 
        include : ['user'],
        where: {groupId : groupId}
     });
    
    const {email} = req.user;

    const msgs = [];
    for(let i=0; i<messages.length; i++){
        if(messages[i].id>msgId){
            msgs.push(messages[i]);
        }
    }

    console.log(`msgId`, msgId);
    console.log(`message's length ==> ${msgs.length}`);

    const data = msgs.map(chat => {
        let currentUser;
        if(chat.user.email === email){
            currentUser = 'Same user';
        }
        return {message: chat.message, name: chat.user.name, createdAt: chat.createdAt , currentUser : currentUser , id: chat.id};
    })

    // console.log(messages);
    
    res.status(200).json({success: true, messages: data});
}