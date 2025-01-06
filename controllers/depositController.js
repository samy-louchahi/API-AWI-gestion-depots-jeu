const { Deposit } = require('../models');

'use strict';


module.exports = {
    async create(req, res) {
        try {
            const deposit = await Deposit.create(req.body);
            res.status(201).json(deposit);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async findAll(req, res) {
        try {
            const deposits = await Deposit.findAll();
            res.status(200).json(deposits);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async findOne(req, res) {
        try {
            const deposit = await Deposit.findByPk(req.params.id);
            if (deposit) {
                res.status(200).json(deposit);
            } else {
                res.status(404).json({ error: 'Deposit not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const [updated] = await Deposit.update(req.body, {
                where: { deposit_id: req.params.id }
            });
            if (updated) {
                const updatedDeposit = await Deposit.findByPk(req.params.id);
                res.status(200).json(updatedDeposit);
            } else {
                res.status(404).json({ error: 'Deposit not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await Deposit.destroy({
                where: { deposit_id: req.params.id }
            });
            if (deleted) {
                res.status(204).json();
            } else {
                res.status(404).json({ error: 'Deposit not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};