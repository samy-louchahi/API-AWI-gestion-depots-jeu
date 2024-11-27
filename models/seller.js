'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Seller extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Seller.hasMany(models.Game, { foreignKey: 'seller_id' });
        Seller.hasMany(models.FinancialStatement, { foreignKey: 'seller_id' });
        Seller.hasMany(models.Deposits, { foreignKey: 'seller_id' });
        Seller.hasMany(models.Sales, { foreignKey: 'seller_id' });
    }
  }
  Seller.init({
    seller_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement},
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Seller',
  });
  return Sellers;
};