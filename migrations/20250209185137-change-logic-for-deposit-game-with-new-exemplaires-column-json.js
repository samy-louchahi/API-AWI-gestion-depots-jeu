'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   queryInterface.changeColumn('deposit_games', 'exemplaires', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: {}
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.changeColumn('deposit_games', 'exemplaires', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });
  }
};
