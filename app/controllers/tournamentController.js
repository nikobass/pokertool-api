const { Tournament } = require("../models");

const tournamentController = {
 
  // RECUPERATION DES TOURNOIS
 getAllTournaments: async (req, res) => {
  try {
   const userId = parseInt(req.params.userId);
   if (!userId) {
    return res.status(401).json({ message: `Id ${userId} invalide !` });
  } 

   const tournaments = await Tournament.findAll({
    where: {
     user_id: userId,
    },
   });

   if (!tournaments) {
    res
     .status(401)
     .json({ message: `pas de tournois trouvés pour l'utilisateur ${userId}` });
   } else {
    res.json(tournaments);
   }
  } catch (err) {
    res.status(500).json({ message: `Server error, please contact an administrator` });
  }
 },

  // RECUPERATION D'UN TOURNOI
  getOneTournament: async (req, res) => {
    try {
      const tournamentId = parseInt(req.params.id);
      if (isNaN(tournamentId)) {
        return res.status(401).json({ message: `Id manquant !` });
       }

      const tournament = await Tournament.findByPk(tournamentId);
      
      if (tournament) {
        res.status(200).json(tournament)
      } else {
        res.status(401).json({ message: `Le tournoi ${tournamentId} n'a pas été trouvé !` });
      }
    } catch (err) {
      res.status(500).json({ message: `Server error, please contact an administrator` });
    }
  },

 //SUPPRESSION D'UN TOURNOI
 deleteTournament: async (req, res) => {
    try {
     const id = parseInt(req.params.id, 10);
  
     if (isNaN(id)) {
      return res.status(401).json({ message: `Id manquant !` });
     }

     // recherche du tournoi en BDD
     const tournament = await Tournament.findByPk(id);
     if (!tournament) {
      return res.status(401).json({ message: `Le tournoi ${id} n'a pas été trouvé !` });
     }
     // Tournpoi trouvé = tournoi supprime
     await tournament.destroy();
     console.log(`TOURNAMENT `,id ,` supprimé`);
     res.status(204).json({ message: `Tournoi supprimé` });
  
    } catch (error) {
     res
      .status(500)
      .json({ message: `Server error, please contact an administrator` });
    }
   },

 // CREATION D'UN TOURNOI
  createTournament: async (req, res) => {

    try {
      const data = req.body;

      // vérification de la présente d'un ID user
      const userId = parseInt(req.params.userId, 10);
        if (isNaN(userId)) {
        return res.status(401).json({ message: `Id manquant !` });
      }

      console.log(data, userId);
      // vérification des données obligatoires
        if(!data.name || !data.date || !data.location || !data.nb_players || !data.speed || !data.starting_stack || !data.buy_in || !data.cash_price) { return res.status(401).json({ message: `Vérifier que toutes les informations obligatoires soient correctement saisies !` });}

        data.nb_players = parseInt(data.nb_players, 10);
        data.speed = parseInt(data.speed, 10);
        data.starting_stack = parseInt(data.starting_stack, 10);
        data.buy_in = parseInt(data.buy_in, 10);
        data.cash_price = parseInt(data.cash_price, 10);
      
      console.log("APRES", data, userId)
      //création du tournoi
      const newTournament = new Tournament({
        name: data.name,
        date: data.date,
        location: data.location,
        nb_players: data.nb_players,
        speed: data.speed,
        starting_stack: data.starting_stack,
        buy_in: data.buy_in,
        cash_price: data.cash_price,
        status: "prévu",
        comments: data.comments,
         user_id: userId
      });
      console.log("TOURNOI créé !!!!", newTournament);
      //const tournament = await Tournament.create(data);
      await newTournament.save();
      console.log("TOURNOI enregistré !!!!");
      res.status(201).json(newTournament);

    } catch (error) {
    res
      .status(500)
      .json({ message: `Server error, please conta'ct' an administrator` });
    }

  },

  // MODIFICATION D'UN TOURNOI
  updateTournament: async (req, res) => {

    try {
      const data = req.body;
      
      // vérification de la présente d'un ID tournament
      const tournamentId = parseInt(req.params.id, 10);
        if (isNaN(tournamentId)) {
        return res.status(401).json({ message: `Id manquant !` });
      }

      // on vérirfie que le tournoi est en BDD
      const tournament = await Tournament.findByPk(tournamentId);

      if (!tournament) {
          return res.status(401).json({ message: `le tournoi ${tournamentId} n'a pas été trouvé !` });
      }

      console.log(data)
      // vérification des données obligatoires
        if(!data.name || !data.date || !data.location || !data.nb_players || !data.speed || !data.starting_stack || !data.buy_in || !data.cash_price || !data.status) { return res.status(401).json({ message: `Vérifier que toutes les informations obligatoires soient correctement saisies !` });}

        data.nb_players = parseInt(data.nb_players, 10);
        data.speed = parseInt(data.speed, 10);
        data.starting_stack = parseInt(data.starting_stack, 10);
        data.buy_in = parseInt(data.buy_in, 10);
        data.cash_price = parseInt(data.cash_price, 10);
      
      console.log(data)
      // création du tournoi
      const tournamentUpdated = await tournament.update(data);

      console.log("TOURNOI modifié avec succés !!!!");
      res.status(201).json(tournamentUpdated);

    } catch (error) {
    res
      .status(500)
      .json({ message: `Server error, please contact an administrator` });
    }

  },

};

module.exports = tournamentController;
