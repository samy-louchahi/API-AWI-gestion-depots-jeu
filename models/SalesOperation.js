// models/sales_operation.js
module.exports = (sequelize, DataTypes) => {
    const SalesOperation = sequelize.define('SalesOperation', {
      sale_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      label_generated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    });
    
    SalesOperation.associate = function(models) {
      SalesOperation.belongsTo(models.Game, { foreignKey: 'game_id' });
    };
  
    return SalesOperation;
  };