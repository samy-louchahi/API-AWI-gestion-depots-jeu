const { SalesOperation } = require('../models');

'use strict';


module.exports = {
    async create(req, res) {
        try {
            const salesOperation = await SalesOperation.create(req.body);
            res.status(201).json(salesOperation);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async findAll(req, res) {
        try {
            const salesOperations = await SalesOperation.findAll();
            res.status(200).json(salesOperations);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async findOne(req, res) {
        try {
            const salesOperation = await SalesOperation.findByPk(req.params.id);
            if (!salesOperation) {
                return res.status(404).json({ error: 'SalesOperation not found' });
            }
            res.status(200).json(salesOperation);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const [updated] = await SalesOperation.update(req.body, {
                where: { sales_op_id: req.params.id }
            });
            if (!updated) {
                return res.status(404).json({ error: 'SalesOperation not found' });
            }
            const updatedSalesOperation = await SalesOperation.findByPk(req.params.id);
            res.status(200).json(updatedSalesOperation);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await SalesOperation.destroy({
                where: { sales_op_id: req.params.id }
            });
            if (!deleted) {
                return res.status(404).json({ error: 'SalesOperation not found' });
            }
            res.status(204).json();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};