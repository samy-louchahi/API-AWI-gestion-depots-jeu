const express = require('express');
const invoiceController = require('../controllers/invoiceController');

const router = express.Router();

router.post('/', invoiceController.create);
router.get('/', invoiceController.findAll);
router.get('/:id', invoiceController.findOne);
router.put('/:id', invoiceController.update);
router.delete('/:id', invoiceController.delete);

module.exports = router;