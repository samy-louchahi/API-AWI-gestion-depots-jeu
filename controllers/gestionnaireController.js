const { Gestionnaire } = require('../models');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// Créer un nouveau Gestionnaire
exports.createGestionnaire = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        // Vérifier si le gestionnaire existe déjà
        const existingGestionnaire = await Gestionnaire.findOne({ where: { username } });
        if (existingGestionnaire) {
            return res.status(400).json({ error: 'Username ou Email déjà utilisé.' });
        }

        // Créer le gestionnaire
        const gestionnaire = await Gestionnaire.create({ username, email, password });

        res.status(201).json({ message: 'Gestionnaire créé avec succès.', gestionnaire: { id: gestionnaire.id, username: gestionnaire.username, email: gestionnaire.email } });
    } catch (error) {
        console.error('Erreur lors de la création du gestionnaire:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

// Obtenir tous les Gestionnaires
exports.getAllGestionnaires = async (req, res) => {
    try {
        const gestionnaires = await Gestionnaire.findAll({ attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt'] });
        res.json(gestionnaires);
    } catch (error) {
        console.error('Erreur lors de la récupération des gestionnaires:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

// Obtenir un Gestionnaire par ID
exports.getGestionnaireById = async (req, res) => {
    const { id } = req.params;

    try {
        const gestionnaire = await Gestionnaire.findByPk(id, { attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt'] });
        if (!gestionnaire) {
            return res.status(404).json({ error: 'Gestionnaire non trouvé.' });
        }
        res.json(gestionnaire);
    } catch (error) {
        console.error('Erreur lors de la récupération du gestionnaire:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

// Mettre à jour un Gestionnaire
exports.updateGestionnaire = async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const gestionnaire = await Gestionnaire.findByPk(id);
        if (!gestionnaire) {
            return res.status(404).json({ error: 'Gestionnaire non trouvé.' });
        }

        // Mettre à jour les champs
        if (username) gestionnaire.username = username;
        if (email) gestionnaire.email = email;
        if (password) gestionnaire.password = password; // Le hook se chargera de hacher le mot de passe

        await gestionnaire.save();

        res.json({ message: 'Gestionnaire mis à jour avec succès.', gestionnaire: { id: gestionnaire.id, username: gestionnaire.username, email: gestionnaire.email } });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du gestionnaire:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

// Supprimer un Gestionnaire
exports.deleteGestionnaire = async (req, res) => {
    const { id } = req.params;

    try {
        const gestionnaire = await Gestionnaire.findByPk(id);
        if (!gestionnaire) {
            return res.status(404).json({ error: 'Gestionnaire non trouvé.' });
        }

        await gestionnaire.destroy();

        res.json({ message: 'Gestionnaire supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression du gestionnaire:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};