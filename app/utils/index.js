  
const jwt = require('jsonwebtoken');
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const { User } = require("../models");

function generateAccessToken(userId) {
    // 86400 s = 24h
    return jwt.sign(userId, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_LIFE });
}

async function formatEmailValid(email) {
    let isMailOk = true;

    //format d'email invalide
    if (!emailValidator.validate(email)) {
        return (
            isMailOk = false
            // errorMessage = "Le format de l'email n'est pas correct. Votre email doit avoir par exemple ce format : monMailPersonnel9@gmail.com"
            )
    }

    //l'email existe déjà
   const userEmail = await User.findOne({
    where: {
     email: email,
    },
   });
   if (userEmail) {
    return 
        isMailOk = false
        // errorMessage = "Votre mail a déjà été utilisé !"
        
   }

   // Le mot de passe doit contenir au moins 8 caractères et doit contenir au moins une majuscule et un chiffre.

   const verifUserEmail = email.split("@")[0];
   let isNumeric = false;
   let isUpperCase = false;
   let nbLetters = false;
   let character = "";
   let i = 0;

    // On vérifie la longueur du mail
   if (verifUserEmail.length >= 8) {
    nbLetters = true;
   }

   // On vérifie la présence d'une majuscule et d'un chiffre
   while (i < verifUserEmail.length) {
    character = verifUserEmail.charAt(i);

    // est-ce un nombre ?
    if (!isNaN(character * 1)) {
     isNumeric = true;
    // est-ce une majuscule
    } else {
     if (character === character.toUpperCase()) {
      isUpperCase = true;
     }
    }
    i++;
   }

   if (!isNumeric || !isUpperCase || !nbLetters) {
    return (isMailOk = false)
   } else {return isMailOk = true}

}
module.exports = {generateAccessToken, formatEmailValid};