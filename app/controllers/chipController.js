const { Chip, User } = require("../models");

const chipController = {
 
 // RECUPERATION DES CHIPS POUR UN USER
 getChips: async (req, res) => {
    try {
      // Recherche du USER
      const userId = parseInt(req.params.userId);
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(401).json({ message: `L'utilisateur ${userId} n'a pas été trouvé !` });
      } 

      // Recherche des CHIPS
      const chips = await Chip.findAll({where: {user_id: userId}});
      if(chips.length > 0) {
        res.status(200).json(chips);
      } else{
        res.status(401).json({ message: `Pas de jetons trouvés pour l'utilisateur ${userId} !` });
      }

    } catch (err) {
      res.status(500).json({ message: `Server error, please contact an administrator` });
    }
  },

  // CREATION / MODIFICATION DES CHIPS POUR UN USER
  fillUserChips: async (req, res) => {

    try {
      const arrayData = req.body;

      // Vérification du USER
      const userId = parseInt(req.params.userId, 10);
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(401).json({ message: `l'utilisateur ${userId} n'a pas été trouvé !` })
      };

      // vérification des données obligatoires
      for(const data of arrayData) {
        if(!data.color || !data.value || !data.quantity) { 
          return res.status(401).json({ message: `Vérifier que toutes les données ne soient pas nulles !` });
        }
        data.value = parseInt(data.value, 10);
        if(isNaN(data.value)) {return res.status(401).json({ message: `L'une des valeurs de jetons n'est pas un nombre !` })};
        
        data.quantity = parseInt(data.quantity, 10);
        if(isNaN(data.quantity)) {return res.status(401).json({ message: `L'une des quantité de jetons n'est pas un nombre !` })};
      };

      // Recherche des CHIPS du USER et SUPPRESSION de ces CHIPS
      const chips = await Chip.findAll({where: {user_id: userId}});
      if(chips.length > 0) {
         await Chip.destroy({
           where: {user_id: userId}
          });
      };

      //création des CHIPS
      for(const data of arrayData) {
        const newChip = new Chip({
          quantity: data.quantity,
          color: data.color,
          value: data.value,
          user_id: userId
        });
        await newChip.save();
      }

      // Réponse = CHIPS du USER dans la BDD
      const chipsUser = await Chip.findAll({where: {user_id: userId}});
      if(chipsUser.length > 0) {
        res.status(200).json(chipsUser);

      }else {
        res.status(400).json({ message: `aucun jeton de créé !` });
      }

    } catch (error) {
      res.status(500).json({ message: `Server error, please conta'ct' an administrator` });
    }
  },
};

module.exports = chipController;
