'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Stock.belongsTo(models.Session, {
        foreignKey: 'session_id'
      });
      Stock.belongsTo(models.Seller, {
        foreignKey: 'seller_id'
      });
      Stock.hasOne(models.Games, {
        foreignKey: 'stock_id'
      });
    }
  }
  Stock.init({
    stock_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement},
    quant_tot: DataTypes.INTEGER,
    quant_vendues: DataTypes.INTEGER,
    quant_dispo: DataTypes.INTEGER,
    session_id: DataTypes.INTEGER,
    seller_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Stock',
  });
  return Stock;
};