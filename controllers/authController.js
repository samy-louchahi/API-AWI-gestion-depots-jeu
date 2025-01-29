const jwt = require('jsonwebtoken');
const { Admin, Gestionnaire } = require('../models');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// Fonction pour générer un JWT
const generateToken = (user, role) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email || user.username,
            role: role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
};

// Login pour Admin (basé sur l'email)
exports.loginAdmin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log('Tentative de login pour l\'email:', email);
    console.log('Mot de passe fourni:', password);

    try {
        // Trouver l'admin par email
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
            console.log('Admin non trouvé pour l\'email:', email);
            return res.status(400).json({ error: `L'admin n'existe pas.` });
        }

        console.log('Mot de passe stocké:', admin.password);

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(password, admin.password);
        console.log('Mot de passe valide:', validPassword);
        if (!validPassword) {
            return res.status(400).json({ error: 'Le mot de passe ne correspond pas.' });
        }

        // Générer le token
        const token = generateToken(admin, 'admin');
        console.log('Token généré:', token);

        res.json({ token });
    } catch (error) {
        console.error('Erreur lors du login admin:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

// Login pour Gestionnaire (basé sur le username)
exports.loginGestionnaire = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        // Trouver le gestionnaire par username
        const gestionnaire = await Gestionnaire.findOne({ where: { username } });
        if (!gestionnaire) {
            return res.status(400).json({ error: 'Identifiants invalides.' });
        }

        // Vérifier le mot de passe
        const isMatch = gestionnaire.validPassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Identifiants invalides.' });
        }

        // Générer le token
        const token = generateToken(gestionnaire, 'gestionnaire');

        res.json({ token });
    } catch (error) {
        console.error('Erreur lors du login gestionnaire:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};