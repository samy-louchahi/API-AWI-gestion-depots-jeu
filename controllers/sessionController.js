const { Session } = require('../models');

'use strict';


module.exports = {
    async create(req, res) {
        try {
            const { name, start_date, end_date, fees, commission } = req.body;
    
            // Validation des champs requis
            if (!name || !start_date || !end_date) {
                return res.status(400).json({ error: 'Le nom, la date de début et la date de fin sont requis.' });
            }
    
            const currentDate = new Date();
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
    
            // Déterminer le statut basé sur les dates
            let status = false;
            if (currentDate >= startDate && currentDate <= endDate) {
                status = true;
            }
    
            const newSession = await Session.create({
                name,
                start_date,
                end_date,
                fees,
                commission,
                status
            });
    
            res.status(201).json(newSession);
        } catch (error) {
            console.error('Erreur lors de la création de la session:', error);
            res.status(500).json({ error: 'Échec de la création de la session.' });
        }
    },

    async findAll(_req, res) {
        try {
            const sessions = await Session.findAll();
            res.status(200).json(sessions);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async findOne(req, res) {
        try {
            const session = await Session.findByPk(req.params.id);
            if (session) {
                res.status(200).json(session);
            } else {
                res.status(404).json({ error: 'Session not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, start_date, end_date, fees, commission } = req.body;
    
            // Validation des champs requis
            if (!name || !start_date || !end_date) {
                return res.status(400).json({ error: 'Le nom, la date de début et la date de fin sont requis.' });
            }
    
            const currentDate = new Date();
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
    
            // Déterminer le statut basé sur les dates
            let status = false;
            if (currentDate >= startDate && currentDate <= endDate) {
                status = true;
            }
    
            const [updatedRows, [updatedSession]] = await Session.update(
                {
                    name,
                    start_date,
                    end_date,
                    fees,
                    commission,
                    status
                },
                {
                    where: { session_id: id },
                    returning: true
                }
            );
    
            if (updatedRows === 0) {
                return res.status(404).json({ error: 'Session non trouvée.' });
            }
    
            res.status(200).json(updatedSession);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la session:', error);
            res.status(500).json({ error: 'Échec de la mise à jour de la session.' });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await Session.destroy({
                where: { session_id: req.params.id }
            });
            if (deleted) {
                res.status(204).json();
            } else {
                res.status(404).json({ error: 'Session not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};