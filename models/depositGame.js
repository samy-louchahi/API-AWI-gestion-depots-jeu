// models/depositGame.js
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
      allowNull: true,
      unique: true
    },
    fees: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    deposit_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    game_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    exemplaires: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [] // Par défaut, aucun exemplaire n'est déposé
    }
  }, {
    sequelize,
    modelName: 'DepositGame',
    tableName: 'deposit_games'
  });

  DepositGame.addHook('beforeCreate', (depositGame) => {
    depositGame.label = require('uuid').v4(); // Génère un label unique
  });

  return DepositGame;
};