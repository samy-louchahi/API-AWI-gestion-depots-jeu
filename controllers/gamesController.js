// controllers/gameController.js

const { Game, DepositGame, Stock, Seller } = require('../models');

module.exports = {
  /**
   * CREATE: POST /api/games
   * Body attendu: { name, publisher }
   */
  async createGame(req, res) {
    try {
      const { name, publisher } = req.body;

      // Vérification des champs obligatoires
      if (!name || !publisher) {
        return res.status(400).json({ error: 'Missing required fields: name, publisher' });
      }

      // Création du jeu
      const newGame = await Game.create({ name, publisher });

      return res.status(201).json(newGame);
    } catch (error) {
      console.error('Erreur lors de la création du jeu:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * READ ALL: GET /api/games
   * Récupérer la liste de tous les jeux, avec leurs relations si nécessaire
   */
  async findAllGames(req, res) {
    try {
      const games = await Game.findAll({
        include: [
          { model: DepositGame }, // Inclure les associations avec DepositGame
          // Ajoute d'autres inclusions si nécessaire
        ]
      });
      return res.json(games);
    } catch (error) {
      console.error('Erreur lors de la récupération des jeux:', error);
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
          { model: DepositGame, as: 'depositGames' }, // Inclure les associations avec DepositGame
          // Ajoute d'autres inclusions si nécessaire
        ]
      });
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }
      return res.json(game);
    } catch (error) {
      console.error('Erreur lors de la récupération du jeu:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * UPDATE: PUT /api/games/:id
   * Body possible: { name, publisher }
   */
  async updateGame(req, res) {
    try {
      const { id } = req.params;
      const { name, publisher } = req.body;

      // Récupérer le jeu
      const game = await Game.findByPk(id);
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
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
      console.error('Erreur lors de la mise à jour du jeu:', error);
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

      // Optionnel: vérifier s'il existe des DepositGame liés
      // Par exemple, empêcher la suppression si des associations existent
      const associatedDepositGames = await DepositGame.findAll({ where: { game_id: id } });
      if (associatedDepositGames.length > 0) {
        return res.status(400).json({ error: 'Cannot delete game with associated deposit games' });
      }

      await game.destroy();
      return res.json({ message: 'Game deleted successfully' });
    } catch (error) {
      console.error('Erreur lors de la suppression du jeu:', error);
      return res.status(500).json({ error: error.message });
    }
  },
  async getGameStocks(req, res) {
    const gameId = req.params.id;

    try {
        // Vérifier si le jeu existe
        const game = await Game.findByPk(gameId);
        if (!game) {
            return res.status(404).json({ error: 'Jeu non trouvé.' });
        }

        // Récupérer tous les stocks associés à ce jeu, incluant les informations sur les vendeurs
        const stocks = await Stock.findAll({
          where: { game_id: gameId },
          include: [
            { model: Seller, attributes: ['seller_id', 'name'] }
          ]
        });

        res.status(200).json(stocks);
    } catch (error) {
        console.error('Erreur dans getGameStocks:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des stocks du jeu.' });
    }
  }
};