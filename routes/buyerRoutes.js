const express = require('express');
const buyerController = require('../controllers/buyerController');
const { authenticateTokenAndRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Middleware d'authentification
router.use(authenticateTokenAndRole(['admin', 'gestionnaire']));

// Middleware d'autorisation des rôles
router.use((req, res, next) => {
    console.log(`Accès à /buyers par le rôle: ${req.user.role}`); // Log pour débogage
    if (req.user.role === 'admin' || req.user.role === 'gestionnaire') {
        next();
    } else {
        return res.status(403).json({ error: 'Accès interdit.' });
    }
});

// Routes
router.post('/', buyerController.create);
router.get('/', buyerController.findAll);
router.get('/:id', buyerController.findOne);
router.put('/:id', buyerController.update);
router.delete('/:id', buyerController.delete);

module.exports = router;