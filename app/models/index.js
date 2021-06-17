const Cashprice = require('./cashprice');
const Chip = require('./chip');
const Distribution = require('./distribution');
const Structure = require('./structure');
const Tournament = require('./tournament');
const User = require('./user');

// Gestion des associations entre les différents modèles
User.hasMany(Chip, {
    foreignKey: 'user_id',
    as: 'chips'
});

Chip.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

User.hasMany(Tournament, {
    foreignKey: 'user_id',
    as: 'tournaments'
});

Tournament.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

Tournament.hasMany(Distribution, {
    foreignKey: 'tournament_id',
    as: 'distributions'
});

Distribution.belongsTo(Tournament, {
    foreignKey: 'tournament_id',
    as: 'tournament'
});

Tournament.hasMany(Cashprice, {
    foreignKey:'tournament_id',
    as: 'cashprices'
});

Cashprice.belongsTo(Tournament, {
    foreignKey: 'tournament_id',
    as:'tournament'
});

Tournament.belongsToMany(Structure, {
    as: 'structures',
    through: 'tournament_has_structure',
    foreignKey: 'tournament_id',
    otherKey: 'structure_id',
    timestamps: false
});

Structure.belongsToMany(Tournament, {
    as: 'tournaments',
    through: 'tournament_has_structure',
    foreignKey: 'structure_id',
    otherKey: 'tournament_id',
    timestamps: false
});

module.exports = { Cashprice, Chip, Distribution, Structure, Tournament, User };