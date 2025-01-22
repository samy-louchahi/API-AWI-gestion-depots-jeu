// saleDetailController.js

const { SaleDetail, Sale, DepositGame } = require('../models');

module.exports = {
  /**
   * CREATE : POST /api/sale-details
   * body = { sale_id, deposit_game_id, quantity }
   */
  async createSaleDetail(req, res) {
    try {
      const { sale_id, deposit_game_id, quantity } = req.body;

      // 1. Vérifier que la vente (Sale) existe
      const sale = await Sale.findByPk(sale_id);
      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }

      // 2. Vérifier que le DepositGame existe
      const depositGame = await DepositGame.findByPk(deposit_game_id);
      if (!depositGame) {
        return res.status(404).json({ error: 'DepositGame not found' });
      }

      // 3. Créer le SaleDetail
      const newSaleDetail = await SaleDetail.create({
        sale_id,
        deposit_game_id,
        quantity: quantity || 1
      });

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
      // On peut inclure Sale et DepositGame pour plus d'infos
      const saleDetails = await SaleDetail.findAll({
        include: [Sale, DepositGame]
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