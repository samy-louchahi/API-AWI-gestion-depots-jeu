const express = require('express');
const sessionController = require('../controllers/sessionController');

const router = express.Router();

router.post('/sessions', sessionController.create);
router.get('/sessions', sessionController.findAll);
router.get('/sessions/:id', sessionController.findOne);
router.put('/sessions/:id', sessionController.update);
router.delete('/sessions/:id', sessionController.delete);

module.exports = router;