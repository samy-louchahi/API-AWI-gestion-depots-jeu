const express = require('express');
const gamesController = require('../controllers/gamesController');

const router = express.Router();

router.get('/games', gamesController.getAllGames);
router.get('/games/:id', gamesController.getGameById);
router.post('/games', gamesController.createGame);
router.put('/games/:id', gamesController.updateGame);
router.delete('/games/:id', gamesController.deleteGame);

module.exports = router;