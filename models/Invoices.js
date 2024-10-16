// models/invoice.js
module.exports = (sequelize, DataTypes) => {
    const Invoice = sequelize.define('Invoice', {
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      somme_tot: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    });
  
    Invoice.associate = function(models) {
      Invoice.belongsTo(models.Buyer, { foreignKey: 'buyers_id', allowNull: false });
      Invoice.belongsTo(models.Seller, { foreignKey: 'sellers_id', allowNull: false });
    };
  
    return Invoice;
  };