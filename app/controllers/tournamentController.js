const { Tournament, User, Structure } = require("../models");
const sanitizeHtml = require('sanitize-html');

const tournamentController = {
 
  // RECUPERATION DES TOURNOIS D'UN USER
 getAllTournaments: async (req, res) => {
  try {
   const userId = parseInt(req.params.userId, 10);
    
   // Recherche du USER
   const user = await User.findByPk(userId);
   if (!user) {
    return res.status(401).json({ message: `l'utilisateur ${userId} n'a pas été trouvé !` })
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
    res.status(200).json(tournaments);
   }
  } catch (err) {
    res.status(500).json({ message: `Server error, please contact an administrator` });
  }
 },

  // RECUPERATION D'UN TOURNOI
  getOneTournament: async (req, res) => {
    try {
      // Recherche du Tournoi
      const tournamentId = parseInt(req.params.id);
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
  
     // recherche du tournoi en BDD
     const tournament = await Tournament.findByPk(id);
     if (!tournament) {
      return res.status(401).json({ message: `Le tournoi ${id} n'a pas été trouvé !` });
     }

     // Tournpoi trouvé = tournoi supprime
     await tournament.destroy();
     res.status(200).json({ message: `Tournoi supprimé` });
  
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

      data.name = sanitizeHtml(data.name);
      data.comments = sanitizeHtml(data.comments);

      //Recherche du USER
      const userId = parseInt(req.params.userId, 10);
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(401).json({ message: `l'utilisateur ${userId} n'a pas été trouvé !` })
      }

      // vérification des données obligatoires
        if(!data.name || !data.date || !data.location || !data.nb_players || !data.speed || !data.starting_stack || !data.buy_in || !data.cash_price) { return res.status(401).json({ message: `Vérifier que toutes les informations obligatoires soient correctement saisies !` });}

        data.nb_players = parseInt(data.nb_players, 10);
        data.speed = parseInt(data.speed, 10);
        data.starting_stack = parseInt(data.starting_stack, 10);
        data.buy_in = parseInt(data.buy_in, 10);
        data.cash_price = parseInt(data.cash_price, 10);
      
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

      const tournamentCreated = await newTournament.save();
      
      if (tournamentCreated.length === 0) {return res.status(401).json({message: 'aucun tournoi de créé !'});}

      // je renvoie la réponse = le nouveau tournoi
      res.status(201).json({tournamentCreated});
    
    } catch (error) {
      res
        .status(500)
        .json({ message: `Server error, please conta'ct' an administrator` });
    }
  },
  
//  // CREATION D'UNE STRUCTURE
//  fillTournamentStructure: async (req, res) => {

//   try {
//     const structuresData = req.body;
//     const structuresCreated = [];

//     //Recherche d'une DISTRIBUTION
//     const tournamentId = parseInt(req.params.id, 10);
//     const distribution = await Distribution.findAll({where: {tournament_id: tournamentId}});
//     if (!distribution) {
//       return res.status(401).json({ message: `Aucune distribution de trouvée pour le tournoi : ${tournamentId} !` })
//     }

//     for(structure of structuresData) {
//       // vérification des données obligatoires
//       if(!structure.stage || !structure.small_blind || !structure.big_blind) { return res.status(401).json({ message: `Vérifier que toutes les informations obligatoires soient correctement saisies !` });}

//       //création de la strusture
//       const newStructure = new Structure({
//         stage: data.name,
//         small_blind: data.date,
//         big_blind: data.location,
//         tournament_id: data.tournament_id
//       });

//       const structureCreated = await newStructure.save();

//       structuresCreated.push(structureCreated);
//     }
    
//       // reponse : liste des structures
//       res.status(200).json({ structuresCreated })
    
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: `Server error, please contact an administrator` });
//   }
// },

  // MODIFICATION D'UN TOURNOI
  updateTournament: async (req, res) => {

    try {
      const data = req.body;
      const id = parseInt(req.params.id, 10);
      data.name = sanitizeHtml(data.user_name);
      data.comments = sanitizeHtml(data.comments);

      // on vérirfie que le tournoi est en BDD
      const tournament = await Tournament.findByPk(id);

      if (!tournament) {
          return res.status(401).json({ message: `le tournoi ${id} n'a pas été trouvé !` });
      }

      // vérification des données obligatoires
        if(!data.name || !data.date || !data.location || !data.nb_players || !data.speed || !data.starting_stack || !data.buy_in || !data.cash_price || !data.status) { return res.status(401).json({ message: `Vérifier que toutes les informations obligatoires soient correctement saisies !` });}

        data.nb_players = parseInt(data.nb_players, 10);
        data.speed = parseInt(data.speed, 10);
        data.starting_stack = parseInt(data.starting_stack, 10);
        data.buy_in = parseInt(data.buy_in, 10);
        data.cash_price = parseInt(data.cash_price, 10);

      // Modification du tournoi
      const tournamentUpdated = await tournament.update(data);

      res.status(201).json(tournamentUpdated);

    } catch (error) {
    res
      .status(500)
      .json({ message: `Server error, please contact an administrator` });
    }
  },

  // DATAS du TIMER
  getTimerTournament: async (req, res) => {

    try {
      
      const id = parseInt(req.params.id, 10);
      
      const timer = await Tournament.findAll({
        where: {
          id: id,
        },
        include: { // on recupère tout ce qui est lié au tournoi
          all:true,
          nested: true,
        }
      });

      if (!timer) {
          return res.status(401).json({ message: `Aucune donnée pour le timer demandé !` });
      } else {
        res.status(200).json(timer);
      }

    } catch (error) {
    res
      .status(500)
      .json({ message: `Server error, please contact an administrator` });
    }
  },

};

module.exports = tournamentController;
