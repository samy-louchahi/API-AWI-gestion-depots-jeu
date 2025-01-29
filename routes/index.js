module.exports =  (app) => {
    app.use('/api/sessions', require('./sessionRoutes'));
    app.use('/api/buyers', require('./buyerRoutes'));
    app.use('/api/invoices', require('./invoiceRoutes'));
    app.use('/api/deposits', require('./depositRoutes'));
    app.use('/api/sales', require('./saleRoutes'));
    app.use('/api/games', require('./gamesRoutes'));
    app.use('/api/stocks', require('./stockRoutes'));
    app.use('/api/saleOperations', require('./salesOperationRoutes'));
    app.use('/api/saleDetails', require('./saleDetailRoutes'));
    app.use('/api/sellers', require('./sellerRoutes'));
    app.use('/api/depositGames', require('./depositGameRoutes'));
    app.use('/api/finances', require('./financeRoutes'));
    app.use('/api/auth', require('./authRoutes'));
    app.use('/api/admins', require('./adminRoutes'));
    app.use('/api/gestionnaires', require('./gestionnaireRoutes'));
};
