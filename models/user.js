const Sequelize = require('sequelize');

const sequelize = require('../utill/database');


const User = sequelize.define('user' , {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type:Sequelize.TEXT
    },
    email:{
        type:Sequelize.STRING,
        unique: true
    },
    phonenumber:{
        type:Sequelize.STRING,
        unique:true
    },
    password:{
        type:Sequelize.STRING
    }
})

module.exports = User;