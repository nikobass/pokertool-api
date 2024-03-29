const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class Chip extends Model {};

Chip.init({ 
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false},
    color: {
        type: DataTypes.TEXT,
        allowNull: false},
    value: {
        type: DataTypes.INTEGER,
        allowNull: false}
},{
    sequelize,
    tableName: 'chip',
})

module.exports = Chip;