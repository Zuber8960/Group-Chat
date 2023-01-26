const User = require('../models/user');
const bcrypt = require('bcrypt');


exports.signup = (req, res, next) => {
    // console.log(`body===>` , req.body);
    const {name, email, phonenumber, password} = req.body;
    if(name=="" || email=="" || phonenumber=="" || password==""){
        return res.status(201).json({success:false, message: 'Please fill all feilds'});
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
            // console.log(err);
            if (err.errors[0].message == 'email must be unique') {
                console.log('email already exist', err.errors[0].value);
                return res.status(404).json({ success: false, message: `Eror(404) : ${err.errors[0].value} is already exist` });
            }
            console.log(err);
            return res.status(400).json({ success : false, error: err });
        }
    })
}