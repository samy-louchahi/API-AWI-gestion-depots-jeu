// stockController.js

const { Stock, Session, Seller, Game } = require('../models');

module.exports = {
  /**
   * CREATE : POST /api/stocks
   * Body attendu : {
   *   session_id,
   *   seller_id,
   *   game_id,
   *   initial_quantity,
   *   current_quantity
   * }
   */
  async createStock(req, res) {
    try {
      const {
        session_id,
        seller_id,
        game_id,
        initial_quantity,
        current_quantity
      } = req.body;

      // 1. Vérifier que la session existe
      const session = await Session.findByPk(session_id);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      // 2. Vérifier que le seller existe
      const seller = await Seller.findByPk(seller_id);
      if (!seller) {
        return res.status(404).json({ error: 'Seller not found' });
      }

      // 3. Vérifier que le game existe
      const game = await Game.findByPk(game_id);
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      // 4. Vérifier initial_quantity et current_quantity (>= 0)
      if (initial_quantity < 0 || current_quantity < 0) {
        return res.status(400).json({ error: 'Quantities must be >= 0' });
      }
      if (current_quantity > initial_quantity) {
        return res.status(400).json({
          error: 'current_quantity cannot exceed initial_quantity'
        });
      }

      // 5. Créer l'enregistrement de stock
      const newStock = await Stock.create({
        session_id,
        seller_id,
        game_id,
        initial_quantity,
        current_quantity
      });

      return res.status(201).json(newStock);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * READ ALL : GET /api/stocks
   */
  async findAllStocks(req, res) {
    try {
      const { seller_id, session_id, game_id } = req.query;
      const where = {};

      if (seller_id) {
        where.seller_id = seller_id;
      }

      if (session_id) {
        where.session_id = session_id;
      }

      if (game_id) {
        where.game_id = game_id;
      }

      const stocks = await Stock.findAll({
        where,
        include: [Session, Seller, Game]
      });

      return res.json(stocks);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },


  /**
   * READ ONE : GET /api/stocks/:id
   */
  async findStockById(req, res) {
    try {
      const { id } = req.params;
      const stock = await Stock.findByPk(id, {
        include: [Session, Seller, Game]
      });
      if (!stock) {
        return res.status(404).json({ error: 'Stock not found' });
      }
      return res.json(stock);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * UPDATE : PUT /api/stocks/:id
   * Body possible : { session_id, seller_id, game_id, initial_quantity, current_quantity }
   */
  async updateStock(req, res) {
    try {
      const { id } = req.params;
      const {
        session_id,
        seller_id,
        game_id,
        initial_quantity,
        current_quantity
      } = req.body;

      // 1. Récupérer l'enregistrement stock
      const stock = await Stock.findByPk(id);
      if (!stock) {
        return res.status(404).json({ error: 'Stock not found' });
      }

      // 2. Vérifier session si modifiée
      if (session_id !== undefined && session_id !== stock.session_id) {
        const session = await Session.findByPk(session_id);
        if (!session) {
          return res.status(404).json({ error: 'Session not found' });
        }
        stock.session_id = session_id;
      }

      // 3. Vérifier seller si modifié
      if (seller_id !== undefined && seller_id !== stock.seller_id) {
        const seller = await Seller.findByPk(seller_id);
        if (!seller) {
          return res.status(404).json({ error: 'Seller not found' });
        }
        stock.seller_id = seller_id;
      }

      // 4. Vérifier game si modifié
      if (game_id !== undefined && game_id !== stock.game_id) {
        const game = await Game.findByPk(game_id);
        if (!game) {
          return res.status(404).json({ error: 'Game not found' });
        }
        stock.game_id = game_id;
      }

      // 5. Mettre à jour les quantités si fournies
      if (initial_quantity !== undefined) {
        if (initial_quantity < 0) {
          return res.status(400).json({ error: 'initial_quantity >= 0' });
        }
        // Si current_quantity > initial_quantity => erreur
        if (stock.current_quantity > initial_quantity) {
          return res.status(400).json({
            error: 'Cannot set initial_quantity below current_quantity'
          });
        }
        stock.initial_quantity = initial_quantity;
      }

      if (current_quantity !== undefined) {
        if (current_quantity < 0) {
          return res.status(400).json({ error: 'current_quantity >= 0' });
        }
        // current_quantity cannot exceed initial_quantity
        const iQty = initial_quantity !== undefined ? initial_quantity : stock.initial_quantity;
        if (current_quantity > iQty) {
          return res.status(400).json({
            error: 'current_quantity cannot exceed initial_quantity'
          });
        }
        stock.current_quantity = current_quantity;
      }

      await stock.save();
      return res.json(stock);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * DELETE : DELETE /api/stocks/:id
   */
  async deleteStock(req, res) {
    try {
      const { id } = req.params;
      const stock = await Stock.findByPk(id);
      if (!stock) {
        return res.status(404).json({ error: 'Stock not found' });
      }

      // Optionnel : Vérifier si stock est référencé dans d'autres entités
      // (ex. si on autorise la suppression alors que la vente est en cours)

      await stock.destroy();
      return res.json({ message: 'Stock deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
};