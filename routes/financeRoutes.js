// financeRoutes.js
const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');

// Bilan global pour une session : GET /api/finance/session/:session_id
router.get('/session/:session_id', financeController.getGlobalBalanceBySession);

// Bilan par vendeur + session : GET /api/finance/session/:session_id/seller/:seller_id
router.get('/session/:session_id/seller/:seller_id', financeController.getVendorBalanceBySession);

module.exports = router;