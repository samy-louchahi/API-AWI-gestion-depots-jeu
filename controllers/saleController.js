// saleController.js

const { Sale, Buyer, Session, SaleDetail, DepositGame } = require('../models');

module.exports = {
  /**
   * CREATE : POST /api/sales
   * body = { buyer_id?, session_id, sale_date? } 
   */
  async createSale(req, res) {
    try {
      const { buyer_id, session_id, sale_date, sale_status } = req.body;

      // Vérifier la session
      const session = await Session.findByPk(session_id);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      // Vérifier le buyer si fourni
      if (buyer_id) {
        const buyer = await Buyer.findByPk(buyer_id);
        if (!buyer) {
          return res.status(404).json({ error: 'Buyer not found' });
        }
      }

      // Créer la vente
      const newSale = await Sale.create({
        buyer_id: buyer_id || null,
        session_id,
        sale_date: sale_date || new Date(),
        sale_status: sale_status || 'en cours'
      });

      return res.status(201).json(newSale);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * READ ALL : GET /api/sales
   */
  async findAllSales(req, res) {
    try {
      // Inclure Buyer, Session
      const sales = await Sale.findAll({
        include: [
            Buyer,
            Session,
            { model: SaleDetail, include: [DepositGame] }
          ]
      });
      return res.json(sales);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * READ ONE : GET /api/sales/:id
   */
  async findSaleById(req, res) {
    try {
      const { id } = req.params;
      const sale = await Sale.findByPk(id, {
        include: [Buyer, Session]
      });
      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }
      return res.json(sale);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * UPDATE : PUT /api/sales/:id
   */
  async updateSale(req, res) {
    try {
      const { id } = req.params;
      const { buyer_id, session_id, sale_date, sale_status } = req.body;

      const sale = await Sale.findByPk(id);
      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }

      // Vérif Buyer
      if (buyer_id) {
        // check buyer
        // ...
        sale.buyer_id = buyer_id;
      }

      // Vérif Session
      if (session_id) {
        // check session
        // ...
        sale.session_id = session_id;
      }

      if (sale_date) {
        sale.sale_date = sale_date;
      }
      if (sale_status) {
        sale.sale_status = sale_status;
      }

      await sale.save();

      return res.json(sale);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * DELETE : DELETE /api/sales/:id
   * (Optionnel : supprimer les SaleDetail associés ? 
   *  ou bien on laisse le code métier décider)
   */
  async deleteSale(req, res) {
    try {
      const { id } = req.params;
      const sale = await Sale.findByPk(id);
      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }

      // Optionnel : supprimer les SaleDetail avant
      // await SaleDetail.destroy({ where: { sale_id: id } });

      await sale.destroy();
      return res.json({ message: 'Sale deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
};