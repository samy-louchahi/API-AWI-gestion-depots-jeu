const express = require('express');
const router = express.Router();
const gestionnaireController = require('../controllers/gestionnaireController');
const { authenticateTokenAndRole } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Middleware pour authentifier et autoriser uniquement les gestionnaires
router.use(authenticateTokenAndRole('gestionnaire'));


// Routes CRUD pour Gestionnaire
router.post(
    '/',
    [
        body('username').not().isEmpty().withMessage('Le username est requis'),
        body('password').isLength({ min: 5 }).withMessage('Le mot de passe doit contenir au moins 5 caractères'),
    ],
    gestionnaireController.createGestionnaire
);
router.get('/', gestionnaireController.getAllGestionnaires);
router.get('/:id', gestionnaireController.getGestionnaireById);
router.put(
    '/:id',
    [
        body('username').optional().notEmpty().withMessage('Le nom d\'utilisateur ne peut pas être vide.'),
        body('email').optional().isEmail().withMessage('Un email valide est requis.'),
        body('password').optional().isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.')
    ],
    gestionnaireController.updateGestionnaire
);
router.delete('/:id', gestionnaireController.deleteGestionnaire);

module.exports = router;