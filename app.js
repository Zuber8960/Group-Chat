const express = require('express');
const path = require('path');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));

const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./utill/database');

app.use(express.static(path.join(__dirname, 'frontend')));

const User = require('./models/user');
const Chat = require('./models/chat');
const Group = require('./models/group');
const UserGroup = require('./models/usergroup');

const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');
const groupRouter = require('./routes/group');

app.use('/user', userRouter);
app.use('/chat', chatRouter);
app.use('/group', groupRouter);


User.hasMany(Chat);
Chat.belongsTo(User);//one to many relationship

User.belongsToMany(Group , {
    through : UserGroup
});
Group.belongsToMany(User , {
    through : UserGroup
});

Group.hasMany(Chat);
Chat.belongsTo(Group);

sequelize
.sync()
.then(() => {
    console.log(`listening to the port= ${process.env.port}`);
    app.listen(process.env.port);
})


