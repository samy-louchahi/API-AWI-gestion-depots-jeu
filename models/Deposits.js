// models/deposit.js
module.exports = (sequelize, DataTypes) => {
    const Deposit = sequelize.define('Deposit', {
      total_deposit_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    });
  
    Deposit.associate = function(models) {
      Deposit.belongsTo(models.Seller, { foreignKey: 'seller_id' });
      Deposit.hasMany(models.Game);
    };
  
    return Deposit;
  };