'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Stock.belongsTo(models.Session, {foreignKey: 'session_id'});
      Stock.belongsTo(models.Seller, {foreignKey: 'seller_id'});
      Stock.belongsTo(models.Game, {foreignKey: 'game_id'});
    }
  }
  Stock.init({
    stock_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement : true
    },
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
      game_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    initial_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    current_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
   
  }, {
    sequelize,
    modelName: 'Stock',
  });
  return Stock;
};