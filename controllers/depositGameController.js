// controllers/depositGameController.js
const { DepositGame, Deposit, Game, Stock } = require('../models');
const sequelize = require('../models/index').sequelize;

exports.createDepositGame = async ({ deposit_id, game_id, fees, quantity, exemplaires }) => {
  const transaction = await sequelize.transaction();
  try {
    console.log('Données reçues:', { deposit_id, game_id, fees, quantity, exemplaires });

    // Vérifier que le Deposit existe
    const deposit = await Deposit.findByPk(deposit_id, { transaction });
    if (!deposit) {
      await transaction.rollback();
      return { status: 404, error: 'Deposit not found' };
    }

    // Vérifier que le Game existe
    const game = await Game.findByPk(game_id, { transaction });
    if (!game) {
      await transaction.rollback();
      return { status: 404, error: 'Game not found' };
    }

    // Créer le DepositGame
    const newDepositGame = await DepositGame.create({
      deposit_id,
      game_id,
      fees,
      exemplaires // Ce champ est maintenant un tableau d'objets
    }, { transaction });

    // Mise à jour du stock (la quantité correspond au nombre d'exemplaires)
    const { session_id, seller_id } = deposit;
    let stock = await Stock.findOne({
      where: { session_id, seller_id, game_id }
    }, { transaction });

    if (stock) {
      stock.initial_quantity += quantity;
      stock.current_quantity += quantity;
      await stock.save({ transaction });
    } else {
      stock = await Stock.create({
        session_id,
        seller_id,
        game_id,
        initial_quantity: quantity,
        current_quantity: quantity
      }, { transaction });
    }

    await transaction.commit();
    return { depositGame: newDepositGame, updatedStock: stock };
  } catch (error) {
    console.error('Erreur lors de la création du DepositGame:', error);
    await transaction.rollback();
    throw error;
  }
};

// READ ALL
exports.getAllDepositGames = async (req, res) => {
  try {
    const depositGames = await DepositGame.findAll({
      include: [Deposit, Game]
    });
    return res.json(depositGames);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// READ ONE
exports.getDepositGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const depositGame = await DepositGame.findByPk(id, { include: [Deposit, Game] });
    if (!depositGame) {
      return res.status(404).json({ error: 'DepositGame not found' });
    }
    return res.json(depositGame);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.updateDepositGame = async (req, res) => {
  try {
    const { id } = req.params;
    const { deposit_id, game_id, fees, states, prices } = req.body;

    const depositGame = await DepositGame.findByPk(id);
    if (!depositGame) {
      return res.status(404).json({ error: 'DepositGame not found' });
    }

    depositGame.deposit_id = deposit_id || depositGame.deposit_id;
    depositGame.game_id = game_id || depositGame.game_id;
    depositGame.fees = fees !== undefined ? fees : depositGame.fees;
    // Autoriser la mise à jour des tableaux states et prices si fournis
    if (states) depositGame.states = states;
    if (prices) depositGame.prices = prices;

    await depositGame.save();
    return res.json(depositGame);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// DELETE
exports.deleteDepositGame = async (req, res) => {
  try {
    const { id } = req.params;
    const depositGame = await DepositGame.findByPk(id);
    if (!depositGame) {
      return res.status(404).json({ error: 'DepositGame not found' });
    }
    await depositGame.destroy();
    return res.json({ message: 'DepositGame deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};