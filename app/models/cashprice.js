const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class Cashprice extends Model {};

Cashprice.init({ 
    position: {
        type: DataTypes.INTEGER,
        allowNull: false},
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false}
},{
    sequelize,
    tableName: 'cashprice',
})

module.exports = Cashprice;