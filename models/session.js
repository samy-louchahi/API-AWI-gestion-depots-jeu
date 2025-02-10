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
      Session.hasMany(models.Sale, {foreignKey: 'session_id'});

    }
  }
  Session.init({
    session_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true},
    name: { type: DataTypes.STRING,
      allowNull: false},
    start_date: {type: DataTypes.DATE,
      allowNull: false},
    end_date: {type: DataTypes.DATE,
      allowNull: false},
    status: {type: DataTypes.BOOLEAN,
      allowNull: false},
    fees: {type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    commission: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
      min: 0,
      max: 100
      }
    },
  }, {
    sequelize,
    modelName: 'Session',
    tableName: 'sessions'
  });
  return Session;
};