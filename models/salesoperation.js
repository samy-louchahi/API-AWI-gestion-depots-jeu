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
      SalesOperation.belongsTo(models.Sale, { foreignKey: 'sale_id' });
    }
  }
  SalesOperation.init({
    sales_op_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sale_id:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    commission: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
      min: 0,
      max: 100
      }
    },
    sale_date:{
      type:  DataTypes.DATE,
      allowNull: false
    },
    sale_status: {type: DataTypes.ENUM('en cours', 'finalisé', 'annulé'),
      allowNull: false},
  }, {
    sequelize,
    modelName: 'SalesOperation',
  });
  return SalesOperation;
};