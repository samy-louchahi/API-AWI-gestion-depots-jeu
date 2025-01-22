const express = require('express');
const sessionController = require('../controllers/sessionController');

const router = express.Router();

router.post('/', sessionController.create);
router.get('/', sessionController.findAll);
router.get('/:id', sessionController.findOne);
router.put('/:id', sessionController.update);
router.delete('/:id', sessionController.delete);

module.exports = router;