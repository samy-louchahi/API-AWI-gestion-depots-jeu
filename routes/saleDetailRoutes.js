// saleDetailRoutes.js
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

const saleDetailController = require('../controllers/saleDetailController');

router.post('/', saleDetailController.createSaleDetail);
router.get('/', saleDetailController.findAllSaleDetails);
router.get('/:id', saleDetailController.findSaleDetailById);
router.put('/:id', saleDetailController.updateSaleDetail);
router.delete('/:id', saleDetailController.deleteSaleDetail);

module.exports = router;