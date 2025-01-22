const express = require('express');
const buyerController = require('../controllers/buyerController');

const router = express.Router();

router.post('/', buyerController.create);
router.get('/', buyerController.findAll);
router.get('/:id', buyerController.findOne);
router.put('/:id', buyerController.update);
router.delete('/:id', buyerController.delete);

module.exports = router;