const Sequelize = require('sequelize');

const sequelize = require('../utill/database');

const Chat = sequelize.define('chat' , {
    id: {
        type :Sequelize.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    message: {
        type : Sequelize.STRING,
        allowNull : false
    }
})

module.exports = Chat;