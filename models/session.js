'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Session.hasMany(models.Stock, {foreignKey: 'session_id'});
      Session.hasMany(models.Deposit, {foreignKey: 'session_id'});
      Session.hasMany(models.FinancialStatement, {foreignKey: 'session_id'});
      Session.hasMany(models.Sales, {foreignKey: 'session_id'});

    }
  }
  Session.init({
    session_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement},
    name: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Session',
  });
  return Session;
};