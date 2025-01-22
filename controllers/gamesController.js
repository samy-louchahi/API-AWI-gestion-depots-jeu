// gameController.js

const { Game, Stock, Sale, SalesOperation, DepositGame } = require('../models');

module.exports = {
  /**
   * CREATE: POST /api/games
   * Body attendu: { name, publisher, stock_id? }
   */
  async createGame(req, res) {
    try {
      const { name, publisher, stock_id } = req.body;

      // Vérification des champs obligatoires
      if (!name || !publisher) {
        return res.status(400).json({ error: 'Missing required fields: name, publisher' });
      }

      // Optionnel : vérifier que le stock existe si un stock_id est fourni
      let stock = null;
      if (stock_id) {
        stock = await Stock.findByPk(stock_id);
        if (!stock) {
          return res.status(404).json({ error: 'Stock not found' });
        }
      }

      // Création du jeu
      const newGame = await Game.create({
        name,
        publisher,
        stock_id: stock ? stock.stock_id : null
      });

      return res.status(201).json(newGame);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * READ ALL: GET /api/games
   * Récupérer la liste de tous les jeux, avec leurs relations si nécessaire
   */
  async findAllGames(req, res) {
    try {
      // On peut inclure Stock, Sale, SalesOperation, etc.
      const games = await Game.findAll({
        include: [
          { model: Stock },         // si tu veux récupérer les infos de stock
          { model: DepositGame },   // liste des dépôts
          { model: Sale },          // s'il y a une vente
          { model: SalesOperation } // s'il y a une opération de vente
        ]
      });
      return res.json(games);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * READ ONE: GET /api/games/:id
   */
  async findGameById(req, res) {
    try {
      const { id } = req.params;
      const game = await Game.findByPk(id, {
        include: [
          { model: Stock },
          { model: DepositGame },
          { model: Sale },
          { model: SalesOperation }
        ]
      });
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }
      return res.json(game);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * UPDATE: PUT /api/games/:id
   * Body possible: { name, publisher, stock_id? }
   */
  async updateGame(req, res) {
    try {
      const { id } = req.params;
      const { name, publisher, stock_id } = req.body;

      // Récupérer le jeu
      const game = await Game.findByPk(id);
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      // Vérifier si un stock_id est fourni
      if (stock_id !== undefined) {
        const stock = await Stock.findByPk(stock_id);
        if (!stock) {
          return res.status(404).json({ error: 'Stock not found' });
        }
        game.stock_id = stock_id;
      }

      // Mettre à jour les champs s'ils sont fournis
      if (name !== undefined) {
        game.name = name;
      }
      if (publisher !== undefined) {
        game.publisher = publisher;
      }

      await game.save();

      return res.json(game);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * DELETE: DELETE /api/games/:id
   */
  async deleteGame(req, res) {
    try {
      const { id } = req.params;
      const game = await Game.findByPk(id);
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      // Optionnel: vérifier s'il existe des DepositGame, Sale, etc. liés
      // On peut décider de bloquer la suppression si le jeu a déjà été déposé/vendu
      // ou bien supprimer en cascade, selon ta logique

      await game.destroy();
      return res.json({ message: 'Game deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
};