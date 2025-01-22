const express = require('express');
const router = express.Router();
const depositController = require('../controllers/depositController');

router.post('/', depositController.create);
router.get('/', depositController.findAll);
router.get('/:id', depositController.findOne);
router.put('/:id', depositController.update);
router.delete('/:id', depositController.delete);

module.exports = router;