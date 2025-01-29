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

const financeController = require('../controllers/financeController');

// Bilan global pour une session : GET /api/finance/session/:session_id
router.get('/session/:session_id', financeController.getGlobalBalanceBySession);

// Bilan par vendeur + session : GET /api/finance/session/:session_id/seller/:seller_id
router.get('/session/:session_id/seller/:seller_id', financeController.getVendorBalanceBySession);

module.exports = router;