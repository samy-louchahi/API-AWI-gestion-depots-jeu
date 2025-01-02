module.exports =  (app) => {
    app.use('/api/sessions', require('./sessionRoutes'));
    app.use('/api/buyers', require('./buyerRoutes'));
    app.use('/api/invoices', require('./invoiceRoutes'));
    app.use('/api/deposits', require('./depositRoutes'));
    app.use('/api/financialStatements', require('./financialStatementRoutes'));
    app.use('/api/sales', require('./saleRoutes'));
    app.use('/api/games', require('./gamesRoutes'));
    app.use('/api/stocks', require('./stockRoutes'));
    app.use('/api/salesOperations', require('./salesOperationRoutes'));
    app.use('/api/sellers', require('./sellerRoutes'));
};
