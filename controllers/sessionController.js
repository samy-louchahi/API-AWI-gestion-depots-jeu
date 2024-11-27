const { Session } = require('../models');

'use strict';


module.exports = {
    async create(req, res) {
        try {
            const session = await Session.create(req.body);
            res.status(201).json(session);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async findAll(req, res) {
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
            const [updated] = await Session.update(req.body, {
                where: { session_id: req.params.id }
            });
            if (updated) {
                const updatedSession = await Session.findByPk(req.params.id);
                res.status(200).json(updatedSession);
            } else {
                res.status(404).json({ error: 'Session not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
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