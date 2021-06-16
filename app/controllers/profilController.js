const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const { formatEmailValid } = require("../utils");

const profilController = {
 // CREATION D'UN UTILISATEUR
 createUser: async (req, res) => {

  try {
   const data = req.body;
   const email = req.body.email;

   //le pseudo existe déjà
   const userPseudo = await User.findOne({
    where: {
     user_name: req.body.user_name,
    },
   });
   if (userPseudo) {
    return res.json({ error: "Ce pseudo existe déjà." });
   }

     // l'e-mail et la confirmation ne correspondent pas
   if (req.body.email !== req.body.emailConfirm) {
    return res.json({ error: "La confirmation de l'email ne correspond pas." });
   };

  
  formatEmailValid(email)

 

   // le mdp et la confirmation ne correspondent pas
   if (req.body.password !== req.body.passwordConfirm) {
    return res.json({
     error: "La confirmation du mot de passe ne correspond pas.",
    });
   };

   // cryptage du password
   const salt = await bcrypt.genSalt(10);
   data.password = await bcrypt.hash(req.body.password, salt);

   // création de l'utilisateur
   const user = await User.create(data);
   console.log("USER créé avec succés !!!!");
   res.status(201).json(user);

  } catch (error) {
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
  getProfil: async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await User.findByPk(userId);
    
    if (user) {
      res.json(user)
    } else {
      res.status(500).json({ error: `l'utilisateur ${userId} n'a pas été trouvé !` });
    }
  } catch (err) {
    console.trace(err);
    res.status(500).send(err);
  }
},

  // MISE A JOUR DU PROFIL
  updateProfil: async (req, res, next) => {
  try {

      const id = parseInt(request.params.userId, 10);
      if (isNaN(id)) {
          return next();
      }

      const user = await User.findByPk(id);
      if (!user) {
          return res.status(500).json({ error: `l'utilisateur ${Id} n'a pas été trouvé !` });
      }

      const data = request.body;
      const errors = [];

      // On vérifie les différentes contraintes
      if (typeof data.content !== 'undefined') {
          if (data.content === '') {
              errors.push(`content can't be empty`);
          } else if (data.content.length < 3) {
              errors.push(`content must have at least 3 caracters`);
          }
      }

      if (data.position) {
          data.position = parseInt(data.position, 10);
          if (isNaN(data.position)) {
              errors.push(`position must be a number`);
          }
      }

      if (errors.length > 0) {
          return response.status(400).json({ errors });
      }

      //On assaini les valeurs texte
      data.content = sanitizeHtml(data.content);

      const cardSaved = await card.update(data);

      response.json(cardSaved);

  } catch (error) {
      console.trace(error);
      response.status(500).json({ error: `Server error, please contact an administrator` });
  }
},

};

module.exports = profilController;
