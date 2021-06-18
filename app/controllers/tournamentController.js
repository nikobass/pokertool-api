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

      // jointure TOURNOI / STRUCTURE DU TOURNOI
      const defaultStructure = await Structure.findAll(); // table des structures par défault

      for(const structure of defaultStructure) {
        await structure.addTournament(tournamentCreated);
      }

      // je renvoie la réponse = le nouveau tournoi
      res.status(201).json({newTournament});
    
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
        include: {
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
