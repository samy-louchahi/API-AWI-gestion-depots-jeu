const { where } = require('sequelize');
const { SaleDetail, Sale, DepositGame, Deposit, Seller, Stock, Game } = require('../models');

module.exports = {
  /**
   * CREATE : POST /api/sale-details
   * body = { sale_id, deposit_game_id, quantity }
   */
  async createSaleDetail(req, res) {
    try {
      const { sale_id, deposit_game_id, quantity } = req.body;

      // 1) Vérifier la vente
      const sale = await Sale.findByPk(sale_id);
      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }

      // 2) Vérifier le DepositGame
      //    inclure: [Deposit, Game, Seller => via Deposit, etc.]
      const depositGame = await DepositGame.findByPk(deposit_game_id, {
        include: [
          {
            model: Deposit,
            as: 'Deposit',
            include: [
              {
                model: Seller,
                as: 'Seller'
              },
            ]
          },
          {
            model: Game,
            as: 'Game'
          }
        ]
      });
      if (!depositGame) {
        return res.status(404).json({ error: 'DepositGame not found' });
      }

      // 3) Récupérer le seller_id via depositGame.Deposit
      const seller = depositGame.Deposit?.Seller;
      if (!seller) {
        return res.status(400).json({ error: 'Seller not found for this DepositGame' });
      }

      // 4) Créer le SaleDetail
      const newSaleDetail = await SaleDetail.create({
        sale_id,
        deposit_game_id,
        quantity: quantity || 1,
        seller_id: seller.seller_id
      });

      // 5) Mettre à jour le stock si besoin
      if (depositGame) {
        const game_id = depositGame.game_id;
        const stock = await Stock.findOne({ where: { game_id } });
        if (stock) {
          stock.current_quantity -= quantity;
          await stock.save();
        }
      }

      return res.status(201).json(newSaleDetail);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * READ ALL : GET /api/sale-details
   */
  async findAllSaleDetails(req, res) {
    try {
      const { seller_id } = req.query;
      const where = {};

      if (seller_id) {
        where.seller_id = seller_id;
      }

      const saleDetails = await SaleDetail.findAll({
        where,
        include: [
          {
            model: Sale,
            include: [/* Ajouter d'autres modèles si nécessaire */]
          },
          {
          model: DepositGame,
          include: [Game]
          }
        ]
      });

      return res.json(saleDetails);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * READ ONE : GET /api/sale-details/:id
   */
  async findSaleDetailById(req, res) {
    try {
      const { id } = req.params;
      const saleDetail = await SaleDetail.findByPk(id, {
        include: [Sale, DepositGame]
      });
      if (!saleDetail) {
        return res.status(404).json({ error: 'SaleDetail not found' });
      }
      return res.json(saleDetail);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * UPDATE : PUT /api/sale-details/:id
   */
  async updateSaleDetail(req, res) {
    try {
      const { id } = req.params;
      const { sale_id, deposit_game_id, quantity } = req.body;

      const saleDetail = await SaleDetail.findByPk(id);
      if (!saleDetail) {
        return res.status(404).json({ error: 'SaleDetail not found' });
      }

      // Vérifier si on veut changer la vente associée (optionnel)
      if (sale_id) {
        const sale = await Sale.findByPk(sale_id);
        if (!sale) {
          return res.status(404).json({ error: 'Sale not found' });
        }
        saleDetail.sale_id = sale_id;
      }

      // Vérifier si on veut changer le deposit_game_id
      if (deposit_game_id) {
        const depositGame = await DepositGame.findByPk(deposit_game_id);
        if (!depositGame) {
          return res.status(404).json({ error: 'DepositGame not found' });
        }
        saleDetail.deposit_game_id = deposit_game_id;
      }

      if (quantity !== undefined) {
        saleDetail.quantity = quantity;
      }

      await saleDetail.save();

      return res.json(saleDetail);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * DELETE : DELETE /api/sale-details/:id
   */
  async deleteSaleDetail(req, res) {
    try {
      const { id } = req.params;
      const saleDetail = await SaleDetail.findByPk(id);
      if (!saleDetail) {
        return res.status(404).json({ error: 'SaleDetail not found' });
      }

      await saleDetail.destroy();
      return res.json({ message: 'SaleDetail deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
};