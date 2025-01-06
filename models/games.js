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
        Game.belongsTo(models.Seller, { foreignKey: 'seller_id' }); // a game belongs to a seller
        Game.belongsTo(models.Stock, { foreignKey: 'stock_id' }); // a game belongs to a stock
        Game.belongsTo(models.Deposit, { foreignKey: 'deposit_id' }); // a game belongs to a deposit
        Game.hasOne(models.Sale, { foreignKey: 'game_id', allowNull: true }); // a game can have one sale or no sale
        Game.hasOne(models.SalesOperation, { foreignKey: 'game_id', allowNull: true }); // a game can have one sales operation or no sales operation

    }
  }
  Game.init({
    game_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
      },
    name: DataTypes.STRING,
    publisher: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    seller_id: DataTypes.INTEGER,
    stock_id: DataTypes.INTEGER,
    deposit_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Game',
  });
  return Game;
};