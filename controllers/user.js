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
    try{
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
    }catch(err){
        console.log(err);
        return res.status(500).json({ success : false, message: `Something went wrong !` });
    }
}


const  Sib = require('sib-api-v3-sdk');
const uuid = require('uuid');
const Forgotpassword = require('../models/forgotpassword');

exports.password = async(req, res, next) => {
    try{
        const { email } = req.body;
        console.log(req.body);
    
        const user = await User.findOne({where : {email : email}});
        if(!user){
            return res.status(400).json({success: false, message: `User doesn't exist !`})
        }
    
        const id = uuid.v4();
        const data = await user.createForgotpassword({
            id: id,
            isActive: true,
        })
        console.log(data);
    
        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.API_KEY;
    
        console.log(process.env.API_KEY);
    
        const zuberEmailApi = new Sib.TransactionalEmailsApi();
        const sender = { email : 'zuberahmad8960@gmail.com'};
        
        const receivers = [ {
            email : email,
        } ]
        
        const response = await zuberEmailApi
        .sendTransacEmail({
            sender,
            to: receivers,
            subject: "Change Password",
            textContent: "Send a reset password mail",
            htmlContent: `
            <a href="http://3.83.227.86/user/resetpassward/${id}">Reset password</a>
            `,
        })
    
        console.log(response);
    
        res.status(200).json({success : true , message: 'Check your mail !'});
    }catch(err){
        console.log(err);
        return res.status(500).json({ success : false, message: `Something went wrong !` });
    }
}

const path =require('path');

exports.resetPassword = async (req, res, next) => {
    try{
        console.log(req.params);
        const {id} = req.params;
        const data = await Forgotpassword.findOne({where : {id: id , isActive : true}});
    
        if(!data){
            return res.status(500).sendFile(path.join(__dirname,'../','frontend/html/error2.html'))
        }
    
        await data.update({isActive : false})
    
        res.status(200).send(`
            <html>
                <head>
                <title>Reset Password Page</title>
                    <style>
                        body{
                            background-color: #45a049;
                        }
                    
                        form {
                                top: 200px;
                                right: 120px;
                                position: fixed;
                                max-width: 300px;
                                margin: 0 auto;
                                background-color: rgb(25, 90, 99);
                                padding: 50px 40px 50px 50px;
                                border-radius: 5px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                            }
                        label{
                            color: #fff;
                            font-weight: bold;
                            font-size: 20px;
                        }

                        input[type="password"] {
                            width: 100%;
                            padding: 12px 20px;
                            margin: 8px 0;
                            display: inline-block;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                            box-sizing: border-box;
                        }

                        input[type="submit"] {
                            width: 100%;
                            background-color: #4CAF50;
                            color: #fff;
                            padding: 12px 20px;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                        }

                        input[type="submit"]:hover {
                            background-color: #45a049;
                        }
                    </style>
                </head>

                <body>
                    <img src="http://3.83.227.86:3000/img/n3.gif" alt="">
                    <form action="/user/updatepassword/${id}" method="get">
                        <label for="newpassword">Enter New password</label>
                        <input name="newpassword" type="password" placeholder="Enter new password"></input>
                        <input type="submit" value="Submit">
                    </form>
                </body>

            </html>
        `);
    }catch(err){
        console.log(err);
        return res.status(500).json({ success : false, message: `Something went wrong !` });
    }
}


exports.updatePassword = async (req, res, next) => {
    try{
        console.log(req.query);
        console.log(req.params);
        const {id} = req.params;
        const { newpassword } = req.query;
    
        const row = await Forgotpassword.findOne({where: { id : id}});
        
        const user = await User.findOne({where : {id : row.userId}});
        console.log(JSON.parse(JSON.stringify(user)));
    
        const saltRounds = 10;
        bcrypt.hash(newpassword , saltRounds, async (err,hash) => {
            await user.update({ password : hash})
        })
    
        res.status(200).send(`
        <html>
            <script>
                alert('Password has been changed successfully');
                window.location.href = 'http://3.83.227.86/html/login.html'
            </script>
        </html>
        `);
    }catch(err){
        console.log(err);
        return res.status(500).json({ success : false, message: `Something went wrong !` });
    }
}