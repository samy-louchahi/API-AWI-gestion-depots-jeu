'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SalesOperation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SalesOperation.belongsTo(models.Game, { foreignKey: 'game_id' });
    }
  }
  SalesOperation.init({
    sales_op_id: {
      type: DataTypes.INTEGER,
      primaryKey: true},
    game_id: DataTypes.INTEGER,
    sale_date: DataTypes.DATE,
    label_generated: DataTypes.BOOLEAN,
    sale_status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SalesOperation',
  });
  return SalesOperation;
};