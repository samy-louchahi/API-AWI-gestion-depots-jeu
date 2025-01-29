// seeders/seedAdmin.js

require('dotenv').config();
const { Admin } = require('../models'); // Assurez-vous que le chemin est correct

const createAdmin = async () => {
    try {
        const existingAdmin = await Admin.findOne({ where: { email: 'samy@admin.com' } });
        if (existingAdmin) {
            await existingAdmin.update({
                email: 'samy@admin.com',
                password: '12345'
            });
            console.log('Admin initial mis à jour avec succès.');
            return;
        }

        await Admin.create({
            email: 'samy@admin.com',
            password: '12345' // Passer le mot de passe en clair, sera hashé par le hook
        });
        console.log('Admin initial créé avec succès.');
    } catch (error) {
        console.error('Erreur lors de la création de l\'admin:', error);
    } finally {
        process.exit();
    }
};

createAdmin();