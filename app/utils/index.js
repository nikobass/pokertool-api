  
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

function generateAccessToken(userId) {
    // 86400 s = 24h
    return jwt.sign(userId, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_LIFE });
}

function BcryptData (data) {
    
    const salt = bcrypt.genSaltSync(10);
    const pwdCrypted = bcrypt.hashSync(data, salt)
    

        return pwdCrypted;
    
    
   
   

}

module.exports = {generateAccessToken, BcryptData};