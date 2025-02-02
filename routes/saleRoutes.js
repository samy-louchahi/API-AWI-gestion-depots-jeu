// saleRoutes.js
const express = require('express');
const { authenticateTokenAndRole } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authenticateTokenAndRole(['admin', 'gestionnaire']));

router.use((req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'gestionnaire') {
        next();
    } else {
        return res.status(403).json({ error: 'Accès interdit.' });
    }
});

const saleController = require('../controllers/saleController');

router.post('/', saleController.createSale);
router.get('/', saleController.findAllSales);
router.get('/:id', saleController.findSaleById);
router.put('/:id', saleController.updateSale);
router.delete('/:id', saleController.deleteSale);

module.exports = router;