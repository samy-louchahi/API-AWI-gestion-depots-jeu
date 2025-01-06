const express = require('express');
const depositController = require('../controllers/depositController');

const router = express.Router();

router.post('/deposits', depositController.create);
router.get('/deposits', depositController.findAll);
router.get('/deposits/:id', depositController.findOne);
router.put('/deposits/:id', depositController.update);
router.delete('/deposits/:id', depositController.delete);

module.exports = router;