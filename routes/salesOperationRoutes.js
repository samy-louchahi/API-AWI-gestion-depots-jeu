// saleOperationRoutes.js
const express = require('express');
const router = express.Router();
const saleOperationController = require('../controllers/saleOperationController');

router.post('/', saleOperationController.createSaleOperation);
router.get('/', saleOperationController.findAllSaleOperations);
router.get('/:id', saleOperationController.findSaleOperationById);
router.put('/:id', saleOperationController.updateSaleOperation);
router.delete('/:id', saleOperationController.deleteSaleOperation);

module.exports = router;