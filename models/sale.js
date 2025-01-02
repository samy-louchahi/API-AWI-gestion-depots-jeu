'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Sale.belongsTo(models.Game, {foreignKey: 'game_id'});
      Sale.belongsTo(models.Seller, {foreignKey: 'seller_id'});
      Sale.belongsTo(models.Buyer, {foreignKey: 'buyer_id'});
      Sale.belongsTo(models.Session, {foreignKey: 'session'});
    }
  }
  Sale.init({
    sale_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
     },
    game_id: DataTypes.INTEGER,
    sale_price: DataTypes.DECIMAL,
    sale_date: DataTypes.DATE,
    commission: DataTypes.DECIMAL,
    seller_id: DataTypes.INTEGER,
    buyer_id: DataTypes.INTEGER || null,
    session_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Sale',
  });
  return Sale;
};