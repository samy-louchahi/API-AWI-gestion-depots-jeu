const { Sale } = require('../models');

'use strict';


module.exports = {
    async createSale(req, res) {
        try {
            const sale = await Sale.create(req.body);
            res.status(201).json(sale);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getSales(req, res) {
        try {
            const sales = await Sale.findAll();
            res.status(200).json(sales);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getSaleById(req, res) {
        try {
            const sale = await Sale.findByPk(req.params.id);
            if (sale) {
                res.status(200).json(sale);
            } else {
                res.status(404).json({ error: 'Sale not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async updateSale(req, res) {
        try {
            const [updated] = await Sale.update(req.body, {
                where: { sale_id: req.params.id }
            });
            if (updated) {
                const updatedSale = await Sale.findByPk(req.params.id);
                res.status(200).json(updatedSale);
            } else {
                res.status(404).json({ error: 'Sale not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async deleteSale(req, res) {
        try {
            const deleted = await Sale.destroy({
                where: { sale_id: req.params.id }
            });
            if (deleted) {
                res.status(204).json();
            } else {
                res.status(404).json({ error: 'Sale not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};