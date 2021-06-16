const express = require('express');

// test JWT
const { auth } = require('./middleware/auth');
const jwtController = require('./controllers/jwtController');

// CONTROLLERS' IMPORT 
const authController = require('./controllers/authController');
const chipController = require('./controllers/chipController');
const distributionController = require('./controllers/distributionController');
const mainController = require('./controllers/mainController');
const profilController = require('./controllers/profilController');
const tournamentController = require('./controllers/tournamentController');

const router = express.Router();

// test JWT
router.post('/test', auth, jwtController.test);

// AUTHENTIFICATION + CONNEXION
// Données d'authentification du user
router.post('/signin', authController.authUser);
// reset password
//router.get('/resetPassword/:token', authController.getResetPassword);
// modification du TOKEN
//router.patch('/resetPassword/:token', authController.updateResetPassword);

// PROFIL
// create user
router.post('/signup', profilController.createUser);
// ==> user's profil
//router.get('/profil/:userId', profilController.getProfil);
// delete
router.delete('/profil/:userId', profilController.deleteProfil);
// update
//router.patch('/profil/:userId', profilController.updateProfil);

// TOURNAMENT
// tournaments' datas
//router.get('/tournaments', tournamentController.getAllTournaments);
// create a tournament
//router.post('/tournament', tournamentController.createTournament);
// tournament's datas
//router.get('/tournament/:id', tournamentController.getOneTournament);
// update a tournament
//router.patch('/tournament/:id', tournamentController.updateTournament);
// delete a tournament
//router.delete('/tournament/:id', tournamentController.deleteTournament);
// tournament's user
//router.get('timer/:tournamentId', tournamentController.getTimerTournament);

// CHIP
// user's chips
//router.get('/chip/:userId', chipController.getChip);
// create user's chips
//router.post('/chip/:userId', chipController.createChip);
// update user's chips
//router.patch('/chip/:userId', chipController.updateChip);

// DISTRIBUTOR
// données distributor
//router.get('/distributor/:tournamentId', distributionController.getDistributor);
// modification distributor
//router.patch('/distributor/:tournamentId', distributionController.updateDistributor);

// ERROR 404
router.use(mainController.error404);

module.exports = router; 