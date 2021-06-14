const express = require('express');
const path = require('path');

// CONTROLLERS' IMPORT 
const authController = require('./controllers/mainController');
const chipController = require('./controllers/mainController');
const distributorController = require('./controllers/mainController');
const mainController = require('./controllers/mainController');
const profilController = require('./controllers/mainController');
const tournamentController = require('./controllers/mainController');

const router = express.Router();

// AUTHENTIFICATION + CONNEXION
// create user
router.post('/signup', authController.createUser);
// Données d'authentification du user
router.get('/signin', authController.getUser);
// reset password
router.get('/resetPassword/:token', authController.getResetPassword);
// modification du TOKEN
router.patch('/resetPassword/:token', authController.updateResetPassword);

// PROFIL
// user's profil
router.get('/profil/:userId', profilController.getProfil);
// delete
router.delete('/profil/:userId', profilController.deleteProfil);
// update
router.patch('/profil/:userId', profilController.updateProfil);

// TOURNAMENT
// tournaments' datas
router.get('/tournaments', tournamentController.getAllTournaments);
// create a tournament
router.post('/tournament', tournamentController.createTournament);
// tournament's datas
router.get('/tournament/:id', tournamentController.getOneTournament);
// update a tournament
router.patch('/tournament/:id', tournamentController.updateTournament);
// delete a tournament
router.delete('/tournament/:id', tournamentController.deleteTournament);
// tournament's user
router.get('timer/:tournamentId', tournamentController.getTimerTournament);

// CHIP
// user's chips
router.get('/chip/:userId', chipController.getChip);
// create user's chips
router.post('/chip/:userId', chipController.createChip);
// update user's chips
router.patch('/chip/:userId', chipController.updateChip);

// DISTRIBUTOR
// données distributor
router.get('/distributor/:tournamentId', distributor.getDistributor);
// modification distributor
router.patch('/distributor/:tournamentId', distributor.updateDistributor);

// ERROR 404
router.use(mainController.error404);

module.exports = router; 