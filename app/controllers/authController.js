const { User } = require("../models");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../utils");

const authController = {
 createUser: async (req, res) => {
  try {
   const data = req.body;
   console.log(data);

   // cryptage du password
   const salt = await bcrypt.genSalt(10);
   data.password = await bcrypt.hash(req.body.password, salt);

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

   // si tout va bien, on renvoie l'ID du user et on génére le TOKEN...
   console.log("Tout est OK, le USER peut entrer");
   res.status(200).json({
    userId: user.id,
    token: generateAccessToken({ userId: user.id }),
   });

   // et on repart sur la page d'accueil
   return res.redirect("/");
  } catch (err) {
   //console.trace(err);
   res.status(500).send(err);
  }
 },

 test: async (req, res) => {
  try {
   const testId = parseInt(req.params.id, 10);
   console.log(testId);

   res.status(201).json(testId);
  } catch (error) {
   //console.trace(error);
   res
    .status(500)
    .json({ error: `Server error, please contact an administrator` });
  }
 },
};

module.exports = authController;
