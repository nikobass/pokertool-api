const Cashprice = require('./cashprice');
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

// Tournament.hasMany(Structure, {
//     as: 'structures',
//     foreignKey: 'tournament_id'
// });

// Structure.belongsTo(Tournament, {
//     as: 'tournament',
//     foreignKey: 'tournament_id',
// });

Tournament.belongsToMany(Structure, {
    as: 'structures',
    through: 'tournament_has_structure',
    foreignKey: 'tournament_id',
    otherKey: 'structure_id',
    timestamps: false
})

Structure.belongsToMany(Tournament, {
    as: 'tournaments',
    through: 'tournament_has_structure',
    foreignKey: 'structure_id',
    otherKey: 'tournament_id',
    timestamps: false
})

module.exports = { Cashprice, Chip, Distribution, Structure, Tournament, User };

