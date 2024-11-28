const express = require('express');
const buyerController = require('../controllers/buyerController');

const router = express.Router();

router.post('/buyers', buyerController.create);
router.get('/buyers', buyerController.findAll);
router.get('/buyers/:id', buyerController.findOne);
router.put('/buyers/:id', buyerController.update);
router.delete('/buyers/:id', buyerController.delete);

module.exports = router;