const express = require('express');
const sellerController = require('../controllers/sellerController');

const router = express.Router();

router.post('/', sellerController.create);
router.post('/', sellerController.bulkCreate);
router.get('/', sellerController.findAll);
router.get('/:id', sellerController.findOne);
router.put('/:id', sellerController.update);
router.delete('/:id', sellerController.delete);

module.exports = router;