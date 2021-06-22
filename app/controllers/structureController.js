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

    } catch (error) {
      res.status(500).json({ message: `Server error, please contact an administrator` });
    }
  },

  // // CREATION D'UNE STRUCTURE TOURNOI
  // createStructure: async (req, res) => {

  //   try {
  //     const tournamentId = parseInt(req.body[0], 10);
  //     const structuresData = req.body[1];
  //     const structuresCreated = [];

  //     //Vérification que les données attendues soient préssentes et non vides
  //     if(!tournamentId || structuresData.length === 0)  {
  //       res.status(401).json({ message: `Pas d'identification du tournoi OU de données structures présentes !` })
  //     }

  //     //Recherche du TOURNOI
  //     const tournament = await Tournament.findAll({where: {tournament_id: tournamentId}});
  //     if (!tournament) {
  //       return res.status(401).json({ message: `Aucun tournoi trouvé pour le tournoi : ${tournamentId} !` })
  //     }

  //     for(structure of structuresData) {
  //       // vérification des données obligatoires
  //       if(!structure.stage || !structure.small_blind || !structure.big_blind) { return res.status(401).json({ message: `Vérifier que toutes les informations structures obligatoires soient correctement saisies !` });}

  //       //création de la strusture
  //       const newStructure = new Structure({
  //         stage: structure.name,
  //         small_blind: structure.date,
  //         big_blind: structure.location,
  //         tournament_id: tournamentId
  //       });

  //       const structureCreated = await newStructure.save();

  //       structuresCreated.push(structureCreated);
  //     }
      
  //       // reponse : liste des structures
  //       res.status(200).json([tournamentId, structuresCreated ])
      
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .json({ message: `Server error, please contact an administrator` });
  //   }
  // },
};

module.exports = structureController;
