const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const { User } = require("../models");

const profilController = {
 // CREATION D'UN UTILISATEUR
 createUser: async (req, res) => {
  try {
   const data = req.body;

   //le pseudo existe déjà
   const userPseudo = await User.findOne({
    where: {
     user_name: req.body.user_name,
    },
   });
   if (userPseudo) {
    return res.json({ error: "Ce pseudo existe déjà." });
   }

   //l'email existe déjà
   const userEmail = await User.findOne({
    where: {
     email: req.body.email,
    },
   });
   if (userEmail) {
    return res.json({ error: "Cet email existe déjà." });
   }

   //format d'email invalide
   if (!emailValidator.validate(req.body.email)) {
    return res.json({ error: "Cet email n'est pas valide." });
   }

   // l'e-mail et la confirmation ne correspondent pas
   if (req.body.email !== req.body.emailConfirm) {
    return res.json({ error: "La confirmation de l'email ne correspond pas." });
   }

   // Le mot de passe doit contenir au moins 8 caractères et doit contenir au moins une majuscule et un chiffre.

   const verifUserEmail = req.body.email.split("@")[0];
   let isNumeric = false;
   let isUpperCase = false;
   let nbLetters = false;
   let character = "";
   let i = 0;

   if (verifUserEmail.length >= 8) {
    nbLetters = true;
   }

   while (i < verifUserEmail.length) {
    character = verifUserEmail.charAt(i);

    if (!isNaN(character * 1)) {
     isNumeric = true;
    } else {
     if (character === character.toUpperCase()) {
      isUpperCase = true;
     }
    }
    i++;
   }

   if (!isNumeric || !isUpperCase || !nbLetters) {
    return res.json({
     error:
      "Un email doit comprendre au minimum 8 caratères, une majuscule et un chiffre",
    });
   }

   // le mdp et la confirmation ne correspondent pas
   if (req.body.password !== req.body.passwordConfirm) {
    return res.json({
     error: "La confirmation du mot de passe ne correspond pas.",
    });
   }

   // cryptage du password
   const salt = await bcrypt.genSalt(10);
   data.password = await bcrypt.hash(req.body.password, salt);

   // création de l'utilisateur
   const user = await User.create(data);
   console.log("USER créé avec succés !!!!");
   res.status(201).json(user);
  } catch (error) {
   //console.trace(error);
   res
    .status(500)
    .json({ error: `Server error, please contact an administrator` });
  }
 },

 //SUPPRESSION D'UN UTILISATEUR
 deleteProfil: async (req, res) => {
  try {
   const id = parseInt(req.params.userId, 10);

   if (isNaN(id)) {
    return next();
   }
   // recherche de l'utilisateur en BDD
   const user = await User.findByPk(id);
   if (!user) {
    return next();
   }
   // Utilisateur trouvé = utilisateur supprimeé
   await user.destroy();
   console.log(`USER `,id ,` supprimé`);
   res.status(204).json();

  } catch (error) {
   res
    .status(500)
    .json({ error: `Server error, please contact an administrator` });
  }
 },

// RECUPERATION DU PROFIL
//  quizzPage: async (req, res) => {
//   try {
//     const quizId = parseInt(req.params.id);
//     const quiz = await Quiz.findByPk(quizId,{
//       include: [
//         { association: 'author'},
//         { association: 'questions', include: ['answers', 'level']},
//         { association: 'tags'}
//       ]
//     });
//     if (req.session.user) {
//       res.render('play_quiz', {quiz});
//     } else {
//       res.render('quiz', {quiz});
//     }
//   } catch (err) {
//     console.trace(err);
//     res.status(500).send(err);
//   }
// },

};

module.exports = profilController;
