// saleOperationController.js

const { SalesOperation, Sale, Session } = require('../models');

module.exports = {
  /**
   * CREATE : POST /api/sale-operations
   * body = { sale_id, commission, sale_status, sale_date }
   */
  async createSaleOperation(req, res) {
    try {
      const { sale_id, commission, sale_status, sale_date } = req.body;

      // Vérifier que la vente existe
      const sale = await Sale.findByPk(sale_id);
      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }
      const session = await Session.findByPk(sale.session_id);

      const commissionRate = session.commission_rate;

      // Créer la saleOperation
      const newOp = await SalesOperation.create({
        sale_id,
        commission : commissionRate,
        sale_status: sale_status || 'en cours',
        sale_date: sale_date || new Date()
      });

      return res.status(201).json(newOp);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * READ ALL : GET /api/sale-operations
   */
  async findAllSaleOperations(req, res) {
    try {
      const ops = await SalesOperation.findAll({
        include: [Sale]
      });
      return res.json(ops);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * READ ONE : GET /api/sale-operations/:id
   */
  async findSaleOperationById(req, res) {
    try {
      const { id } = req.params;
      const op = await SalesOperation.findByPk(id, {
        include: [Sale]
      });
      if (!op) {
        return res.status(404).json({ error: 'SaleOperation not found' });
      }
      return res.json(op);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * UPDATE : PUT /api/sale-operations/:id
   */
  async updateSaleOperation(req, res) {
    try {
      const { id } = req.params;
      const { sale_id, commission, sale_status, sale_date } = req.body;

      const op = await SalesOperation.findByPk(id);
      if (!op) {
        return res.status(404).json({ error: 'SaleOperation not found' });
      }

      if (sale_id) {
        const sale = await Sale.findByPk(sale_id);
        if (!sale) {
          return res.status(404).json({ error: 'Sale not found' });
        }
        op.sale_id = sale_id;
      }

      if (commission !== undefined) {
        op.commission = commission;
      }
      if (sale_status) {
        op.sale_status = sale_status;
      }
      if (sale_date) {
        op.sale_date = sale_date;
      }

      await op.save();
      return res.json(op);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * DELETE : DELETE /api/sale-operations/:id
   */
  async deleteSaleOperation(req, res) {
    try {
      const { id } = req.params;
      const op = await SalesOperation.findByPk(id);
      if (!op) {
        return res.status(404).json({ error: 'SaleOperation not found' });
      }

      await op.destroy();
      return res.json({ message: 'SaleOperation deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
};