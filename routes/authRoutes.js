const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

// Route de login pour Admin avec validation
router.post(
    '/admin/login',
    [
        body('email').isEmail().withMessage('Un email valide est requis.'),
        body('password').notEmpty().withMessage('Le mot de passe est requis.')
    ],
    authController.loginAdmin
);

// Route de login pour Gestionnaire avec validation
router.post(
    '/gestionnaire/login',
    [
        body('username').notEmpty().withMessage('Le nom d\'utilisateur est requis.'),
        body('password').notEmpty().withMessage('Le mot de passe est requis.')
    ],
    authController.loginGestionnaire
);

module.exports = router;