const express = require('express');
const financialStatementController = require('../controllers/financialStatementController');

const router = express.Router();

router.post('/financial-statements', financialStatementController.create);
router.get('/financial-statements', financialStatementController.findAll);
router.get('/financial-statements/:id', financialStatementController.findOne);
router.put('/financial-statements/:id', financialStatementController.update);
router.delete('/financial-statements/:id', financialStatementController.delete);

module.exports = router;