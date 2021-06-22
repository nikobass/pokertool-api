  // CREATION D'UNE STRUCTURE TOURNOI
  const { Tournament, Structure } = require("../models");

  exports.createStructure = async function(req, res, next) {

    try {
      const tournamentId = parseInt(req[0], 10);
      const structuresData = req[1];

      //Vérification que les données attendues soient préssentes et non vides
      if(!tournamentId || !structuresData)  {
        res.status(401).json({ message: `Pas d'identification du tournoi OU de données structures présentes !` })
      }

      //Recherche du TOURNOI
      const tournament = await Tournament.findAll({where: {id: tournamentId}});
      if (!tournament) {
        return res.status(401).json({ message: `Aucun tournoi trouvé pour le tournoi : ${tournamentId} !` })
      }

      //Vérification des données Structures obligatoires
      for(structure of structuresData) {
        // vérification des données obligatoires
        if(!structure.stage || !structure.small_blind || !structure.big_blind) { return res.status(401).json({ message: `Vérifier que toutes les informations structures obligatoires soient correctement saisies !` });}
      }

      // Recherche et suppression des données STRUCTURE du tournoi en BDD
      const structuresBdd = await Structure.findAll({where: {tournament_id: tournamentId}});
      if(structuresBdd.length > 0) {
         await Structure.destroy({
           where: {tournament_id: tournamentId}
          });
      };     
      
      //création de la strusture
      for(structure of structuresData) {
        const newStructure = new Structure({
          stage: structure.stage,
          small_blind: structure.small_blind,
          big_blind: structure.big_blind,
          tournament_id: tournamentId
        });

        const structureCreated = await newStructure.save();
      }
      
      next;
      
    } catch(error) {
        return res.status(401).send();
    }
  };