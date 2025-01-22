const express = require('express');
const invoiceController = require('../controllers/invoiceController');

const router = express.Router();

router.post('/', invoiceController.createInvoice);
router.get('/', invoiceController.findAllInvoices);
router.get('/:id', invoiceController.findInvoiceById);
router.put('/:id', invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);

module.exports = router;