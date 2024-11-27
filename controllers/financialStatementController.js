const { FinancialStatement } = require('../models');

'use strict';


module.exports = {
    async create(req, res) {
        try {
            const financialStatement = await FinancialStatement.create(req.body);
            res.status(201).json(financialStatement);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async findAll(req, res) {
        try {
            const financialStatements = await FinancialStatement.findAll();
            res.status(200).json(financialStatements);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async findOne(req, res) {
        try {
            const financialStatement = await FinancialStatement.findByPk(req.params.id);
            if (financialStatement) {
                res.status(200).json(financialStatement);
            } else {
                res.status(404).json({ error: 'FinancialStatement not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const [updated] = await FinancialStatement.update(req.body, {
                where: { statement_id: req.params.id }
            });
            if (updated) {
                const updatedFinancialStatement = await FinancialStatement.findByPk(req.params.id);
                res.status(200).json(updatedFinancialStatement);
            } else {
                res.status(404).json({ error: 'FinancialStatement not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await FinancialStatement.destroy({
                where: { statement_id: req.params.id }
            });
            if (deleted) {
                res.status(204).json();
            } else {
                res.status(404).json({ error: 'FinancialStatement not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};