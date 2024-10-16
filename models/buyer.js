'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Buyer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Buyer.associate = function(models) {
        Buyer.hasMany(models.Sales, { foreignKey: 'buyer_id' });
      };
    }
  }
  Buyer.init({
    buyer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement},
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Buyer',
  });
  return Buyer;
};