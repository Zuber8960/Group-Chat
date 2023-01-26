const User = require('../models/user');
const bcrypt = require('bcrypt');


exports.signup = async (req, res, next) => {
    // console.log(`body===>` , req.body);
    const {name, email, phonenumber, password} = req.body;
    if(name=="" || email=="" || phonenumber=="" || password==""){
        return res.status(201).json({success:false, message: 'Please fill all feilds'});
    }
    const alreadyUSer = await User.findOne( { where : { email: email } } );
    if(alreadyUSer){
        return res.status(201).json({success:false, message: `User: ${email} is already exist`});
    }
    const saltRounds = 10;
    bcrypt.hash(password,saltRounds, async(err, hash) => {
        try{
            const user = await User.create({
                name:name,
                email:email,
                phonenumber:phonenumber,
                password:hash
            })
            return res.status(200).json({ success : true, user });
        }catch(err){
            console.log(err);
            return res.status(400).json({ success : false, error: err });
        }
    })
}

exports.login = (req, res, next) => {
    const {email, password} = req.body;
    if(email=="" || password==""){
        return res.status(201).json({success:false, message: 'Please fill all feilds'});
    }
    return res.status(200).json({success:true});

}