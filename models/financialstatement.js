'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FinancialStatement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        FinancialStatement.belongsTo(models.Seller, { foreignKey: 'seller_id' });
        FinancialStatement.belongsTo(models.Session, { foreignKey: 'session_id' });
    }
  }
  FinancialStatement.init({
    statement_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      },
    tot_deposit_fees: DataTypes.DECIMAL,
    tot_commission: DataTypes.DECIMAL,
    tot_sales: DataTypes.DECIMAL,
    tot_benefice: DataTypes.DECIMAL,
    session_id: DataTypes.INTEGER,
    seller_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FinancialStatement',
  });
  return FinancialStatement;
};