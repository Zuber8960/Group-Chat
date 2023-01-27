const Chat = require('../models/chat');
const User = require('../models/user');

exports.sendMessage = async (req, res, next) => {
    try {
        console.log(req.body);
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ success: false, message: 'Nothing entered !' });
        }
        let data = await req.user.createChat({
            message: message
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

    
    let messages = await Chat.findAll({include : ['user']});
    
    const {email} = req.user;
    let index = 0;
    if(msgId){
        console.log(`msgId ==>` , msgId);
        messages.forEach(chat => {
            if(chat.id == msgId){
                index = msgId;
            }
        });
    }

    messages = messages.slice(index);
    console.log('length=====>', messages.length);

    const data = messages.map(chat => {
        let currentUser;
        if(chat.user.email === email){
            currentUser = 'Same user';
        }
        return {message: chat.message, name: chat.user.name, createdAt: chat.createdAt , currentUser : currentUser , id: chat.id};
    })
    // console.log(messages);
    
    res.status(200).json({success: true, messages: data});
}