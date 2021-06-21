const { Tournament, Structure } = require("../models");

const structureController = {
 
 // RECUPERATION DE LA STRUCTURE D'UN TOURNOI
 getStructure: async (req, res) => {
    try {
      // Recherche du TOURNOI
      const tournamentId = parseInt(req.params.tournamentId);
      const tournament = await Tournament.findByPk(tournamentId);
      if (!tournament) {
        return res.status(401).json({ message: `Le tournoi ${tournamentId} n'a pas été trouvé !` });
      } 

      // Recherche des STRUCTURES

      const structures = await Structure.findAll({where: {tournament_id: tournamentId}});
      if(structures.length > 0) {
        res.status(200).json(structures);
      } else{
        res.status(401).json({ message: `Pas de structure de tournoi trouvé pour le tournoi ${tournamentId} !` });
      }

    } catch (err) {
      res.status(500).json({ message: `Server error, please contact an administrator` });
    }
  },
};

module.exports = structureController;
