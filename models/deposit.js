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
        Deposit.belongsTo(models.Seller, { foreignKey: 'seller_id' });
        Deposit.belongsTo(models.Session, { foreignKey: 'session_id' });
        Deposit.hasMany(models.DepositGame, { foreignKey: 'deposit_id' });
    }
  }
  Deposit.init({
    deposit_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
     
    },
    deposit_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    discount_fees: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
      min: 0,
      max: 100
      }
    },
  }, {
    sequelize,
    modelName: 'Deposit',
    tableName: 'deposits'
  });
  return Deposit;
};