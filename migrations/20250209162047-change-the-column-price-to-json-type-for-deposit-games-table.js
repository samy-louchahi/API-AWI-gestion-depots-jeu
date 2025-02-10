'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('deposit_games', 'price');
    await queryInterface.addColumn('deposit_games', 'prices', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('deposit_games', 'prices');
    await queryInterface.addColumn('deposit_games', 'price', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false
    });
  }
};
