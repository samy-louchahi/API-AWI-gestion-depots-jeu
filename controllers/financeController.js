const { DepositGame, Deposit, Sale } = require('../models');

exports.getGlobalBalanceBySession = async (req, res) => {
  try {
    const { session_id } = req.params;

    // 1) totalDepositFees : somme de DepositGame.fees
    //    pour tous depositGame dont deposit.session_id = session_id
    const totalDepositFees = await DepositGame.sum('fees', {
      include: [{
        model: Deposit,
        required: true,
        where: { session_id }
      }]
    });
    // Note : sum(...) avec include requiert parfois l'option 'attributes: []' 
    // ou un raw query. Tu peux selon la version de Sequelize ou tu peux faire un raw SQL.

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
  
      // totalDepositFees
      const totalDepositFees = await DepositGame.sum('fees', {
        include: [{
          model: Deposit,
          required: true,
          where: {
            session_id,
            seller_id
          }
        }]
      });
  
      // totalSales
      const totalSales = await Sale.sum('sale_price', {
        where: {
          session_id,
          seller_id
        }
      });
  
      // totalCommission
      const totalCommission = await Sale.sum('commission', {
        where: {
          session_id,
          seller_id
        }
      });
  
      const totalBenef = (totalSales - totalCommission) || 0;
  
      res.json({
        session_id,
        seller_id,
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