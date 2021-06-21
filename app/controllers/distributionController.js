const { Distribution, Tournament, Structure } = require("../models");

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
      const arrayDistribution = req.body[0];
      const arrayStructure = req.body[1];
      const distributionList = [];
      const structureList = [];

      // vérification que les données DISTRIBUTION et STRUCTURE ne soient pas vides
      if(arrayDistribution.length === 0 || arrayStructure.length === 0) {
        return res.status(401).json({message: `Les données de distribution ou de structure ne doivent pas être vides !`});
    }

      // Recherche du TOURNOI
      const tournamentId = parseInt(req.params.tournamentId);
      const tournament = await Tournament.findByPk(tournamentId);
      if (!tournament) {
        return res.status(401).json({ message: `Le tournoi ${tournamentId} n'a pas été trouvé !` });
      } 

      // vérification des données obligatoires DISTRIBUTION et STRUCTURE du tournoi
      for(const data of arrayDistribution) {
        if(!data.color || !data.value || !data.quantity) { 
          return res
            .status(401)
            .json({ message: `Vérifier que toutes les informations obligatoires soient correctement saisies pour la distribution !` });
        }
      };

      for(const data of arrayStructure) {
        if(!data.stage || !data.small_blind || !data.big_blind) { 
          return res
            .status(401)
            .json({ message: `Vérifier que toutes les informations obligatoires soient correctement saisies pour la structure du tournoi !` });
        }
      };

      // Recherche et suppression des données DISTRIBUTOR et STRUCTURE du tournoi
      const chipsDistributor = await Distribution.findAll({where: {tournament_id: tournamentId}});
      if(chipsDistributor.length > 0) {
         await Distribution.destroy({
           where: {tournament_id: tournamentId}
          });
      };     

        const structures = await Structure.findAll({where: {tournament_id: tournamentId}});
        if(structures.length > 0) {
            await Structure.destroy({
              where: {tournament_id: tournamentId}
            });
        };  
        //return;

      // Création du DISTRIBUTOR avec donnée FRONT
      for(const dataDistribution of arrayDistribution) {
        dataDistribution.value = parseInt(dataDistribution.value, 10);
        dataDistribution.quantity = parseInt(dataDistribution.quantity, 10);

        //création des CHIPS
        const newChipsDistributor = await Distribution.create({
          quantity: dataDistribution.quantity,
          color: dataDistribution.color,
          value: dataDistribution.value,
          tournament_id: tournamentId
        });

        distributionList.push(newChipsDistributor);
      };

      // Création de la STRUCTURE avec donnée FRONT
      for(const data of arrayStructure) {
        data.stage = parseInt(data.stage, 10);
        data.small_blind = parseInt(data.small_blind, 10);
        data.big_blind = parseInt(data.big_blind, 10);

        const newStructure = await Structure.create({
          stage: data.stage,
          small_blind: data.small_blind,
          big_blind: data.big_blind,
          tournament_id: tournamentId
        });
      
        structureList.push(newStructure);
      };

      // Réponse = DISTRIBUTOR et STRUCTURE du TOURNOI dans la BDD
      res.status(200).json([distributionList, structureList]);

    } catch (error) {
      res.status(500).json({ message: `Server error, please contact an administrator` });
    }
  },

};

module.exports = distributionController;
