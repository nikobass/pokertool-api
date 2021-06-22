BEGIN;

INSERT INTO "user" ("id", "user_name", "email", "password") VALUES
(1, 'Yann', 'yanne@at.fr', '$2b$10$d6pBCdawfZu4SbgGTg6Ei.CGBROLQnxzE0IfswQ.qWJ80pVX1xCLS'),
(2, 'Noë', 'noe@at.fr', '$2b$10$d6pBCdawfZu4SbgGTg6Ei.CGBROLQnxzE0IfswQ.qWJ80pVX1xCLS'),
(3, 'Etienne', 'etiennes@at.fr', '$2b$10$d6pBCdawfZu4SbgGTg6Ei.CGBROLQnxzE0IfswQ.qWJ80pVX1xCLS');

INSERT INTO "tournament" ("id", "name", "date", "location", "nb_players", "speed", "starting_stack", "buy_in", "cash_price", "status", "small_blind", "chips_user", "comments", "user_id") VALUES
(1, 'Tournoi 1', '2021-06-13T11:00:11.832Z', 'Chez Yann', 6, 20, 1500, 0, 190, 'terminé', 10, false, '', 1),
(2, 'Tournoi 2', '2021-04-17T20:30:00.832Z', 'Chez Yann ou chez françoise', 8, 15, 2000, 10, 170, 'terminé', 10, false, '', 1),
(3, 'Tournoi 3', '2021-07-31T19:30:00.832Z', 'Chez Yann', 6, 25, 3000, 20, 90, 'prévu', 10, false, 'ici je mets mon commentaire du tournoi 3 pour ne pas oublier qque chose', 1),
(4, 'Tournoi 4', '2021-11-27T20:00:00.832Z', '22 rue Charles de Gaulle, 33720 Bordeaux', 10, 30, 1250, 10, 0, 'prévu', 10, false, 'ici je mets mon commentaire du tournoi 4 pour ne pas oublier qque chose', 1),
(5, 'Tournoi 5', '2021-08-07T19:30:00.832Z', 'Casino Royal, 18 rue de la Marne, 45000 Orléans', 6, 25, 3000, 20, 190, 'prévu', 10, true, 'ici je mets mon commentaire du tournoi 5 pour ne pas oublier qque chose', 1),
(6, 'Tournoi 6', '2021-08-14T18:00:00.832Z', 'Chez Yann', 10, 30, 1250, 10, 350, 'prévu', 10, false, 'ici je mets mon commentaire du tournoi 6 pour ne pas oublier qque chose', 1),
(7, 'Tournoi 7', '2021-09-11T19:00:00.832Z', 'Chez Yann', 6, 25, 3000, 20, 0, 'prévu', 10, true, 'ici je mets mon commentaire du tournoi 7 pour ne pas oublier qque chose', 1),
(8, 'Tournoi 8', '2021-09-25T19:00:00.832Z', 'Chez Yann', 10, 30, 1250, 10, 540, 'prévu', 10, false, 'ici je mets mon commentaire du tournoi 8 pour ne pas oublier qque chose', 1);

INSERT INTO "structure" ("id", "stage", "small_blind", "big_blind", "tournament_id") VALUES
(1, 1, 10, 20, 1),
(2, 2, 20, 40, 1),
(3, 3, 40, 80, 1),
(4, 4, 80, 160, 1),
(5, 5, 160, 320, 1),
(6, 6, 320, 640, 1),
(7, 7, 640, 1280, 1),
(8, 8, 1280, 2560, 1),
(9, 9, 2560, 5120, 1),
(10, 1, 10, 20, 2),
(11, 2, 20, 40, 2),
(12, 3, 40, 80, 2),
(13, 4, 80, 160, 2),
(14, 5, 160, 320, 2),
(15, 6, 320, 640, 2),
(16, 7, 640, 1280, 2),
(17, 8, 1280, 2560, 2),
(18, 9, 2560, 5120, 2);

INSERT INTO "chip" ("id", "quantity", "color", "value", "user_id") VALUES
(1, 50, '#dddddd', 10, 1),
(2, 50, '#00b0ff', 20, 1),
(3, 50, '#789f30', 50, 1),
(4, 50, '#cec56c', 100, 1),
(5, 50, '#212121', 1000, 1);

INSERT INTO "distribution" ("id", "quantity", "color", "value", "tournament_id") VALUES
(1, 30, '#dddddd',10, 1),
(2, 20, '#00b0ff', 20, 1),
(3, 20, '#789f30', 50, 1),
(4, 20, '#cec56c', 100, 1),
(5, 10, '#212121', 1000, 1),
(6, 30, '#dddddd', 10, 2),
(7, 20, '#00b0ff', 20, 2),
(8, 20, '#789f30', 50, 2),
(9, 20, '#cec56c', 100, 2),
(10, 10, '#212121', 1000, 2),
(11, 30, '#dddddd', 10, 3),
(12, 20, '#00b0ff', 20, 3),
(13, 20, '#789f30', 50, 3),
(14, 20, '#cec56c', 100, 3),
(15, 10, '#212121', 1000, 3),
(16, 30, '#dddddd', 10, 4),
(17, 20, '#00b0ff', 20, 4),
(18, 20, '#789f30', 50, 4),
(19, 20, '#cec56c', 100, 4),
(20, 10, '#212121', 1000, 4),
(21, 30, '#dddddd', 10, 5),
(22, 20, '#00b0ff', 20, 5),
(23, 20, '#789f30', 50, 5),
(24, 20, '#cec56c', 100, 5),
(25, 10, '#212121', 1000, 5),
(26, 30, '#dddddd', 10, 6),
(27, 20, '#00b0ff', 20, 6),
(28, 20, '#789f30', 50, 6),
(29, 20, '#cec56c', 100, 6),
(30, 10, '#212121', 1000, 6),
(31, 30,'#dddddd',  10, 7),
(32, 20, '#00b0ff', 20, 7),
(33, 20, '#789f30', 50, 7),
(34, 20, '#cec56c', 100, 7),
(35, 10, '#212121', 1000, 7),
(36, 30, '#dddddd', 10, 8),
(37, 20, '#00b0ff', 20, 8),
(38, 20, '#789f30', 50, 8),
(39, 20, '#cec56c', 100, 8),
(40, 10, '#212121', 1000, 8);

INSERT INTO "cashprice" ("id", "position", "amount", "tournament_id") VALUES
(1, 1, 100, 1),
(2, 2, 70, 1),
(3, 3, 20, 1),
(4, 1, 100, 2),
(5, 2, 70, 2),
(6, 1, 70, 3),
(7, 2, 20, 3),
(8, 1, 100, 5),
(9, 2, 70, 5),
(10, 3, 20, 5),
(11, 1, 200, 6),
(12, 2, 100, 6),
(13, 3, 50, 6),
(14, 1, 200, 8),
(15, 2, 150, 8),
(16, 1, 100, 8),
(17, 2, 70, 8),
(18, 3, 20, 8);

-- Mise à jour des id
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));
SELECT setval('structure_id_seq', (SELECT MAX(id) from "structure"));
SELECT setval('tournament_id_seq', (SELECT MAX(id) from "tournament"));
SELECT setval('chip_id_seq', (SELECT MAX(id) from "chip"));
SELECT setval('distribution_id_seq', (SELECT MAX(id) from "distribution"));
SELECT setval('cashprice_id_seq', (SELECT MAX(id) from "cashprice"));

COMMIT