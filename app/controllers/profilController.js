const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const sanitizeHtml = require('sanitize-html');
const { BcryptData } = require('../utils');
const { Op } = require('sequelize');

const profilController = {
 
  // CREATION D'UN UTILISATEUR
 createUser: async (req, res) => {

  try {
   const data = req.body;
    data.user_name = sanitizeHtml(data.user_name);
    data.email = sanitizeHtml(data.email);
    data.password = sanitizeHtml(data.password);

   const email = data.email;

   //le pseudo existe déjà
   const userPseudo = await User.findOne({
    where: {
     user_name: req.body.user_name,
    },
   });
   if (userPseudo) {
    return res.status(401).json({ message: "Ce pseudo existe déjà." });
   }

   // Vérif de la taille du pseudo
   if (data.user_name.length > 20 || data.user_name.length < 2) {
    return res.status(401).json({ message: "Le pseudo doit contenir entre 2 et 20 caractères !" });
   }

    //l'email existe déjà
    const userEmail = await User.findOne({
      where: {
      email: email,
      },
    });
    if (userEmail) {
        return res.status(401).json({ message : "mail a déjà été utilisé sur notre site."})
    }

    //format d'email invalide
    if (!emailValidator.validate(email)) {
        return res.status(401).json ({message : "Votre email doit correspondre au format suivant monMail99@gmail.com."})
        }

    // Le mot de passe doit contenir au moins 8 caractères et doit contenir au moins une majuscule et un chiffre.
    const verifUserPwd = req.body.password;
    let isNumeric = false;
    let isUpperCase = false;
    let nbLetters = false;
    let character = "";
    let i = 0;

        // On vérifie la longueur du mail
    if (verifUserPwd.length >= 8) {
        nbLetters = true;
    }

    // On vérifie la présence d'une majuscule et d'un chiffre
    while (i < verifUserPwd.length) {
        character = verifUserPwd.charAt(i);

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
        return res.status(401).json ({ message : "Votre mot de passe doit contenir une lettre majuscule et un chiffre. Il doit également comporté au minimum 8 caractères."})
    }

   // cryptage du password
   const salt = await bcrypt.genSalt(10);
   data.password = await bcrypt.hash(req.body.password, salt);

   // création de l'utilisateur
   const user = await User.create(data);
   console.log("USER créé avec succés !!!!");
   res.status(200).json(user);

  } catch (error) {
   res
    .status(500)
    .json({ message: `Server error, please contact an administrator` });
  }
 },

 //SUPPRESSION D'UN UTILISATEUR
 deleteProfil: async (req, res) => {
  console.log('passe');
  try {
   const id = parseInt(req.params.userId, 10);

   console.log('passe');
   // recherche de l'utilisateur en BDD
   const user = await User.findByPk(id);
   if (!user) {
    return next();
   }
   // Utilisateur trouvé = utilisateur supprimeé
   await user.destroy();
   console.log(`USER `,id ,` supprimé`);
   res.status(200).json({ message: `Utilisateur supprimé !` });

  } catch (error) {
   res
    .status(500)
    .json({ message: `Server error, please contact an administrator` });
  }
 },

  // RECUPERATION DU PROFIL UTILISATEUR
  getProfil: async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(401).json({ message: `Id manquant !` });
    }

    const user = await User.findByPk(userId);
    
    if (user) {
      res.json(user)
    } else {
      res.status(401).json({ message: `l'utilisateur ${userId} n'a pas été trouvé !` });
    }
  } catch (err) {
    res.status(500).json({ message: `Server error, please contact an administrator` });
  }
},

  // MISE A JOUR DU PROFIL
  updateProfil: async (req, res, next) => {
  try {
    const data = req.body;
    data.user_name = sanitizeHtml(data.user_name);
    data.email = sanitizeHtml(data.email);
    data.password = sanitizeHtml(data.password);

    // on vérifie l'id de la route  
    const id = parseInt(req.params.userId, 10);
    if (isNaN(id)) {
      return res.status(401).json({error: "Id manquant"});
    }

      // on vérirfie que l'utilisateur est en BDD
      const user = await User.findByPk(id);
      if (!user) {
          return res.status(401).json({ message: `l'utilisateur ${Id} n'a pas été trouvé !` });
      }

      // On vérifie le pseudo renseigné
      if (typeof data.user_name !== 'undefined') {
          if (data.user_name === '') {
              return res.status(401).json({message: `le speudo doit être renseigné`});
          }
      }

      //le pseudo existe déjà
      const userPseudo = await User.findOne({
        where: {
          id: {[Op.ne]: id},
          user_name: data.user_name,
        },
      });

      if (userPseudo) {
        return res.status(401).json({ message: "Ce pseudo existe déjà." });
      }

    //l'email existe déjà
    const userEmail = await User.findOne({
      where: {
        email: data.email,
        id: {[Op.ne]: id},
      },
    });

    if (userEmail) {
        return res.status(401).json({ message : "mail a déjà été utilisé sur notre site."})
    }

    //format d'email invalide
    if (!emailValidator.validate(data.email)) {
        return res.status(401).json ({message : "Votre email doit correspondre au format suivant monMail99@gmail.com."})
        }
    
    // Vérification du PWD : le mot de passe doit contenir au moins 8 caractères et doit contenir au moins une majuscule et un chiffre.
    if (data.password) {
      
      const verifUserPwd = data.password;
      let isNumeric = false;
      let isUpperCase = false;
      let nbLetters = false;
      let character = "";
      let i = 0;

      // On vérifie la longueur du pwd
      if (verifUserPwd.length >= 8) {
          nbLetters = true;
      }

      // On vérifie la présence d'une majuscule et d'un chiffre
      while (i < verifUserPwd.length) {
          character = verifUserPwd.charAt(i);

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
        return res.status(401).json({ message: "Votre mot de passe doit contenir une lettre majuscule et un chiffre. Il doit également comporté au minimum 8 caractères."})
      }
    };

    //On crypte le PWD
    data.password =  BcryptData(data.password);

    // update
    const userSaved = await user.update(data);

    res.status(200).json(userSaved);

    } catch (error) {
      res.status(500).json({ message: `Server error, please contact an administrator` });
    }
  },
};

module.exports = profilController;
