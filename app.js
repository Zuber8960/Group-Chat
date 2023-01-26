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

const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');

app.use('/user', userRouter);
app.use('/chat', chatRouter);


User.hasMany(Chat);
Chat.belongsTo(User);

sequelize
.sync()
.then(() => {
    console.log(`listening to the port= ${process.env.port}`);
    app.listen(process.env.port);
})


