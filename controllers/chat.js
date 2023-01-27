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

    let messages = await Chat.findAll({include : ['user']});
    const {email} = req.user;

    const data = messages.map(chat => {
        let currentUser;
        if(chat.user.email === email){
            currentUser = 'Same user';
        }
        return {message: chat.message, name: chat.user.name, createdAt: chat.createdAt , currentUser : currentUser};
    })
    // console.log(messages);
    
    res.status(200).json({success: true, messages: data});
}