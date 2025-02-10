const { SaleDetail, Sale, DepositGame, Deposit, Seller, Session, Game } = require('../models');
const { Op } = require('sequelize');


module.exports = {
  async getVendorShares(req, res) {
    
    try {
      const {session_id } = req.params;
      console.log('session_id:', session_id);

      // Vérifier la session
      const session = await Session.findByPk(session_id);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      // Récupérer les saleDetails pour la session finalisée
      const saleDetails = await SaleDetail.findAll({
        // On peut grouper au niveau SQL, mais ici on va juste tout charger et agréger en JS
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
            attributes: ['exemplaires'],
            required: true
          },
          {
            model: Seller,
            // ou si vous ne stockez pas seller_id direct, alors Seller passera par DepositGame->Deposit->Seller
            // Dans votre code, vous avez seller_id dans SaleDetail, donc on inclut Seller ici
            attributes: ['seller_id', 'name']
          }
        ]
      });

      // Agréger la somme vendue par vendeur
      // On construit un dictionnaire { seller_id: totalVentes }
      const salesBySeller = {};

      saleDetails.forEach((detail) => {
        const sellerId = detail.seller_id; // ou detail.Seller?.seller_id
        if (!sellerId) return; // skip si manquant

        // Récupération du nombre d’exemplaires vendus
        const exemplairesDict = detail.DepositGame?.exemplaires || {};
        const exemplairesArray = Object.values(exemplairesDict);

        const soldExemplaires = exemplairesArray.slice(0, detail.quantity);

        const subTotal = soldExemplaires.reduce((acc, ex) => {
          const priceNum = typeof ex.price === 'number' ? ex.price : parseFloat(ex.price || '0');
          return acc + priceNum;
        }, 0);

        if (!salesBySeller[sellerId]) {
          salesBySeller[sellerId] = {
            seller_id: sellerId,
            sellerName: detail.Seller?.name || `Seller #${sellerId}`,
            total: 0
          };
        }
        salesBySeller[sellerId].total += subTotal;
      });

      // Transformer l’objet en tableau pour le frontend
      const vendorShares = Object.values(salesBySeller);

      return res.json(vendorShares);
    } catch (error) {
      console.error('Error in getVendorShares:', error);
      return res.status(500).json({ error: error.message });
    }
  },
  async getSalesOverTime(req, res) {
    try {
      const { session_id } = req.params;

      // 1. Vérifier la session
      const session = await Session.findByPk(session_id);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      // 2. Récupérer toutes les ventes finalisées de la session
      const sales = await Sale.findAll({
        where: {
          session_id,
          sale_status: 'finalisé'
        },
        // On récupère la date
        attributes: ['sale_id', 'sale_date'],
        include: [
          {
            model: SaleDetail,
            // Récupère les exemplaires
            include: [
              {
                model: DepositGame,
                attributes: ['exemplaires']
              }
            ]
          }
        ]
      });

      // 3. Préparer un dict / map date -> total
      //    On agrégera par jour (ex. "2025-02-10") la somme des ventes
      const salesByDate = {};

      for (const sale of sales) {
        // Récupérer la date (jour) à partir de sale_date
        const dateObj = new Date(sale.sale_date);
        // Convertir en "YYYY-MM-DD"
        const dayStr = dateObj.toISOString().split('T')[0];

        // Calculer le total de la vente
        let saleTotal = 0;

        for (const detail of sale.SaleDetails) {
          const dg = detail.DepositGame;
          if (!dg) continue;
          const exemplairesDict = dg.exemplaires || {};
          const exemplairesArray = Object.values(exemplairesDict);

          const soldExemplaires = exemplairesArray.slice(0, detail.quantity);
          const subTotal = soldExemplaires.reduce((acc, ex) => {
            const priceNum = typeof ex.price === 'number' ? ex.price : parseFloat(ex.price || '0');
            return acc + priceNum;
          }, 0);
          saleTotal += subTotal;
        }

        // Ajouter ce total à la date correspondante
        if (!salesByDate[dayStr]) {
          salesByDate[dayStr] = 0;
        }
        salesByDate[dayStr] += saleTotal;
      }

      // 4. Transformer en tableau trié par date
      //    ex. [ { date: '2025-02-10', total: 123.45 }, ... ]
      const results = Object.keys(salesByDate)
        .sort() // tri alphabétique => "2025-02-10" < "2025-02-11" etc.
        .map(dateStr => ({
          date: dateStr,
          total: salesByDate[dateStr]
        }));

      return res.json(results);
    } catch (error) {
      console.error('Error in getSalesOverTime:', error);
      return res.status(500).json({ error: error.message });
    }
  },
  async getSalesCount(req, res) {
    try {
      const { session_id } = req.params;

      // Vérifier la session
      const session = await Session.findByPk(session_id);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      // Compter le nombre de ventes finalisées ou totales (à vous de choisir)
      // Ici, on suppose “finalisées”
      const count = await Sale.count({
        where: {
          session_id,
          sale_status: 'finalisé'
        }
      });

      return res.json({ salesCount: count });
    } catch (error) {
      console.error('Error in getSalesCount:', error);
      return res.status(500).json({ error: error.message });
    }
  },
  async getStocksData(req, res) {
    try {
      const { session_id } = req.params;

      // Étape 1 : Récupérer les DepositGames pour cette session
      const depositGames = await DepositGame.findAll({
        include: [
          {
            model: Deposit,
            attributes: [],
            where: { session_id }
          }
        ]
      });

      let totalInitialStocks = 0;
      let totalSoldStocks = 0;

      // Étape 2 : Parcourir chaque jeu déposé et compter la quantité vendue
      for (const depositGame of depositGames) {
        const initialStock = Object.keys(depositGame.exemplaires || {}).length;
        totalInitialStocks += initialStock;

        // Trouver les ventes associées au depositGame
        const salesDetails = await SaleDetail.findAll({
          where: { deposit_game_id: depositGame.deposit_game_id },
          include: [
            {
              model: Sale,
              attributes: [],
              where: { session_id, sale_status: 'finalisé' },
              required: true
            }
          ]
        });

        // Compter la quantité totale vendue
        const soldQuantity = salesDetails.reduce((acc, saleDetail) => acc + saleDetail.quantity, 0);
        totalSoldStocks += soldQuantity;
      }

      const remainingStocks = totalInitialStocks - totalSoldStocks;

      return res.json({
        totalInitialStocks,
        totalSoldStocks,
        remainingStocks
      });
    } catch (error) {
      console.error('Error in getStocksData:', error);
      return res.status(500).json({ error: error.message });
    }
  },
  async getTopGamesBySession(req, res){
    try {
      const { session_id } = req.params;
  
      // Récupérer les SaleDetails pour la session, avec les infos des jeux
      const saleDetails = await SaleDetail.findAll({
        include: [
          {
            model: Sale,
            attributes: [],
            where: {
              session_id,
              sale_status: 'finalisé'
            },
            required: true,
          },
          {
            model: DepositGame,
            include: [
              {
                model: Game,
                attributes: ['name', 'publisher']  // Nom et éditeur du jeu
              }
            ]
          }
        ]
      });
  
      // Agréger les données par jeu
      const gameSales = {};
  
      saleDetails.forEach((detail) => {
        const game = detail.DepositGame?.Game;
        if (!game) return;
  
        const gameId = game.game_id;
        const gameName = game.name;
        const publisher = game.publisher;
        const quantitySold = detail.quantity;
  
        // Prix de chaque exemplaire
        const exemplaires = Object.values(detail.DepositGame?.exemplaires || {});
        const soldExemplaires = exemplaires.slice(0, detail.quantity);
        const totalAmount = soldExemplaires.reduce((acc, ex) => {
          const priceNum = typeof ex.price === 'number' ? ex.price : parseFloat(ex.price || '0');
          return acc + priceNum;
        }, 0);
  
        if (!gameSales[gameId]) {
          gameSales[gameId] = {
            gameName,
            publisher,
            totalQuantity: 0,
            totalAmount: 0
          };
        }
  
        gameSales[gameId].totalQuantity += quantitySold;
        gameSales[gameId].totalAmount += totalAmount;
      });
  
      // Transformer en tableau, trier et prendre les 5 premiers
      const topGames = Object.values(gameSales)
        .sort((a, b) => b.totalAmount - a.totalAmount)  // Tri par montant total décroissant
        .slice(0, 5);  // Prendre les 5 premiers
  
      res.json(topGames);
    } catch (error) {
      console.error('Error in getTopGamesBySession:', error);
      res.status(500).json({ error: error.message });
    }
  },
  async getVendorStats(req, res){
    try {
      const { session_id } = req.params;
  
      // 1) Récupérer les ventes finalisées de la session
      const saleDetails = await SaleDetail.findAll({
        include: [
          {
            model: Sale,
            attributes: [],
            where: {
              session_id,
              sale_status: 'finalisé'
            }
          },
          {
            model: Seller,
            attributes: ['seller_id', 'name'],
          }
        ]
      });
  
      // 2) Agréger les ventes par vendeur
      const vendorSales = {};
      saleDetails.forEach(detail => {
        const sellerId = detail.seller_id;
        if (!vendorSales[sellerId]) {
          vendorSales[sellerId] = {
            sellerName: detail.Seller?.name || `Seller #${sellerId}`,
            totalSales: 0
          };
        }
        vendorSales[sellerId].totalSales += detail.quantity;
      });
  
      // 3) Calculer le nombre total de vendeurs et le vendeur le plus actif
      const vendorsArray = Object.values(vendorSales);
      const totalVendors = vendorsArray.length;
      const topVendor = vendorsArray.sort((a, b) => b.totalSales - a.totalSales)[0] || {
        sellerName: 'Aucun vendeur',
        totalSales: 0
      };
  
      return res.json({
        totalVendors,
        topVendor
      });
    } catch (error) {
      console.error('Error in getVendorStats:', error);
      return res.status(500).json({ error: error.message });
    }
  },
 
};