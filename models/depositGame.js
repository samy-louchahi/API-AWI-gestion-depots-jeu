// depositGame.js
const { v4: uuidv4 } = require('uuid'); // ou nanoid, shortid, etc.

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DepositGame extends Model {
    static associate(models) {
      DepositGame.belongsTo(models.Deposit, { foreignKey: 'deposit_id' });
      DepositGame.belongsTo(models.Game, { foreignKey: 'game_id' });
    }
  }
  DepositGame.init({
    deposit_game_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    fees: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    deposit_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    game_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'DepositGame',
  });
  DepositGame.addHook('beforeCreate', (depositGame) => {
    depositGame.label = uuidv4(); // Génère un label unique
  });

  return DepositGame;
};