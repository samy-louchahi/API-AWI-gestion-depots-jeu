const stockController = require('./stockController');
const { DepositGame, Deposit, Game, Stock , Session} = require('../models'); 

// CREATE
exports.createDepositGame = async (req, res) => {
  console.log('=== createDepositGame Appelé ===');
  const transaction = await sequelize.transaction();
  try {
    console.log('Données reçues:', req.body); 
    const { deposit_id, game_id, fees, price, quantity } = req.body;

    // Vérifier que le Deposit existe
    const deposit = await Deposit.findByPk(deposit_id, { transaction });
    if (!deposit) {
      console.log(`Deposit avec ID ${deposit_id} non trouvé.`);
      await transaction.rollback();
      return res.status(404).json({ error: 'Deposit not found' });
    }

    console.log('Deposit trouvé:', deposit);

    // Vérifier que le Game existe
    const game = await Game.findByPk(game_id, { transaction });
    if (!game) {
      console.log(`Game avec ID ${game_id} non trouvé.`);
      await transaction.rollback();
      return res.status(404).json({ error: 'Game not found' });
    }

    console.log('Game trouvé:', game);

    // Récupérer la session associée au deposit
    const session = await Session.findByPk(deposit.session_id, { transaction });
    if (!session) {
      console.log(`Session avec ID ${deposit.session_id} non trouvée.`);
      await transaction.rollback();
      return res.status(404).json({ error: 'Session not found' });
    }

    console.log('Session trouvée:', session);

    const depositGameFees = session.fees;
      
    // Création de la ligne DepositGame
    const newDepositGame = await DepositGame.create({
      deposit_id,
      game_id,
      fees: depositGameFees,
      price,
      quantity
      // label est auto-généré via un hook "beforeCreate"
    }, { transaction });

    console.log('DepositGame créé:', newDepositGame);

    // ---- MISE À JOUR DU STOCK ----
    // Récupérer session_id et seller_id depuis le deposit
    const { session_id, seller_id } = deposit; 
    console.log(`Mise à jour du stock pour seller_id: ${seller_id}, session_id: ${session_id}, game_id: ${game_id}, quantity: ${quantity}`);

    // Vérifier s'il existe déjà une ligne de stock pour (session_id, seller_id, game_id)
    let stock = await Stock.findOne({
      where: {
        session_id,
        seller_id,
        game_id
      }
    }, { transaction });

    if (stock) {
      console.log('Stock existant trouvé:', stock);
      // Incrémente la quantité basée sur `quantity`
      stock.initial_quantity += quantity;
      stock.current_quantity += quantity;
      await stock.save({ transaction });
      console.log('Stock mis à jour:', stock);
    } else {
      console.log('Aucun stock existant trouvé. Création d\'un nouveau stock.');
      // Créer une nouvelle ligne stock
      stock = await Stock.create({
        session_id,
        seller_id,
        game_id,
        initial_quantity: quantity,
        current_quantity: quantity
      }, { transaction });
      console.log('Nouveau stock créé:', stock);
    }
    // ---- FIN MISE À JOUR DU STOCK ----

    await transaction.commit();

    return res.status(201).json({
      depositGame: newDepositGame,
      updatedStock: stock
    });
  } catch (error) {
    console.error('Erreur lors de la création du DepositGame:', error);
    await transaction.rollback();
    return res.status(500).json({ error: error.message });
  }
};

// READ ALL
exports.getAllDepositGames = async (req, res) => {
  try {
    // On peut inclure les infos du dépôt et du jeu si besoin
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
    const depositGame = await DepositGame.findByPk(id, {
      include: [Deposit, Game]
    });
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
    const { deposit_id, game_id, fees, price } = req.body;

    const depositGame = await DepositGame.findByPk(id);
    if (!depositGame) {
      return res.status(404).json({ error: 'DepositGame not found' });
    }

    // Mise à jour des champs
    // Attention : le label est généralement unique et géré par le hook,
    // on ne le modifie pas. On peut s'abstenir de le toucher.
    depositGame.deposit_id = deposit_id || depositGame.deposit_id;
    depositGame.game_id = game_id || depositGame.game_id;
    depositGame.fees = fees !== undefined ? fees : depositGame.fees;
    depositGame.price = price !== undefined ? price : depositGame.price;

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