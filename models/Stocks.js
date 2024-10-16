// models/stock.js
module.exports = (sequelize, DataTypes) => {
    const Stock = sequelize.define('Stock', {
      quant_tot: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quant_vendues: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quant_dispo: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    Stock.associate = function(models) {
      Stock.belongsTo(models.Session, { foreignKey: 'session_id' });
      Stock.belongsTo(models.Seller, { foreignKey: 'seller_id' });
    };
  
    return Stock;
  };