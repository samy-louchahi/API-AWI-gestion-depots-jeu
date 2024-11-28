const express = require('express');
const salesOperationController = require('../controllers/salesOperationController');


const router = express.Router();

router.post('/sales-operations', salesOperationController.create);
router.get('/sales-operations', salesOperationController.findAll);
router.get('/sales-operations/:id', salesOperationController.findOne);
router.put('/sales-operations/:id', salesOperationController.update);
router.delete('/sales-operations/:id', salesOperationController.delete);

module.exports = router;