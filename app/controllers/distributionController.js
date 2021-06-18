const { Distribution, Tournament } = require("../models");

const distributionController = {
 
 // RECUPERATION DU DISTRIBUTOR POUR UN TOURNOI
 getDistributor: async (req, res) => {
    try {
      // Recherche du TOURNOI
      const tournamentId = parseInt(req.params.tournamentId);
      const tournament = await Tournament.findByPk(tournamentId);
      if (!tournament) {
        return res.status(401).json({ message: `Le tournoi ${tournamentId} n'a pas été trouvé !` });
      } 

      // Recherche du DISTRIBUTOR
      const chipsDistributor = await Distribution.findAll({where: {tournament_id: tournamentId}});
      if(chipsDistributor.length > 0) {
        res.status(200).json(chipsDistributor);
      } else {
         res.status(401).json({ message: `Pas de jetons distribué pour le tournoi ${tournamentId} !` });
      }

    } catch (err) {
      res.status(500).json({ message: `Server error, please contact an administrator` });
    }
  },

  // CREATION / MODIFICATION DU DISTRIBUTOR POUR UN TOURNOI
  fillTournamentDistributor: async (req, res) => {

    try {
      const arrayData = req.body;

      // Recherche du TOURNOI
      const tournamentId = parseInt(req.params.tournamentId);
      const tournament = await Tournament.findByPk(tournamentId);
      if (!tournament) {
        return res.status(401).json({ message: `Le tournoi ${tournamentId} n'a pas été trouvé !` });
      } 

      // vérification des données obligatoires
      for(const data of arrayData) {
        if(!data.color || !data.value || !data.quantity) { 
          return res
            .status(401)
            .json({ message: `Vérifier que toutes les informations obligatoires soient correctement saisies !` });
        }
      };

      // Recherche du DISTRIBUTOR ET SUPPRESSION
      const chipsDistributor = await Distribution.findAll({where: {tournament_id: tournamentId}});
      if(chipsDistributor.length > 0) {
         await Distribution.destroy({
           where: {tournament_id: tournamentId}
          });
      };     

      // Création du DISTRIBUTOR avec donnée FRONT
      for(const data of arrayData) {
        data.value = parseInt(data.value, 10);
        data.quantity = parseInt(data.quantity, 10);

        //création des CHIPS
        const newChipsDistributor = new Distribution({
          quantity: data.quantity,
          color: data.color,
          value: data.value,
          tournament_id: tournamentId
        });

        await newChipsDistributor.save();
      }

      // Réponse = DISTRIBUTOR du TOURNOI dans la BDD
      const tournamentDistributor = await Distribution.findAll({where: {tournament_id: tournamentId}});
      if(tournamentDistributor.length > 0) {
        res.status(200).json(tournamentDistributor);
      }else {
        res.status(400).json({ message: `aucune distribution de jetons de créée !` });
      }

    } catch (error) {
      res.status(500).json({ message: `Server error, please contact an administrator` });
    }
  },

};

module.exports = distributionController;
