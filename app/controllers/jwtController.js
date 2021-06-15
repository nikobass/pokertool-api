const { User } = require("../models");

const jwtController = {

    test: async (req, res) => {
        try {
         
      
         res.status(201).json("toto");
        } catch (error) {
         //console.trace(error);
         res
          .status(500)
          .json({ error: `Server error, please contact an administrator` });
        }
       },
  

};

module.exports = jwtController;