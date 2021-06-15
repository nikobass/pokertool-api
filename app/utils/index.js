  
const jwt = require('jsonwebtoken');

function generateAccessToken(userId) {
    // 86400 s = 24h
    return jwt.sign(userId, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_LIFE });
}

module.exports = {generateAccessToken};