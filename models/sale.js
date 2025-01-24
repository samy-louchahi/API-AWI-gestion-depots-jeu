// sale.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    static associate(models) {
      Sale.hasMany(models.SaleDetail, { foreignKey: 'sale_id' });
      
      Sale.hasOne(models.SalesOperation, { foreignKey: 'sale_id' });
      
      Sale.belongsTo(models.Buyer, { foreignKey: 'buyer_id' });
      
      Sale.belongsTo(models.Session, { foreignKey: 'session_id' });
    }
  }
  
  Sale.init({
    sale_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    buyer_id: {
      type: DataTypes.INTEGER,
      allowNull: true 
    },
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false 
    },
    sale_status: {
      type: DataTypes.ENUM('en cours', 'finalisé', 'annulé'),
      allowNull: false,
      defaultValue: 'en cours'
    },
    sale_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Sale',
    tableName: 'sales'
  });
  
  return Sale;
};