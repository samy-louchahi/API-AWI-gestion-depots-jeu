// controllers/sellerController.js

const { Seller } = require('../models');

'use strict';

module.exports = {
    /**
     * CREATE: POST /api/sellers/sellers
     * Body attendu: { name, email, phone, address }
     */
    async create(req, res) {
        try {
            const { name, email, phone, address } = req.body;

            // Vérification des champs obligatoires
            if (!name || !email) {
                return res.status(400).json({ error: 'Missing required fields: name, email' });
            }

            // Vérifie si le seller existe déjà par email
            const existingSeller = await Seller.findOne({ where: { email } });
            if (existingSeller) {
                return res.status(400).json({ error: 'Seller already exists' });
            }

            const seller = await Seller.create({ name, email, phone, address });
            return res.status(201).json(seller);
        } catch (error) {
            console.error('Erreur lors de la création du seller:', error);
            return res.status(400).json({ error: error.message });
        }
    },

    /**
     * CREATE MANY: POST /api/sellers/sellers/many
     * Body attendu: { sellers: [{ name, email, phone, address }, ...] }
     */
    async bulkCreate(req, res) {
        try {
            const { sellers } = req.body;
            if (!Array.isArray(sellers) || sellers.length === 0) {
                return res.status(400).json({ error: 'No sellers provided' });
            }

            const emails = sellers.map(seller => seller.email);
            const existingSellers = await Seller.findAll({ where: { email: emails } });

            if (existingSellers.length > 0) {
                return res.status(400).json({ error: 'One or more sellers already exist' });
            }

            const createdSellers = await Seller.bulkCreate(sellers);
            return res.status(201).json(createdSellers);
        } catch (error) {
            console.error('Erreur lors de la création de plusieurs sellers:', error);
            return res.status(400).json({ error: error.message });
        }
    },

    /**
     * READ ALL: GET /api/sellers/sellers
     */
    async findAll(req, res) {
        try {
            const sellers = await Seller.findAll();
            return res.status(200).json(sellers);
        } catch (error) {
            console.error('Erreur lors de la récupération des sellers:', error);
            return res.status(400).json({ error: error.message });
        }
    },

    /**
     * READ ONE: GET /api/sellers/sellers/:id
     */
    async findOne(req, res) {
        try {
            const seller = await Seller.findByPk(req.params.id);
            if (seller) {
                res.status(200).json(seller);
            } else {
                res.status(404).json({ error: 'Seller not found' });
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du seller:', error);
            res.status(400).json({ error: error.message });
        }
    },

    /**
     * UPDATE: PUT /api/sellers/sellers/:id
     * Body possible: { name, email, phone, address }
     */
    async update(req, res) {
        try {
            const { name, email, phone, address } = req.body;

            // Vérification des champs obligatoires
            if (!name || !email) {
                return res.status(400).json({ error: 'Missing required fields: name, email' });
            }

            const [updated] = await Seller.update({ name, email, phone, address }, {
                where: { seller_id: req.params.id }
            });

            if (!updated) {
                return res.status(404).json({ error: 'Seller not found' });
            }

            const updatedSeller = await Seller.findByPk(req.params.id);
            return res.status(200).json(updatedSeller);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du seller:', error);
            return res.status(400).json({ error: error.message });
        }
    },

    /**
     * DELETE: DELETE /api/sellers/sellers/:id
     */
    async delete(req, res) {
        try {
            const deleted = await Seller.destroy({
                where: { seller_id: req.params.id }
            });
            if (deleted) {
                return res.status(204).send();
            } else {
                return res.status(404).json({ error: 'Seller not found' });
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du seller:', error);
            return res.status(400).json({ error: error.message });
        }
    }
};