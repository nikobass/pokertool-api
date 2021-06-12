const Cashprice = require('./casprice');
const Chip = require('./chip');
const Distribution = require('./distribution');
const Structure = require('./structure');
const Tournament = require('./tournament');
const User = require('./user');

// Gestion des associations entre les différents modèles
User.hasMany(Chip, {
    as: 'chips',
    foreignKey: 'user_id'
});

Chip.belongsTo(User, {
    as: 'user',
    foreignKey: 'user_id'
});

User.hasMany(Tournament, {
    as: 'tournaments',
    foreignKey: 'user_id'
});

Tournament.belongsTo(User, {
    as: 'user',
    foreignKey: 'user_id'
});

Tournament.hasMany(Distribution, {
    as: 'distributions',
    foreignKey: 'tournament_id'
});

Distribution.belongsTo(Tournament, {
    as: 'tournament',
    foreignKey: 'tournament_id'
});

Tournament.hasMany(Cashprice, {
    as: 'cashprices',
    foreignKey:'tournament_id'
});

Cashprice.belongsTo(Tournament, {
    as:'tournament',
    foreignKey: 'tournament_id'
});

Tournament.hasMany(Structure, {
    as: 'structures',
    foreignKey: 'tournament_id'
});

Structure.belongsTo(Tournament, {
    as: 'tournament',
    foreignKey: 'tournament_id',
});

module.exports = { List, Card, Tag };