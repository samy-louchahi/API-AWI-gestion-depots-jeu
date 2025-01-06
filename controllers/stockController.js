const { Stock } = require('../models');

'use strict';


module.exports = {
    async getAllStocks(req, res) {
        try {
            const stocks = await Stock.findAll();
            res.status(200).json(stocks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getStockById(req, res) {
        try {
            const { id } = req.params;
            const stock = await Stock.findByPk(id);
            if (stock) {
                res.status(200).json(stock);
            } else {
                res.status(404).json({ error: 'Stock not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async createStock(req, res) {
        try {
            const { quant_tot, quant_selled, quant_available, session_id, seller_id } = req.body;
            const newStock = await Stock.create({ quant_tot, quant_selled, quant_available, session_id, seller_id });
            res.status(201).json(newStock);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updateStock(req, res) {
        try {
            const { id } = req.params;
            const { quant_tot, quant_selled, quant_available, session_id, seller_id } = req.body;
            const [updated] = await Stock.update({ quant_tot, quant_selled, quant_available, session_id, seller_id }, {
                where: { stock_id: id }
            });
            if (updated) {
                const updatedStock = await Stock.findByPk(id);
                res.status(200).json(updatedStock);
            } else {
                res.status(404).json({ error: 'Stock not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async deleteStock(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Stock.destroy({
                where: { stock_id: id }
            });
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Stock not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};