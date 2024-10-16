'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Games extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Games.init({
    game_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement},
    name: DataTypes.STRING,
    publisher: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    seller_id: DataTypes.INTEGER,
    stock_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Games',
  });
  return Games;
};