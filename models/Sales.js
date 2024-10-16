// models/sale.js
module.exports = (sequelize, DataTypes) => {
    const Sale = sequelize.define('Sale', {
      sale_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      sale_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      commission: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    });
    
    Sale.associate = function(models) {
      Sale.belongsTo(models.Game, { foreignKey: 'game_id' });
    };
  
    return Sale;
  };