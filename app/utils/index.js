const jwt = require('jsonwebtoken');

function generateAccessToken(userId) {
    return jwt.sign(userId, process.env.TOKEN_SECRET, { expiresIn: '24h' });
}

module.exports = {generateAccessToken};
