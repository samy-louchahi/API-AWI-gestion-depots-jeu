const { Session } = require('../models');
const { Op } = require('sequelize');

/**
 * Fonction pour mettre à jour le statut des sessions en fonction de la date actuelle.
 */
const updateSessionStatus = async () => {
    try {
        const currentDate = new Date();

        // Passer en zone locale et ajuster la date de demain à minuit
        const tomorrowMidnight = new Date(currentDate);
        tomorrowMidnight.setDate(currentDate.getDate() + 1);
        tomorrowMidnight.setHours(0, 0, 0, 0);

        console.log('Current Date:', currentDate);
        console.log('Tomorrow Midnight Local:', tomorrowMidnight);

        // Sessions actives
        await Session.update(
            { status: true },
            {
                where: {
                    start_date: { [Op.lte]: currentDate },
                    end_date: { [Op.gte]: currentDate },  // Actives aujourd'hui inclus
                    status: false
                }
            }
        );

        // Sessions terminées avec <= et ajustement
        await Session.update(
            { status: false },
            {
                where: {
                    end_date: { [Op.lte]: tomorrowMidnight }, // Inférieur ou égal avec gestion correcte de la zone horaire
                    status: true
                }
            }
        );

        console.log('Session statuses updated successfully.');
    } catch (error) {
        console.error('Error updating session statuses:', error);
    }
};

module.exports = updateSessionStatus;