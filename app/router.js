const express = require('express');
const path = require('path');

// IMPORT DES CONTROLLERS
const mainController = require('./controllers/mainController');

const router = express.Router();

// LES ROUTES et leur actions
// exemple : 
//router.route('/lists/:id')
//    .get(listController.getOneList)
//    .patch(listController.updateList)
//    .delete(listController.deleteList);

router.get('/', (_, response) => {
    console.log("COUCOU !");
});

router.use(mainController.error404);

module.exports = router;