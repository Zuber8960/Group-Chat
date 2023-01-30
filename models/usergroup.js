const Sequelize = require('sequelize');

const sequelize = require('../utill/database');


const UserGroup = sequelize.define('usergroup' , {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    isAdmin: {
        type: Sequelize.BOOLEAN
    }
})

module.exports = UserGroup;