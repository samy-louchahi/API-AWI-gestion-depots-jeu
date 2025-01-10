const { Seller } = require('../models');

'use strict';


module.exports = {
    async create(req, res) {
        try {
            const existingSeller = await Seller.findByPk(req.body.seller_id);
            if (existingSeller) {
                return res.status(400).json({ error: 'Seller ID already exists' });
            }
            const seller = await Seller.create(req.body);
            res.status(201).json(seller);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async findAll(req, res) {
        try {
            const sellers = await Seller.findAll();
            res.status(200).json(sellers);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async findOne(req, res) {
        try {
            const seller = await Seller.findByPk(req.params.id);
            if (seller) {
                res.status(200).json(seller);
            } else {
                res.status(404).json({ error: 'Seller not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const [updated] = await Seller.update(req.body, {
                where: { seller_id: req.params.id }
            });
            if (updated) {
                const updatedSeller = await Seller.findByPk(req.params.id);
                res.status(200).json(updatedSeller);
            } else {
                res.status(404).json({ error: 'Seller not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await Seller.destroy({
                where: { seller_id: req.params.id }
            });
            if (deleted) {
                res.status(204).json();
            } else {
                res.status(404).json({ error: 'Seller not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async bulkCreate(req, res) {
        try {
            const existingSellers = await Seller.findAll({
             where: {
                    seller_id: req.body.map(seller => seller.seller_id)
                }
            });

            const existingSellerIds = existingSellers.map(seller => seller.seller_id);
            const newSellers = req.body.filter(seller => !existingSellerIds.includes(seller.seller_id));

            if (newSellers.length !== req.body.length) {
                return res.status(400).json({ error: 'Some seller IDs already exist' });
            }

            const sellers = await Seller.bulkCreate(newSellers);
            res.status(201).json(sellers);
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                res.status(400).json({ error: error.errors.map(e => e.message) });
            } else {
                res.status(400).json({ error: error.message });
            }
        }
}
};
