// saleDetailRoutes.js
const express = require('express');
const router = express.Router();
const saleDetailController = require('../controllers/saleDetailController');

router.post('/', saleDetailController.createSaleDetail);
router.get('/', saleDetailController.findAllSaleDetails);
router.get('/:id', saleDetailController.findSaleDetailById);
router.put('/:id', saleDetailController.updateSaleDetail);
router.delete('/:id', saleDetailController.deleteSaleDetail);

module.exports = router;