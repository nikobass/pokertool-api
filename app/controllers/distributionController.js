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
  createDistributor: async (req, res) => {

    try {
      const arrayDistribution = req.body;
      const distributionList = [];

         // Verification du TOURNOI en BDD
      const tournamentId = parseInt(req.params.tournamentId);
      const tournament = await Tournament.findByPk(tournamentId);
      if (!tournament) {
        return res.status(401).json({ message: `Le tournoi ${tournamentId} n'a pas été trouvé !` });
      } 

      // vérification que les données DISTRIBUTION ne sont pas vides
      if(arrayDistribution.length === 0 ) {
        return res.status(401).json({message: `Les données de distribution ne doivent pas être vides !`});
      }
 
      // vérification des données obligatoires DISTRIBUTION du tournoi
      for(const data of arrayDistribution) {
        if(!data.color || !data.value || !data.quantity) { 
          return res
            .status(401)
            .json({ message: `Vérifier que toutes les informations obligatoires soient correctement saisies pour la distribution !` });
        }
      };

      // Recherche et suppression des données DISTRIBUTOR du tournoi
      const chipsDistributor = await Distribution.findAll({where: {tournament_id: tournamentId}});
      if(chipsDistributor.length > 0) {
         await Distribution.destroy({
           where: {tournament_id: tournamentId}
          });
      };     

      // Création du DISTRIBUTOR avec données FRONT
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

      // Réponse = DISTRIBUTOR et STRUCTURE du TOURNOI dans la BDD
      res.status(200).json(distributionList);

    } catch (error) {
      res.status(500).json({ message: `Server error, please contact an administrator` });
    }
  },
};

module.exports = distributionController;
