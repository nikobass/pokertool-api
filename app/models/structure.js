const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class Structure extends Model {};

Structure.init({ 
    stage: {
        type: DataTypes.INTEGER,
        allowNull: false},
    small_blind: {
        type: DataTypes.INTEGER,
        allowNull: false},
    big_blind: {
        type: DataTypes.INTEGER,
        allowNull: false}
},{
    sequelize,
    tableName: 'structure',
})

module.exports = Structure;