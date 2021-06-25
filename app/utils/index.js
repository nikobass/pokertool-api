const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Tournament, Structure, Cashprice } = require("../models");

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

async function createCashPrice(data) {

  try {
    const tournamentId = parseInt(data[0], 10);
    const cashPricesData = data[1];
    const cashPriceList = [];

    //Vérification que les données attendues soient préssentes et non vides
    if(!tournamentId || !cashPricesData)  {
      res.status(401).json({ message: `Pas d'identification du tournoi OU de données cash-price !` })
    }

    //Recherche du TOURNOI
    const tournament = await Tournament.findAll({where: {id: tournamentId}});
    if (!tournament) {
      return res.status(401).json({ message: `Aucun tournoi trouvé pour le tournoi : ${tournamentId} !` })
    }

    // Recherche et suppression des données CASH PRICE du tournoi en BDD
    const cashPricesBdd = await Cashprice.findAll({where: {tournament_id: tournamentId}});
    if(cashPricesBdd.length > 0) {
       await Cashprice.destroy({
         where: {tournament_id: tournamentId}
        });
    };     

    //création des cash-price
    for(cashPrice of cashPricesData) {
      const newCashPrice = new Cashprice({
        position: cashPrice.position,
        amount: cashPrice.amount,
        tournament_id: tournamentId
      });

      const cashPriceCreated = await newCashPrice.save();
      cashPriceList.push(cashPriceCreated)
    }

    return cashPriceList;
    
  } catch(error) {
      return res.status(401).send();
  }
};

async function verifMail(email) {
    var mailformat = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*$/;
    if(email.match(mailformat)) {return true} else {return false};
};

module.exports = { generateAccessToken, BcryptData, createStructure, createCashPrice, verifMail };
