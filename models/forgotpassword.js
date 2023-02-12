const Sequelize = require('sequelize');

const sequelize = require('../utill/database');

const Forgotpassword = sequelize.define('forgotpassword' , {
    id: {
        type :Sequelize.UUID,
        allowNull : false,
        primaryKey : true
    },
    isActive: {
        type : Sequelize.BOOLEAN
    }
})

module.exports = Forgotpassword;