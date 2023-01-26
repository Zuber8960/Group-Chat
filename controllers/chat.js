const Chat = require('../models/chat');


exports.sendMessage = async (req, res, next) => {
    try{
    console.log(req.body);
    const {message} = req.body;
    if(!message){
        return res.status(400).json( {success:false , message: 'Nothing entered !'} );
    }
    const data = await req.user.createChat({
        message: message
    })
    return res.status(200).json({success : true})
}catch(err){
    console.log(err);
    return res.status(404).json( {success:false , error :err} )
}

}