const { Tournament, User, Structure } = require("../models");
const { createStructure } = require("../utils");
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

    // récupération de la liste des tournois du USER
    const tournaments = await Tournament.findAll({
      where: {
        user_id: userId,
      },
    });

    if(tournaments.length > 0) {
      res.status(200).json(tournaments);
    } else {
      return res.status(401).json({ message: `l'utilisateur ${userId} n'a pas de tournoi !` });
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

     // Tournpoi trouvé = tournoi supprimé
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
      const arrayTournament = req.body[0];
      const arrayStructure = req.body[1];
      let structuresCreated = {};

      // vérification que l'on reçoit des données Tournoi et Structure du FRONT
      if(!arrayStructure || !arrayTournament || arrayStructure.length < 1) {return res.status(401).json({ message: `Pas de données tournoi ou structure du FRONT !`})};

      // vérification des données obligatoires STRUCTURE et TOURNOI
      if(!arrayTournament.name || !arrayTournament.date || !arrayTournament.location || !arrayTournament.nb_players || !arrayTournament.speed || !arrayTournament.starting_stack || !arrayTournament.buy_in || !arrayTournament.cash_price || !arrayTournament.small_blind) { return res.status(401).json({ message: `Vérifier que toutes les informations obligatoires du tournoi soient correctement saisies !` });}

      for(const data of arrayStructure) {
        if(!data.stage || !data.small_blind || !data.big_blind) { 
          return res.status(401).json({ message: `Vérifier que toutes les informations obligatoires soient correctement saisies pour la structure du tournoi !` });
        }
      };

      //Recherche du USER
      const userId = parseInt(req.params.userId, 10);
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(401).json({ message: `l'utilisateur ${userId} n'a pas été trouvé !` })
      }

      // format des données
      arrayTournament.name = sanitizeHtml(arrayTournament.name);
      arrayTournament.comments = sanitizeHtml(arrayTournament.comments);

      arrayTournament.nb_players = parseInt(arrayTournament.nb_players, 10);
      arrayTournament.speed = parseInt(arrayTournament.speed, 10);
      arrayTournament.starting_stack = parseInt(arrayTournament.starting_stack, 10);
      arrayTournament.buy_in = parseInt(arrayTournament.buy_in, 10);
      arrayTournament.cash_price = parseInt(arrayTournament.cash_price, 10);
      arrayTournament.small_blind = parseInt(arrayTournament.small_blind, 10);

      //création du tournoi
      const newTournament = new Tournament({
        name: arrayTournament.name,
        date: arrayTournament.date,
        location: arrayTournament.location,
        nb_players: arrayTournament.nb_players,
        speed: arrayTournament.speed,
        starting_stack: arrayTournament.starting_stack,
        buy_in: arrayTournament.buy_in,
        cash_price: arrayTournament.cash_price,
        status: "prévu",
        comments: arrayTournament.comments,
        small_blind: arrayTournament.small_blind,
        chips_user: arrayTournament.chips_user,
        user_id: userId
      });

      const tournamentCreated = await newTournament.save();
      
      if (tournamentCreated.length === 0) {return res.status(401).json({message: 'aucun tournoi de créé !'});}

      const tournamentId = tournamentCreated.id;
      structuresCreated = await createStructure([tournamentId, arrayStructure]);

      res.status(201).json([tournamentCreated, structuresCreated]);

    } catch (error) {
      res.status(500).json({ message: `Server error, please contact an administrator` });
    }
  },
  
  // MODIFICATION D'UN TOURNOI
  updateTournament: async (req, res) => {

    try {
      const arrayTournament = req.body[0];
      const arrayStructure = req.body[1];
      const id = parseInt(req.params.id, 10);
      let smallBlindModified = false;
      let structuresCreated = {};

      // on vérirfie que le tournoi est en BDD
      const tournament = await Tournament.findByPk(id);
      if (!tournament) {
          return res.status(401).json({ message: `le tournoi ${id} n'a pas été trouvé !` });
      }

      // Vérification des données tournois non vides du FRONT ET que ce ne soit pas la STRUCTURE en premier objet
      if(!arrayTournament || arrayTournament.length > 1) {return res.status(401).json({message: 'Les données tournois sont ne sont pas cohérentes !'})}

      // vérification des données obligatoires du tournoi
      if(!arrayTournament.name || !arrayTournament.date || !arrayTournament.location || !arrayTournament.nb_players || !arrayTournament.speed || !arrayTournament.starting_stack || !arrayTournament.buy_in || !arrayTournament.cash_price || !arrayTournament.status || !arrayTournament.small_blind) { return res.status(401).json({ message: `Vérifier que toutes les informations obligatoires soient correctement saisies !` });}

      // si small_blind transmise différente de small_blind BDD alors besoin des données structures
      const smallBlindTournament = arrayTournament.small_blind;
      const smallBlindBdd = tournament.small_blind;
      if(smallBlindBdd != smallBlindTournament) {
        smallBlindModified = true;
        // Vérification des données structures non vides du FRONT
        if(!arrayStructure || arrayStructure.length === 0) {
          return res.status(401).json({message: 'Les données structures ne doivent pas être vides si la small_bind change !'})
        } else {
          // vérification des données obligatoires pour chaque ligne de structure du front
          for(structure of arrayStructure) {
            if(!structure.stage || !structure.small_blind || !structure.big_blind) {
              return res.status(401).json({ message: `Vérifier que toutes les informations obligatoires soient correctement saisies dans les structures !` });
            } else {
              structure.stage = parseInt(structure.stage, 10);
              structure.small_blind = parseInt(structure.small_blind, 10);
              structure.big_blind = parseInt(structure.big_blind, 10);
            }
          }
        }
      }

      // Formatage des données tournoi
      if(arrayTournament.name) {arrayTournament.name = sanitizeHtml(arrayTournament.name)};
      if(arrayTournament.comments) {arrayTournament.comments = sanitizeHtml(arrayTournament.comments)};

      if(arrayTournament.nb_players) {arrayTournament.nb_players = parseInt(arrayTournament.nb_players, 10)};
      if(arrayTournament.speed) {arrayTournament.speed = parseInt(arrayTournament.speed, 10)};
      if(arrayTournament.starting_stack) {arrayTournament.starting_stack = parseInt(arrayTournament.starting_stack, 10)};
      if(arrayTournament.buy_in) {arrayTournament.buy_in = parseInt(arrayTournament.buy_in, 10)};
      if(arrayTournament.small_blind) {arrayTournament.small_blind = parseInt(arrayTournament.small_blind, 10)};
      if(arrayTournament.cash_price) {arrayTournament.cash_price = parseInt(arrayTournament.cash_price, 10)};

      // Modification du tournoi
      const tournamentUpdated = await tournament.update(arrayTournament);

      // si mofdification de la small_blind on modifie la structure du tournois
      if(smallBlindModified) {
        structuresCreated = await createStructure([id, arrayStructure]);
      };
      
      res.status(201).json([tournamentUpdated, structuresCreated]);

    } catch (error) {
      res.status(500).json({ message: `Server error, please contact an administrator` });
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
