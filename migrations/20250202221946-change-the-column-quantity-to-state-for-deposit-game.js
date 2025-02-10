'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('deposit_games', 'quantity');
    
    await queryInterface.addColumn('deposit_games', 'states', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('deposit_games', 'states');
    await queryInterface.addColumn('deposit_games', 'quantity', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
  }
};