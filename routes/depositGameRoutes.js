// depositGameRoutes.js
const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authenticateToken);

router.use((req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'gestionnaire') {
        next();
    } else {
        return res.status(403).json({ error: 'Accès interdit.' });
    }
});

const depositGameController = require('../controllers/depositGameController');

router.post('/', depositGameController.createDepositGame);
router.get('/', depositGameController.getAllDepositGames);
router.get('/:id', depositGameController.getDepositGameById);
router.put('/:id', depositGameController.updateDepositGame);
router.delete('/:id', depositGameController.deleteDepositGame);

module.exports = router;