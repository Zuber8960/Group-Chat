const User = require('../models/user');
const bcrypt = require('bcrypt');


exports.signup = async (req, res, next) => {
    // console.log(`body===>` , req.body);
    try{
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
    }catch(err){
        console.log(err);
        return res.status(500).json({ success : false, message: `Something went wrong !` });
    }
    
}

const jwt = require('jsonwebtoken');

function generateToken(id , name){
    return jwt.sign( {id: id, name: name} , process.env.secretKey);
}


exports.login = async (req, res, next) => {
    const {email, password} = req.body;
    if(email=="" || password==""){
        return res.status(201).json({success:false, message: 'Please fill all feilds'});
    }

    const user = await User.findOne( { where : { email: email } } );
    if(!user){
        return res.status(404).json({success:false, message: `User : ${email} doesn't exist !`});
    }

    bcrypt.compare(password, user.password , (err, response) => {
        if(err){
            console.log(err);
        }
        if(response === true){
            const token = generateToken(user.id,user.name);
            // console.log(`token ==> ${token}`);
            return res.status(200).json({success:true, token: token , username: user.name, email: user.email});
        }else{
            return res.status(401).json({success:false, message: 'Entered wrong password !'});
        }
    })

}