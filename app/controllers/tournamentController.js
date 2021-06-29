const { Tournament, User, Structure } = require("../models");
const { createStructure, createCashPrice } = require("../utils");
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
      include: [
        { association: 'cashprices'},
      ]
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
      const tournament = await Tournament.findByPk(tournamentId,
        {
        include: [
          { association: 'cashprices'},
        ]});
      
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
      const arrayCashPrice = req.body[2];
      let structuresCreated = [];
      let cashPriceCreated = [];

      // vérification que l'on reçoit des données Tournoi, Structure et Cashprice du FRONT
      if(!arrayStructure || !arrayTournament || !arrayCashPrice) {return res.status(401).json({ message: `Pas de données tournoi, structure ou cash-price !`})};

      // vérification des données TOURNOI
      if(!arrayTournament.name || !arrayTournament.date || !arrayTournament.location || !arrayTournament.nb_players || !arrayTournament.speed || !arrayTournament.starting_stack || !arrayTournament.buy_in || !arrayTournament.small_blind) { return res.status(401).json({ message: `Vérifier que toutes les informations obligatoires du tournoi soient correctement saisies !` });}
      
      arrayTournament.name = sanitizeHtml(arrayTournament.name);
      arrayTournament.comments = sanitizeHtml(arrayTournament.comments);

      arrayTournament.nb_players = parseInt(arrayTournament.nb_players, 10);
      if(isNaN(arrayTournament.nb_players)) {return res.status(401).json({ message: `Le nombre de joueurs n'est pas un nombre !` })};

      arrayTournament.speed = parseInt(arrayTournament.speed, 10);
      if(isNaN(arrayTournament.speed)) {return res.status(401).json({ message: `La durée des étapes n'est pas un nombre !`})};

      arrayTournament.starting_stack = parseInt(arrayTournament.starting_stack, 10);
      if(isNaN(arrayTournament.starting_stack)) {return res.status(401).json({ message: `Le tapis de départ n'est pas un nombre !`})};

      arrayTournament.buy_in = parseInt(arrayTournament.buy_in, 10);
      if(isNaN(arrayTournament.buy_in)) {return res.status(401).json({ message: `Le buy-in n'est pas un nombre !`})};

      arrayTournament.small_blind = parseInt(arrayTournament.small_blind, 10);
      if(isNaN(arrayTournament.small_blind)) {return res.status(401).json({ message: `Là petite blind n'est pas un nombre !`})};

      // vérification des données STRUCTURE
      for(const data of arrayStructure) {
        
        if(!data.stage || !data.small_blind || !data.big_blind) { 
          return res.status(401).json({ message: `Vérifier que toutes les informations obligatoires soient correctement saisies pour la structure du tournoi !` });
        }

        data.stage = parseInt(data.stage, 10);
        if(isNaN(data.stage)) {return res.status(401).json({ message: `L'une des valeurs des étapes de structures n'est pas un nombre !` })};

        data.small_blind = parseInt(data.small_blind, 10);
        if(isNaN(data.small_blind )) {return res.status(401).json({ message: `L'une des valeurs de la petite blind n'est pas un nombre !` })};

        data.big_blind = parseInt(data.big_blind, 10);
        if(isNaN(data.big_blind)) {return res.status(401).json({ message: `L'une des valeurs de la grosse blind n'est pas un nombre !` })};
      };

      // vérification des données CASHPRICE
      for(const cashPrice of arrayCashPrice) {
        
        if(!cashPrice.position || !cashPrice.amount || cashPrice.position <=0 || cashPrice.amount <= 0) { 
          return res.status(401).json({ message: `Vérifier que toutes les informations obligatoires soient correctement saisies pour le cash-price du tournoi !` });
        }
        cashPrice.position = parseInt(cashPrice.position, 10);
        if(isNaN(cashPrice.position)) {return res.status(401).json({ message: `L'une des valeurs des positions du cash-price n'est pas un nombre !` })};

        cashPrice.amount = parseInt(cashPrice.amount, 10);
        if(isNaN(cashPrice.amount)) {return res.status(401).json({ message: `L'une des valeurs des montants du cash-price n'est pas un nombre !` })};
      };

      //Recherche du USER
      const userId = parseInt(req.params.userId, 10);
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(401).json({ message: `l'utilisateur ${userId} n'a pas été trouvé !` })
      }

      //création du tournoi
      const newTournament = new Tournament({
        name: arrayTournament.name,
        date: arrayTournament.date,
        location: arrayTournament.location,
        nb_players: arrayTournament.nb_players,
        speed: arrayTournament.speed,
        starting_stack: arrayTournament.starting_stack,
        buy_in: arrayTournament.buy_in,
        status: "prévu",
        comments: arrayTournament.comments,
        small_blind: arrayTournament.small_blind,
        chips_user: arrayTournament.chips_user,
        user_id: userId
      });

      //enregistrement du tournoi
      const tournamentCreated = await newTournament.save();
      if (tournamentCreated.length === 0) {return res.status(401).json({message: 'aucun tournoi de créé !'});}

      const tournamentId = tournamentCreated.id;
      
      // création de la structure du tournoi
      structuresCreated = await createStructure([tournamentId, arrayStructure]);
      if (structuresCreated.length === 0) {return res.status(401).json({message: 'aucune structure de créée !'});}

      // création du cash-price du tournoi
      cashPriceCreated = await createCashPrice([tournamentId, arrayCashPrice]);
      if (cashPriceCreated.length === 0) {return res.status(401).json({message: 'aucun cash-price de créé !'});}
      
      // envoie de la réponse
      res.status(201).json([tournamentCreated, structuresCreated, cashPriceCreated]);

    } catch (error) {
      res.status(500).json({ message: `Server error, please contact an administrator` });
    }
  },
  
  // MODIFICATION D'UN TOURNOI
  updateTournament: async (req, res) => {

    try {
      const arrayTournament = req.body[0];
      const arrayStructure = req.body[1];
      const arrayCashPrice = req.body[2];
      const id = parseInt(req.params.id, 10);
      let smallBlindModified = false;
      let structuresCreated = [];
      let cashPriceCreated= [];

      // on vérirfie que le tournoi est en BDD
      const tournament = await Tournament.findByPk(id);
      if (!tournament) {
          return res.status(401).json({ message: `le tournoi ${id} n'a pas été trouvé !` });
      }

     // vérification que l'on reçoit des données Tournoi, Structure et Cashprice du FRONT
     if(!arrayStructure || !arrayTournament || !arrayCashPrice) {return res.status(401).json({ message: `Pas de données tournoi, structure ou cash-price !`})};

      // vérification des données obligatoires du tournoi
      if(!arrayTournament.name || !arrayTournament.date || !arrayTournament.location || !arrayTournament.nb_players || !arrayTournament.speed || !arrayTournament.starting_stack || !arrayTournament.buy_in || !arrayTournament.status || !arrayTournament.small_blind) { return res.status(401).json({ message: `Vérifier que toutes les informations obligatoires du tournoi soient correctement saisies !` });};

       arrayTournament.name = sanitizeHtml(arrayTournament.name);
       arrayTournament.comments = sanitizeHtml(arrayTournament.comments);
 
       arrayTournament.nb_players = parseInt(arrayTournament.nb_players, 10);
       if(isNaN(arrayTournament.nb_players)) {return res.status(401).json({ message: `Le nombre de joueurs n'est pas un nombre !` })};
 
       arrayTournament.speed = parseInt(arrayTournament.speed, 10);
       if(isNaN(arrayTournament.speed)) {return res.status(401).json({ message: `La durée des étapes n'est pas un nombre !`})};
 
       arrayTournament.starting_stack = parseInt(arrayTournament.starting_stack, 10);
       if(isNaN(arrayTournament.starting_stack)) {return res.status(401).json({ message: `Le tapis de départ n'est pas un nombre !`})};
 
       arrayTournament.buy_in = parseInt(arrayTournament.buy_in, 10);
       if(isNaN(arrayTournament.buy_in)) {return res.status(401).json({ message: `Le buy-in n'est pas un nombre !`})};
 
       arrayTournament.small_blind = parseInt(arrayTournament.small_blind, 10);
       if(isNaN(arrayTournament.small_blind)) {return res.status(401).json({ message: `Là petite blind n'est pas un nombre !`})};

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
              if(isNaN(structure.stage)) {return res.status(401).json({ message: `L'une des valeurs des étapes de structures n'est pas un nombre !` })};

              structure.small_blind = parseInt(structure.small_blind, 10);
              if(isNaN(structure.small_blind )) {return res.status(401).json({ message: `L'une des valeurs de la petite blind n'est pas un nombre !` })};

              structure.big_blind = parseInt(structure.big_blind, 10);
              if(isNaN(structure.big_blind)) {return res.status(401).json({ message: `L'une des valeurs de la grosse blind n'est pas un nombre !` })};
            }
          }
        }
      }

      // Modification du tournoi
      const tournamentUpdated = await tournament.update(arrayTournament);

      // si mofdification de la small_blind on modifie la structure du tournois
      if(smallBlindModified) {
        structuresCreated = await createStructure([id, arrayStructure]);
      };
      
      // création du cash-price du tournoi
      cashPriceCreated = await createCashPrice([id, arrayCashPrice]);
      if (cashPriceCreated.length === 0) {return res.status(401).json({message: 'aucun cash-price de créé !'});}

      res.status(201).json([tournamentUpdated, structuresCreated, cashPriceCreated]);

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
        include: [
          {association: 'cashprices'},
          {association: 'Structures'},
          {association: 'user',
           include: [{association: 'chips'}]}
        ]
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
