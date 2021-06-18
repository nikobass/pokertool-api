const { Chip, User } = require("../models");
<<<<<<< HEAD
const sanitizeHtml = require('sanitize-html');


const chipController = {
 
 // RECUPERATION DU CHIP POUR UN USER
 getChip: async (req, res) => {
    try {
      // Recherche du USER
      const userId = parseInt(req.params.userId);
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(401).json({ message: `L'utilisateur ${userId} n'a pas été trouvé !` });
      } 

      // Recherche du CHIP
      const chip = await Chip.findAll({where: {user_id: userId}});
      if(chip) {
          res.status(200).json(chip);
      } else {
        res.status(401).json({ message: `Pas de jetons trouvés pour l'utilisateur ${userId} !` });
      }

    } catch (err) {
      res.status(500).json({ message: `Server error, please contact an administrator` });
    }
  },

=======

const chipController = {
 
 
>>>>>>> a31a49f94c9369d6075a89bd7c5c83059a937c3f
};

module.exports = chipController;
