const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Tournament, Structure } = require("../models");

function generateAccessToken(userId) {
 // 86400 s = 24h
 return jwt.sign(userId, process.env.TOKEN_SECRET, {
  expiresIn: process.env.TOKEN_LIFE,
 });
}

function BcryptData(data) {
 const salt = bcrypt.genSaltSync(10);
 const pwdCrypted = bcrypt.hashSync(data, salt);
 return pwdCrypted;
}

async function createStructure(data) {

    try {
      const tournamentId = parseInt(data[0], 10);
      const structuresData = data[1];
      const structureList = [];

      //Vérification que les données attendues soient préssentes et non vides
      if(!tournamentId || !structuresData)  {
        res.status(401).json({ message: `Pas d'identification du tournoi OU de données structures présentes !` })
      }

      //Recherche du TOURNOI
      const tournament = await Tournament.findAll({where: {id: tournamentId}});
      if (!tournament) {
        return res.status(401).json({ message: `Aucun tournoi trouvé pour le tournoi : ${tournamentId} !` })
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
        structureList.push(structureCreated)
      }

      return structureList;
      
    } catch(error) {
        return res.status(401).send();
    }
};

module.exports = { generateAccessToken, BcryptData, createStructure };
