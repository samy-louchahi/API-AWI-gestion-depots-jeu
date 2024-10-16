// models/financial_statement.js
module.exports = (sequelize, DataTypes) => {
    const FinancialStatement = sequelize.define('FinancialStatement', {
      tot_deposit_fees: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      tot_commission: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      tot_sales: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      tot_benefice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    });
  
    FinancialStatement.associate = function(models) {
      FinancialStatement.belongsTo(models.Session, { foreignKey: 'session_id' });
      FinancialStatement.belongsTo(models.Seller, { foreignKey: 'seller_id' });
    };
  
    return FinancialStatement;
  };