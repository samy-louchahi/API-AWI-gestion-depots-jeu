const express = require('express');
const sellerController = require('../controllers/sellerController');
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

router.post('/', sellerController.create);
router.post('/', sellerController.bulkCreate);
router.get('/', sellerController.findAll);
router.get('/:id', sellerController.findOne);
router.put('/:id', sellerController.update);
router.delete('/:id', sellerController.delete);

module.exports = router;