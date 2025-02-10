// saleDetail.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SaleDetail extends Model {
    static associate(models) {
      SaleDetail.belongsTo(models.Sale, { foreignKey: 'sale_id' });
      SaleDetail.belongsTo(models.DepositGame, { foreignKey: 'deposit_game_id' });
      SaleDetail.belongsTo(models.Seller, { foreignKey: 'seller_id' });
    }
  }

  SaleDetail.init({
    sale_detail_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sale_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    deposit_game_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },  
  }, {
    sequelize,
    modelName: 'SaleDetail',
    tableName: 'sale_details'
  });

  return SaleDetail;
};