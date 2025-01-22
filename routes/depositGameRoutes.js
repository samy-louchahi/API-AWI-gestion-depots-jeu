// depositGameRoutes.js
const express = require('express');
const router = express.Router();
const depositGameController = require('../controllers/depositGameController');

router.post('/', depositGameController.createDepositGame);
router.get('/', depositGameController.getAllDepositGames);
router.get('/:id', depositGameController.getDepositGameById);
router.put('/:id', depositGameController.updateDepositGame);
router.delete('/:id', depositGameController.deleteDepositGame);

module.exports = router;