'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Game.belongsTo(models.Stock, { foreignKey: 'stock_id' }); // a game belongs to a stock
        Game.hasMany(models.DepositGame, { foreignKey: 'game_id' }); // a game can have many deposit games
        Game.hasOne(models.Sale, { foreignKey: 'game_id', allowNull: true }); // a game can have one sale or no sale
        Game.hasOne(models.SalesOperation, { foreignKey: 'game_id', allowNull: true }); // a game can have one sales operation or no sales operation

    }
  }
  Game.init({
    game_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
      },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    publisher: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Game',
  });
  return Game;
};