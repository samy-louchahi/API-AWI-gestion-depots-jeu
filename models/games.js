'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Games extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Games.belongsTo(models.Seller, { foreignKey: 'seller_id' }); // a game belongs to a seller
        Games.belongsTo(models.Stock, { foreignKey: 'stock_id' }); // a game belongs to a stock
        Games.hasOne(models.Sale, { foreignKey: 'game_id', allowNull: true }); // a game can have one sale or no sale
        Games.hasOne(models.SalesOperation, { foreignKey: 'game_id', allowNull: true }); // a game can have one sales operation or no sales operation
    }
  }
  Games.init({
    game_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement},
    name: DataTypes.STRING,
    publisher: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    seller_id: DataTypes.INTEGER,
    stock_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Games',
  });
  return Games;
};