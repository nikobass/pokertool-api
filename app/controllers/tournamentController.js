const { Tournament } = require("../models");

const tournamentController = {
 
  // RECUPERATION DES TOURNOIS
 getAllTournaments: async (req, res) => {
  try {
   const userId = parseInt(req.params.userId);
   if (!userId) {
    return res.json({ error: `Id ${userId} invalide !` });
  } 

   const tournaments = await Tournament.findAll({
    where: {
     user_id: userId,
    },
   });

   if (!tournaments) {
    res
     .status(500)
     .json({ error: `pas de tournois trouvés pour l'utilisateur ${userId}` });
   } else {
    res.json(tournaments);
   }
  } catch (err) {
   res.status(500).send(err);
  }
 },

  // RECUPERATION D'UN TOURNOI
  getOneTournament: async (req, res) => {
    try {
      const tournamentId = parseInt(req.params.id);
      if (isNaN(tournamentId)) {
        return res.status(500).json({ error: `Id manquant !` });
       }

      const tournament = await Tournament.findByPk(tournamentId);
      
      if (tournament) {
        res.json(tournament)
      } else {
        res.status(500).json({ error: `Le tournoi ${tournamentId} n'a pas été trouvé !` });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },

 //SUPPRESSION D'UN TOURNOI
 deleteTournament: async (req, res) => {
    try {
     const id = parseInt(req.params.id, 10);
  
     if (isNaN(id)) {
      return res.status(500).json({ error: `Id manquant !` });
     }

     // recherche du tournoi en BDD
     const tournament = await Tournament.findByPk(id);
     if (!tournament) {
      return res.status(500).json({ error: `Le tournoi ${id} n'a pas été trouvé !` });
     }
     // Tournpoi trouvé = tournoi supprime
     await tournament.destroy();
     console.log(`TOURNAMENT `,id ,` supprimé`);
     res.status(204).json();
  
    } catch (error) {
     res
      .status(500)
      .json({ error: `Server error, please contact an administrator` });
    }
   },

 // CREATION D'UN TOURNOI
 createTournament: async (req, res) => {

  try {
   const data = req.body;

   // vérification de la présente d'un ID user
   const userId = parseInt(req.params.userId, 10);
     if (isNaN(userId)) {
    return res.status(500).json({ error: `Id manquant !` });
   }

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
      email: email,
      },
    });
    if (userEmail) {
        return res.json({ error : "mail a déjà été utilisé sur notre site."})
    }
  
    //format d'email invalide
    if (!emailValidator.validate(email)) {
        return res.json ({error : "Votre email doit correspondre au format suivant monMail99@gmail.com."})
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
        return res.json ({ error : "Votre mot de passe doit contenir une lettre majuscule et un chiffre. Il doit également comporté au minimum 8 caractères."})
    }
 
     // l'e-mail et la confirmation ne correspondent pas
   if (req.body.email !== req.body.emailConfirm) {
    return res.json({ error: "La confirmation de l'email ne correspond pas." });
   };

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

};



module.exports = tournamentController;
