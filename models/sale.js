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
      // define association here
    }
  }
  Sale.init({
    sale_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement},
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