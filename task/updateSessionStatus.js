// src/tasks/updateSessionStatus.js

const { Session } = require('../models');
const { Op } = require('sequelize');

/**
 * Fonction pour mettre à jour le statut des sessions en fonction de la date actuelle.
 */
const updateSessionStatus = async () => {
    try {
        const currentDate = new Date();

        // Mettre à jour les sessions actives
        await Session.update(
            { status: true },
            {
                where: {
                    start_date: { [Op.lte]: currentDate },
                    end_date: { [Op.gte]: currentDate },
                    status: false // Optimisation: ne mettre à jour que si le statut est faux
                }
            }
        );

        // Mettre à jour les sessions terminées
        await Session.update(
            { status: false },
            {
                where: {
                    end_date: { [Op.lt]: currentDate },
                    status: true // Optimisation: ne mettre à jour que si le statut est vrai
                }
            }
        );

        // Mettre à jour les sessions à venir
        await Session.update(
            { status: false },
            {
                where: {
                    start_date: { [Op.gt]: currentDate },
                    status: true // Optimisation: ne mettre à jour que si le statut est vrai
                }
            }
        );

        console.log('Session statuses updated successfully.');
    } catch (error) {
        console.error('Error updating session statuses:', error);
    }
};

module.exports = updateSessionStatus;