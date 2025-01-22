'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      // Lien direct vers la vente
      Invoice.belongsTo(models.Sale, { foreignKey: 'sale_id' });
      // Optionnel : si tu veux pointer directement le Buyer,
      // sinon on peut le retrouver par sale->buyer
      Invoice.belongsTo(models.Buyer, { foreignKey: 'buyer_id' });
    }
  }

  Invoice.init({
    invoice_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    invoice_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    sale_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    buyer_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Invoice',
  });

  return Invoice;
};