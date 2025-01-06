const express = require('express');
const stockController = require('../controllers/stockController');

const router = express.Router();

router.get('/stocks', stockController.getAllStocks);
router.get('/stocks/:id', stockController.getStockById);
router.post('/stocks', stockController.createStock);
router.put('/stocks/:id', stockController.updateStock);
router.delete('/stocks/:id', stockController.deleteStock);

module.exports = router;