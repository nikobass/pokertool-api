const { User } = require("../models");
const bcrypt = require("bcrypt");

const { generateAccessToken } = require("../utils");

const authController = {
 // CREATION D'UN UTILISATEUR
 createUser: async (req, res) => {
  try {
   const data = req.body;

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

 // AUTENTIFICATION D'UN UTILISATEUR
 authUser: async (req, res) => {
  try {
   // on récupére l'utilisateur qui possède l'email
   console.log("test");
   const user = await User.findOne({
    where: {
     email: req.body.email,
    },
   });
   console.log("test2");
   if (!user) {
    return console.log("Cet email n'existe pas.");
   }

   // Si on a un utilisateur, on teste si le mot de passe est valide
   const validPwd = await bcrypt.compare(req.body.password, user.password);
   if (!validPwd) {
    return console.log("Ce n'est pas le bon mot de passe.");
   }

   // si tout va bien, on renvoie l'ID du user et on génére le TOKEN...
   console.log("Tout est OK, le USER peut entrer");
   res.status(200).json({
    nickname: user.user_name,
    token: generateAccessToken({ userId: user.id }),
   });

   // et on repart sur la page d'accueil
   return res.redirect("/");

  } catch (err) {
   //console.trace(err);
   //res.status(500).json({error: 'REQUETE INVALIDE'});
  }
 },

};

module.exports = authController;