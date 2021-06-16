const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const { User } = require("../models");

exports.formatEmailValid = async function(req, res, next){  
    console.log(req);
    try{    
        let isMailOk = true;
        //format d'email invalide
        if (!emailValidator.validate(req)) {
            return res.json({retour: false,
                message: "Votre email doit correspondre au format suivant monMail99@gmail.com."})
        }
       

        //l'email existe déjà
        const userEmail = await User.findOne({
            where: {
            email: email,
            },
        });
        if (userEmail) {
            return res = {
                retour: false,
                message: "Votre email a déjà été utilisé sur notre site."
            }
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
            return res = {
                retour: false,
                message: "Votre email doit contenir une lettre majuscule et un chiffre. Il doit également comporté au minimum 8 caractères."
            }
        } else {
            return res = {retour: true}
        }

        next();
    }
    catch(err){

        return res.status(401).send();
    }
}





