const express = require('express');
const invoiceController = require('../controllers/invoiceController');

const router = express.Router();

router.post('/invoices', invoiceController.create);
router.get('/invoices', invoiceController.findAll);
router.get('/invoices/:id', invoiceController.findOne);
router.put('/invoices/:id', invoiceController.update);
router.delete('/invoices/:id', invoiceController.delete);

module.exports = router;