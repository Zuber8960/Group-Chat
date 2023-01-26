const User = require('../models/user');

const jwt = require('jsonwebtoken');

exports.authentication = async (req, res, next) => {
    try{
        const token = req.header('Authorization');
        // console.log(`token ===> ${token}`);
        const data = jwt.verify(token , process.env.secretKey);
        // console.log(data);
        const user = await User.findOne( { where : {id: data.id}} );
        // console.log(user);
        req.user = user;
        next();
    }catch(err){
        console.log(err);
        res.status(404).json({success : false , error : err});
    }
}
