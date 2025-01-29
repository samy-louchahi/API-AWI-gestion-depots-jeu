// saleOperationRoutes.js
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

const saleOperationController = require('../controllers/salesOperationController');

router.post('/', saleOperationController.createSaleOperation);
router.get('/', saleOperationController.findAllSaleOperations);
router.get('/:id', saleOperationController.findSaleOperationById);
router.put('/:id', saleOperationController.updateSaleOperation);
router.delete('/:id', saleOperationController.deleteSaleOperation);

module.exports = router;