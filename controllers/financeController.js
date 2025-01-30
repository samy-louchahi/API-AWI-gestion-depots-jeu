const { DepositGame, Deposit,SaleDetail, Sale, Session } = require('../models');

exports.getGlobalBalanceBySession = async (req, res) => {
  try {
    const { session_id } = req.params;

    // 1) totalDepositFees : nombres de jeux vendus * session.fees
    session = await DepositGame.findAll({
      where: { session_id },
      include: [{ model: Deposit, required: true }]
    });
    const totalDepositFees = session.reduce((acc, game) => {
        return acc + (game.quantity * parseFloat(game.Deposit.fees));
    }, 0);
    

    // 2) totalSales : somme de Sale.sale_price
    const totalSales = await Sale.sum('sale_price', { where: { session_id } });

    // 3) totalCommission : somme de Sale.commission
    const totalCommission = await Sale.sum('commission', { where: { session_id } });

    // 4) Calcul
    const totalBenef = (totalSales - totalCommission) || 0;

    res.json({
      session_id,
      totalDepositFees: totalDepositFees || 0,
      totalSales: totalSales || 0,
      totalCommission: totalCommission || 0,
      totalBenef
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getVendorBalanceBySession = async (req, res) => {
    try {
        const { session_id, seller_id } = req.params;

        // 1) Calculer le total des frais de dépôt pour le vendeur dans la session
        const totalDepositFees = await DepositGame.sum('fees', {
            where: {
                '$Deposit.session_id$': session_id,
                '$Deposit.seller_id$': seller_id
            },
            include: [{
                model: Deposit,
                attributes: []
            }],
            // Optionnellement, définir `raw: true` si nécessaire
        });
        console.log('totalDepositFees:', totalDepositFees);
        // 2) Récupérer les détails des ventes pour le vendeur dans la session
        const saleDetails = await SaleDetail.findAll({
            where: { seller_id },
            include: [{
                model: Sale,
                where: { session_id },
                required: true
            }, {
                model: DepositGame,
                required: true
            }]
        });
        session = await Session.findByPk(session_id);
        // 3) Calculer le total des ventes
        const totalSales = saleDetails.reduce((acc, detail) => {
            return acc + (detail.quantity * parseFloat(detail.DepositGame.price));
        }, 0);

        // 4) Calculer le total des commissions
        const totalCommission = totalSales * (session.commission / 100);
        console.log('totalSales:', totalSales);
        console.log('totalCommission:', totalCommission);
        // 5) Calculer le bénéfice total
        const totalBenef = (totalSales - totalDepositFees - totalCommission) || 0;

        res.json({
            session_id: parseInt(session_id, 10),
            seller_id: parseInt(seller_id, 10),
            totalDepositFees: totalDepositFees || 0,
            totalSales: totalSales || 0,
            totalCommission: totalCommission || 0,
            totalBenef
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};