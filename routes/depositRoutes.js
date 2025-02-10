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

const depositController = require('../controllers/depositController');

router.post('/', depositController.create);
router.get('/', depositController.findAll);
router.get('/:id', depositController.findOne);
router.put('/:id', depositController.update);
router.delete('/:id', depositController.delete);

module.exports = router;