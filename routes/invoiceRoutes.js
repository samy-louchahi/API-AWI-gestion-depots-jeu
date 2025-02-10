const express = require('express');
const invoiceController = require('../controllers/invoiceController');
const { authenticateTokenAndRole } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authenticateTokenAndRole(['admin', 'gestionnaire']));

router.use((req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'gestionnaire') {
        next();
    } else {
        return res.status(403).json({ error: 'Accès interdit.' });
    }
});

//router.post('/', invoiceController.createInvoice);
router.post('/:sale_id', invoiceController.generateInvoicePDF);
router.get('/', invoiceController.findAllInvoices);
router.get('/:id', invoiceController.findInvoiceById);
router.put('/:id', invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);


module.exports = router;