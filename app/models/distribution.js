const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class Distribution extends Model {};

Distribution.init({ 
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false},
    color: {
        type: DataTypes.TEXT,
        allowNull: false},
    value: {
        type: DataTypes.INTEGER,
        allowNull: false},
    tournament_id: DataTypes.INTEGER
},{
    sequelize,
    tableName: 'distribution',
})

module.exports = Distribution;