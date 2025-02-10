'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Buyer extends Model {
    static associate(models) {
      // Association avec Sales et Invoice
      Buyer.hasMany(models.Sale, { foreignKey: 'buyer_id' });
      Buyer.hasMany(models.Invoice, { foreignKey: 'buyer_id' });
    }
  }

  Buyer.init({
    buyer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true 
    },
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Buyer',
    tableName: 'buyers',
  });

  return Buyer;
};