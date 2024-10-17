'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Deposit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Deposit.belongsTo(models.Sellers, { foreignKey: 'seller_id' });
        Deposit.belongsTo(models.Session, { foreignKey: 'session_id' });
    }
  }
  Deposit.init({
    deposit_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement},
    deposit_date: DataTypes.DATE,
    seller_id: DataTypes.INTEGER,
    session_id: DataTypes.INTEGER,
    total_deposit_fee: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Deposit',
  });
  return Deposit;
};