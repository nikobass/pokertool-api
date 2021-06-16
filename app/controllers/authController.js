const { User } = require("../models");
const bcrypt = require("bcrypt");
const sanitizeHtml = require('sanitize-html');

const { generateAccessToken } = require("../utils");

const authController = {
 
 // AUTENTIFICATION D'UN UTILISATEUR
 authUser: async (req, res) => {
  try {
   // on récupére l'utilisateur qui possède l'email
   const user = await User.findOne({
    where: {
     email: req.body.email,
    },
   });

   if (!user) {
    return console.log("Cet email n'existe pas.");
   }

   // Si on a un utilisateur, on teste si le mot de passe est valide
   const validPwd = await bcrypt.compare(req.body.password, user.password);
   if (!validPwd) {
    return console.log("Ce n'est pas le bon mot de passe.");
   }

   // si tout va bien, on renvoie le pseudo, email et on génére le TOKEN...
   console.log("Tout est OK, le USER peut entrer");
   res.status(200).json({
    nickname: user.user_name,
    userId: user.id,
    token: generateAccessToken({ userId: user.id }),
   });

  } catch (err) {
   //console.trace(err);
   res.status(500).json({error: 'REQUETE INVALIDE'});
  }
 },

};

module.exports = authController;
