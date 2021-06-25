const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class Tournament extends Model {};

Tournament.init({ 
    name: {
        type: DataTypes.TEXT,
        allowNull: false},
    date: {
        type: DataTypes.DATE,
        allowNull: false},
    location: {
        type: DataTypes.TEXT,
        allowNull: false},
    nb_players: {
        type: DataTypes.INTEGER,
        allowNull: false},
    speed: {
        type: DataTypes.INTEGER,
        allowNull: false},
    starting_stack: {
        type: DataTypes.INTEGER,
        allowNull: false},
    buy_in: {
        type: DataTypes.INTEGER,
        allowNull: false},
    status: {
        type: DataTypes.TEXT,
        allowNull: false},
    comments: DataTypes.TEXT,
    chips_user: DataTypes.BOOLEAN,
    small_blind: {
        type: DataTypes.INTEGER,
        allowNull: false}
},{
    sequelize,
    tableName: 'tournament',
})

module.exports = Tournament;