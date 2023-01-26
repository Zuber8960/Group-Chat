const express = require('express');
const path = require('path');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(cors());

const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./utill/database');

app.use(express.static(path.join(__dirname, 'frontend')));

const userRouter = require('./routes/user');

app.use('/user',userRouter);


sequelize
.sync()
.then(() => {
    console.log(`listening to the port= ${process.env.port}`);
    app.listen(process.env.port);
})


