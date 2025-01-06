const { Game } = require('../models');

'use strict';


module.exports = {
    async getAllGames(req, res) {
        try {
            const games = await Game.findAll();
            res.status(200).json(games);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getGameById(req, res) {
        try {
            const { id } = req.params;
            const game = await Game.findByPk(id);
            if (game) {
                res.status(200).json(game);
            } else {
                res.status(404).json({ error: 'Game not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async createGame(req, res) {
        try {
            const { name, publisher, price, seller_id, stock_id, deposit_id } = req.body;
            const newGame = await Game.create({ name, publisher, price, seller_id, stock_id, deposit_id });
            res.status(201).json(newGame);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updateGame(req, res) {
        try {
            const { id } = req.params;
            const { name, publisher, price, seller_id, stock_id, deposit_id } = req.body;
            const [updated] = await Game.update({ name, publisher, price, seller_id, stock_id, deposit_id }, {
                where: { game_id: id }
            });
            if (updated) {
                const updatedGame = await Game.findByPk(id);
                res.status(200).json(updatedGame);
            } else {
                res.status(404).json({ error: 'Game not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async deleteGame(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Game.destroy({
                where: { game_id: id }
            });
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Game not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};