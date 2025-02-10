const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticController');
const { authenticateTokenAndRole } = require('../middleware/authMiddleware');

router.use(authenticateTokenAndRole(['admin', 'gestionnaire']));

// Middleware d'autorisation des rôles
router.use((req, res, next) => {
    console.log(`Accès à /statistics par le rôle: ${req.user.role}`); // Log pour débogage
    if (req.user.role === 'admin' || req.user.role === 'gestionnaire') {
        next();
    } else {
        return res.status(403).json({ error: 'Accès interdit.' });
    }
});
router.get('/sessions/vendorshares/:session_id', statisticsController.getVendorShares);
router.get('/session/:session_id/salesovertime', statisticsController.getSalesOverTime);
router.get('/session/:session_id/salescount', statisticsController.getSalesCount);
router.get('/session/:session_id/stocks', statisticsController.getStocksData);
router.get('/session/:session_id/top-games', statisticsController.getTopGamesBySession);
router.get('/session/:session_id/vendor-stats', statisticsController.getVendorStats);

module.exports = router;