const { DepositGame, Deposit, SaleDetail, Sale, Session } = require('../models');

exports.getGlobalBalanceBySession = async (req, res) => {
    try {
      const { session_id } = req.params;
  
      // 1) Vérifier la session
      const session = await Session.findByPk(session_id);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
  
      // 2) totalDepositFees
      const totalDepositFees = await DepositGame.sum('fees', {
        where: { '$Deposit.session_id$': session_id },
        include: [{ model: Deposit, attributes: [] }]
      }) || 0;
  
      // 3) Récupérer SaleDetails uniquement pour les ventes finalisées
      const saleDetails = await SaleDetail.findAll({
        include: [
          {
            model: Sale,
            attributes: [],
            where: {
              session_id,
              sale_status: 'finalisé'
            },
            required: true
          },
          {
            model: DepositGame,
            attributes: ['deposit_game_id', 'exemplaires'],
            required: true
          }
        ]
      });
  
      // 4) Calculer totalSales
      const totalSales = saleDetails.reduce((acc, detail) => {
        const dg = detail.DepositGame;
        if (!dg) return acc;
  
        // Convertir `exemplaires` en tableau (via Object.values) si c’est un dictionnaire
        const exemplaires = Object.values(dg.exemplaires || {});
        const qty = detail.quantity;
        const soldExemplaires = exemplaires.slice(0, qty);
  
        const sumPrice = soldExemplaires.reduce((sum, ex) => {
          const priceNum = typeof ex.price === 'number'
            ? ex.price
            : parseFloat(ex.price || '0');
          return sum + priceNum;
        }, 0);
  
        return acc + sumPrice;
      }, 0);
  
      // 5) totalCommission = pourcentage de totalSales
      const totalCommission = totalSales * (session.commission / 100);
  
      // 6) totalBenef = commission + frais de dépôt
      const totalBenef = totalCommission + totalDepositFees;
  
      // 7) Retourner tout dans la réponse
      res.json({
        session_id: Number(session_id),
        totalDepositFees,    // Frais de dépôt
        totalSales,          // Montant total des ventes
        totalCommission,     // Commission du session.commission
        totalBenef           // Bénéfice org = commission + frais
      });
    } catch (error) {
      console.error('Error in getGlobalBalanceBySession:', error);
      res.status(500).json({ error: error.message });
    }
  };

// ------------------------------------------------------------------------

exports.getVendorBalanceBySession = async (req, res) => {
  try {
    const { session_id, seller_id } = req.params;

    // 1) Vérifier la session
    const session = await Session.findByPk(session_id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // 2) totalDepositFees pour ce vendeur dans cette session
    //    (selon votre logique : tous les jeux déposés ou seulement vendus ?)
    const totalDepositFees = await DepositGame.sum('fees', {
      where: {
        '$Deposit.session_id$': session_id,
        '$Deposit.seller_id$': seller_id
      },
      include: [{
        model: Deposit,
        attributes: []
      }]
    }) || 0;

    // 3) Récupérer les SaleDetail dont le sale est finalisé + correspond au vendeur
    const saleDetails = await SaleDetail.findAll({
      where: { seller_id },
      include: [
        {
          model: Sale,
          required: true,
          where: {
            session_id,
            sale_status: 'finalisé'
          }
        },
        {
          model: DepositGame,
          required: true,
          attributes: ['deposit_game_id', 'exemplaires']
        }
      ]
    });

    // 4) Calculer totalSales
    const totalSales = saleDetails.reduce((acc, detail) => {
      const dg = detail.DepositGame;
      if (!dg) return acc;

    const exemplaires = Object.values(dg.exemplaires || {});
      const qty = detail.quantity;

      const soldExemplaires = exemplaires.slice(0, qty);

      const sumPrice = soldExemplaires.reduce((sum, ex) => {
        const priceNum = typeof ex.price === 'number'
          ? ex.price
          : parseFloat(ex.price || '0');
        return sum + priceNum;
      }, 0);

      return acc + sumPrice;
    }, 0);

    // 5) Calculer la commission
    const totalCommission = totalSales * (session.commission / 100);

    // 6) Calculer le bénéf
    const totalBenef = totalSales - totalDepositFees - totalCommission;

    res.json({
      session_id: Number(session_id),
      seller_id: Number(seller_id),
      totalDepositFees,
      totalSales,
      totalCommission,
      totalBenef
    });
  } catch (error) {
    console.error('Error in getVendorBalanceBySession:', error);
    res.status(500).json({ error: error.message });
  }
};