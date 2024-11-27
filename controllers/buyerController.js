const { Buyer } = require('../models');

'use strict';


module.exports = {
    async create(req, res) {
        try {
            const buyer = await Buyer.create(req.body);
            return res.status(201).json(buyer);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    async findAll(req, res) {
        try {
            const buyers = await Buyer.findAll();
            return res.status(200).json(buyers);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    async findOne(req, res) {
        try {
            const buyer = await Buyer.findByPk(req.params.id);
            if (!buyer) {
                return res.status(404).json({ error: 'Buyer not found' });
            }
            return res.status(200).json(buyer);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const [updated] = await Buyer.update(req.body, {
                where: { buyer_id: req.params.id }
            });
            if (!updated) {
                return res.status(404).json({ error: 'Buyer not found' });
            }
            const updatedBuyer = await Buyer.findByPk(req.params.id);
            return res.status(200).json(updatedBuyer);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await Buyer.destroy({
                where: { buyer_id: req.params.id }
            });
            if (!deleted) {
                return res.status(404).json({ error: 'Buyer not found' });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
};