const { User } = require("../models");
const bcrypt = require("bcrypt");

const { generateAccessToken } = require("../utils");

const authController = {
 
 // AUTENTIFICATION D'UN UTILISATEUR
 authUser: async (req, res) => {
  try {
    const data = req.body;

    // vérification des données
    if (!data.email || !data.password) {
      return res.json({error: `email ou mot de passe non renseigné`});
    }
   
    // on récupére l'utilisateur qui possède l'email
   const user = await User.findOne({
    where: {
     email: data.email,
    },
   });
   // utilisateur non trouvé 
   if (!user) {
    return res.status(401).json({ message: "User does not exist" });
   }

   // Si on a un utilisateur, on teste si le mot de passe est valide
   const validPwd = await bcrypt.compare(data.password, user.password);
   if (!validPwd) {
    return res.status(401).json({message: `Ce n'est pas le bon mot de passe`});
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

 // CREATION DU KEY_PASSWORD
 addResetPassword: async (req, res) => {

  try {
   const email = req.params.email;

   //Vérification du user
   const user = await User.findOne({
    where: {
     email: email,
    },
   });
   if (!user) {
    return res.json({ error: `Aucun utilisateur trouvé avec le mail : ${email}` });
   }

   // cryptage du key_password
   const salt = await bcrypt.genSalt(10);
   user.key_password = await bcrypt.hash(user.email, salt);

   // création du key_password
   const addKeypassword = await user.update(user);
   console.log("Key password créé avec succés !!!!");
   res.status(201).json(addKeypassword);

  } catch (error) {
   res
    .status(500)
    .json({ error: `Server error, please contact an administrator` });
  }
 },

// CREATION DU KEY_PASSWORD
deleteResetPassword: async (req, res) => {

  try {
   const email = req.params.email;

   //Vérification du user
   const user = await User.findOne({
    where: {
     email: email,
    },
   });
   if (!user) {
    return res.json({ error: `Aucun utilisateur trouvé avec le mail : ${email}` });
   }

   user.key_password='';

   // supprimer key_password
   const deleteKeypassword = await user.update(user);
   console.log("Key password supprimé avec succés !!!!");
   res.status(201).json(deleteKeypassword);

  } catch (error) {
   res
    .status(500)
    .json({ error: `Server error, please contact an administrator` });
  }
 },





};

module.exports = authController;
