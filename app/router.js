const express = require('express');

// test JWT
const { auth } = require('./middleware/auth');

// CONTROLLERS' IMPORT 
const authController = require('./controllers/authController');
const chipController = require('./controllers/chipController');
const distributionController = require('./controllers/distributionController');
const mainController = require('./controllers/mainController');
const profilController = require('./controllers/profilController');
const tournamentController = require('./controllers/tournamentController');

const router = express.Router();

// AUTHENTIFICATION + CONNEXION
// Données d'authentification du user
router.post('/signin', authController.authUser);
// reset password
//router.get('/resetPassword/:email', authController.getResetPassword);
//On alimente le key_password
router.patch('/resetPassword/add/:email', authController.addResetPassword);
// On supprime le key_password
router.patch('/resetPassword/delete/:email', authController.deleteResetPassword);

// PROFIL ====> penser à remettre la verif TOKEN ===> AUTH
// create user
router.post('/signup', profilController.createUser);
// ==> user's profil
router.get('/profil/:userId', profilController.getProfil);
// delete
router.delete('/profil/:userId', auth, profilController.deleteProfil);
// update
router.patch('/profil/:userId', profilController.updateProfil);

// TOURNAMENT  ====> penser à remettre la verif TOKEN ===> AUTH
// Tous les tournois d'un utilisteur
router.get('/tournaments/:userId', tournamentController.getAllTournaments);
// Créer un tournoi pour un utilisteur
router.post('/tournament/:userId', tournamentController.createTournament);
// Un tournoi pour un utilisteur
router.get('/tournament/:id', tournamentController.getOneTournament);
// update un tournoi
router.patch('/tournament/:id', tournamentController.updateTournament);
// Supprimer un tournoi
router.delete('/tournament/:id', tournamentController.deleteTournament);
// Timer d'un tournoi
//router.get('timer/:tournamentId', tournamentController.getTimerTournament);

// CHIP
// user's chips
router.get('/chip/:userId', chipController.getChip);
// create user's chips
//router.post('/chip/:userId', chipController.createChip);
// update user's chips
//router.patch('/chip/:userId', chipController.updateChip);chip

// DISTRIBUTOR
// données distributor
//router.get('/distributor/:tournamentId', distributionController.getDistributor);
// modification distributor
//router.patch('/distributor/:tournamentId', distributionController.updateDistributor);

// ERROR 404
router.use(mainController.error404);

module.exports = router; 
