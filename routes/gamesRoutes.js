const express = require('express');
const gamesController = require('../controllers/gamesController');

const router = express.Router();

router.post('/', gamesController.createGame);
router.get('/', gamesController.findAllGames);
router.get('/:id', gamesController.findGameById);
router.put('/:id', gamesController.updateGame);
router.delete('/:id', gamesController.deleteGame);

module.exports = router;