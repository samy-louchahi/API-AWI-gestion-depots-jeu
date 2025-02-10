'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameTable('Gestionnaires', 'gestionnaires');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable('gestionnaires', 'Gestionnaires');
  }
};
