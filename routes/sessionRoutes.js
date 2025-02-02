const express = require('express');
const sessionController = require('../controllers/sessionController');
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

router.post('/', sessionController.create);
router.get('/', sessionController.findAll);
router.get('/:id', sessionController.findOne);
router.put('/:id', sessionController.update);
router.delete('/:id', sessionController.delete);

module.exports = router;