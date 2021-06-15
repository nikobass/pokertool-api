const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class User extends Model {};

User.init({ 
    user_name: {
        type: DataTypes.TEXT,
        allowNull: false},
    email: {
        type: DataTypes.TEXT,
        allowNull: false},
    password: {
        type: DataTypes.TEXT,
        allowNull: false},
    key_password: DataTypes.TEXT
},{
    sequelize,
    tableName: 'user',
})

module.exports = User;