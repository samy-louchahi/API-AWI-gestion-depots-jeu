const { Deposit, DepositGame, Session, Seller, Game } = require('../models');
// Assure-toi d'importer tous les modèles nécessaires

module.exports = {
  /**
   * Créer un dépôt et (optionnellement) créer une liste d'associations DepositGame
   * ex: 
   * POST /api/deposits
   * {
   *   "seller_id": 1,
   *   "session_id": 2,
   *   "discount_fees": 10,
   *   "deposit_date": "2025-01-25",
   *   "games": [
   *      { "game_id": 10, "price": 20, "fees": 3 },
   *      { "game_id": 11, "price": 30, "fees": 5 }
   *   ]
   * }
   */
  async create(req, res) {
    try {
      const {
        seller_id,
        session_id,
        discount_fees,
        deposit_date,
        games // tableau d'objets { game_id, price, fees }
      } = req.body;

      //Vérifier l'existence de la Session et du Seller
    const session = await Session.findByPk(session_id);
    if (!session) return res.status(400).json({ error: 'Session not found' });
    const seller = await Seller.findByPk(seller_id);
    if (!seller) return res.status(400).json({ error: 'Seller not found' });
      
      // 2. Créer le dépôt
      const newDeposit = await Deposit.create({
        seller_id,
        session_id,
        deposit_date,
        discount_fees
      });

      //Créer les DepositGame s'il y a un tableau "games"
      //Chaque DepositGame aura un label auto-généré via le hook beforeCreate (dans DepositGame)
      if (Array.isArray(games)) {
        for (const g of games) {
          await DepositGame.create({
            deposit_id: newDeposit.deposit_id,
            game_id: g.game_id,
            price: g.price,
            fees: g.fees
          });
        }
      }

      //Renvoyer le dépôt, éventuellement avec les DepositGame créés
      //On peut faire un "reload" avec include pour récupérer les associations
      const depositWithGames = await Deposit.findByPk(newDeposit.deposit_id, {
        include: [DepositGame]
      });

      return res.status(201).json(depositWithGames);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  },

  /**
   * Récupérer tous les dépôts (avec ou sans leurs DepositGame)
   */
  async findAll(req, res) {
    try {
      const deposits = await Deposit.findAll({
        // Pour inclure toutes les DepositGame associées + la table 'Game' si besoin
        include: [
          {
            model: DepositGame,
            include: [Game]
          },
          // Éventuellement inclure Seller, Session...
          // { model: Seller },
          // { model: Session }
        ]
      });
      return res.status(200).json(deposits);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  },

  /**
   * Récupérer un dépôt précis par son ID
   */
  async findOne(req, res) {
    try {
      const { id } = req.params;
      const deposit = await Deposit.findByPk(id, {
        include: [
          {
            model: DepositGame,
            include: [Game]
          }
        ]
      });
      if (!deposit) {
        return res.status(404).json({ error: 'Deposit not found' });
      }
      return res.status(200).json(deposit);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  },

  /**
   * Mettre à jour un dépôt
   * (Note: la mise à jour des DepositGame est gérée dans un autre endpoint ou en complément)
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const [updated] = await Deposit.update(req.body, {
        where: { deposit_id: id }
      });
      if (!updated) {
        return res.status(404).json({ error: 'Deposit not found' });
      }
      const updatedDeposit = await Deposit.findByPk(id, {
        include: [DepositGame]
      });
      return res.status(200).json(updatedDeposit);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  },

  /**
   * Supprimer un dépôt
   * (Optionnel: supprimer aussi les DepositGame associés ?)
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      // Optionnel : supprimer d'abord les DepositGame associés
      // await DepositGame.destroy({ where: { deposit_id: id } });

      const deleted = await Deposit.destroy({
        where: { deposit_id: id }
      });
      if (!deleted) {
        return res.status(404).json({ error: 'Deposit not found' });
      }
      return res.status(204).json();
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  }
};