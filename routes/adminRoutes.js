const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateTokenAndRole} = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Middleware pour authentifier et autoriser uniquement les admins
router.use(authenticateTokenAndRole('admin'));

// Routes CRUD pour Admin
router.post(
    '/',
    [
        body('email').isEmail().withMessage('Un email valide est requis.'),
        body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.')
    ],
    adminController.createAdmin
);
router.get('/', adminController.getAllAdmins);
router.get('/:id', adminController.getAdminById);
router.put(
    '/:id',
    [
        body('email').optional().isEmail().withMessage('Un email valide est requis.'),
        body('password').optional().isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.')
    ],
    adminController.updateAdmin
);
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;