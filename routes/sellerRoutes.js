const express = require('express');
const sellerController = require('../controllers/sellerController');

const router = express.Router();

router.post('/sellers', sellerController.create);
router.post('/bulksellers', sellerController.bulkCreate);
router.get('/sellers', sellerController.findAll);
router.get('/sellers/:id', sellerController.findOne);
router.put('/sellers/:id', sellerController.update);
router.delete('/sellers/:id', sellerController.delete);

module.exports = router;