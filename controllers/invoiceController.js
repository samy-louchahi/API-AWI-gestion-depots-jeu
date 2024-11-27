const { Invoice } = require('../models');

'use strict';


module.exports = {
    async create(req, res) {
        try {
            const invoice = await Invoice.create(req.body);
            res.status(201).json(invoice);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async findAll(req, res) {
        try {
            const invoices = await Invoice.findAll();
            res.status(200).json(invoices);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async findOne(req, res) {
        try {
            const invoice = await Invoice.findByPk(req.params.id);
            if (invoice) {
                res.status(200).json(invoice);
            } else {
                res.status(404).json({ error: 'Invoice not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const [updated] = await Invoice.update(req.body, {
                where: { invoice_id: req.params.id }
            });
            if (updated) {
                const updatedInvoice = await Invoice.findByPk(req.params.id);
                res.status(200).json(updatedInvoice);
            } else {
                res.status(404).json({ error: 'Invoice not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await Invoice.destroy({
                where: { invoice_id: req.params.id }
            });
            if (deleted) {
                res.status(204).json();
            } else {
                res.status(404).json({ error: 'Invoice not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};