// depositGameController.js

const { DepositGame, Deposit, Game, Stock , Session} = require('../models'); 

// CREATE
exports.createDepositGame = async (req, res) => {
    try {
      const { deposit_id, game_id, fees, price } = req.body;
  
      // vérifier que le Deposit existe
      const deposit = await Deposit.findByPk(deposit_id);
      if (!deposit) return res.status(404).json({ error: 'Deposit not found' });
  
      // vérifier que le Game existe
      const game = await Game.findByPk(game_id);
      if (!game) return res.status(404).json({ error: 'Game not found' });

      const session = await Session.findByPk(deposit.session_id);

      const depositGameFees = session.fees;
        
      // Création de la ligne DepositGame
      const newDepositGame = await DepositGame.create({
        deposit_id,
        game_id,
        fees : depositGameFees,
        price
        // label est auto-généré via un hook "beforeCreate"
      });
  
      // ---- MISE À JOUR DU STOCK ----
      // 1) Récupérer la session et le seller_id depuis le deposit
      const { session_id, seller_id } = deposit; 
      // (si le seller_id, session_id sont stockés directement dans Deposit)
  
      // 2) Vérifier s'il existe déjà une ligne de stock pour (session_id, seller_id, game_id)
      let stock = await Stock.findOne({
        where: {
          session_id,
          seller_id,
          game_id
        }
      });
  
      if (stock) {
        // Incrémente la quantité
        // (est-ce qu'on incrémente "initial_quantity" ou juste "current_quantity" ? 
        //  à toi de décider. Souvent, on incrémente les deux si on considère 
        //  qu'on a un exemplaire de plus dans ce dépôt)
        stock.initial_quantity += 1;
        stock.current_quantity += 1;
        await stock.save();
      } else {
        // 3) Sinon, on crée une nouvelle ligne stock
        stock = await Stock.create({
          session_id,
          seller_id,
          game_id,
          // On pose initialement 1 exemplaire
          initial_quantity: 1,
          current_quantity: 1
        });
      }
      // ---- FIN MISE À JOUR DU STOCK ----
  
      return res.status(201).json({
        depositGame: newDepositGame,
        updatedStock: stock
      });
    } catch (error) {
      console.error(error);
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