const { Admin } = require('../models');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// Créer un nouvel Admin
exports.createAdmin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Vérifier si l'admin existe déjà
        const existingAdmin = await Admin.findOne({ where: { email } });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Email déjà utilisé.' });
        }

        // Créer l'admin
        const admin = await Admin.create({ email, password });

        res.status(201).json({ message: 'Admin créé avec succès.', admin: { admin_id: admin.admin_id, email: admin.email } });
    } catch (error) {
        console.error('Erreur lors de la création de l\'admin:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

// Obtenir tous les Admins
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.findAll({ attributes: ['admin_id', 'email', 'createdAt', 'updatedAt'] });
        res.json(admins);
    } catch (error) {
        console.error('Erreur lors de la récupération des admins:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

// Obtenir un Admin par ID
exports.getAdminById = async (req, res) => {
    const { id } = req.params;

    try {
        const admin = await Admin.findByPk(id, { attributes: ['admin_id', 'email', 'createdAt', 'updatedAt'] });
        if (!admin) {
            return res.status(404).json({ error: 'Admin non trouvé.' });
        }
        res.json(admin);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'admin:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

// Mettre à jour un Admin
exports.updateAdmin = async (req, res) => {
    const { id } = req.params;
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin non trouvé.' });
        }

        // Mettre à jour les champs
        if (email) admin.email = email;
        if (password) admin.password = password; // Le hook se chargera de hacher le mot de passe

        await admin.save();

        res.json({ message: 'Admin mis à jour avec succès.', admin: { admin_id: admin.admin_id, email: admin.email } });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'admin:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

// Supprimer un Admin
exports.deleteAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin non trouvé.' });
        }

        await admin.destroy();

        res.json({ message: 'Admin supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'admin:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};