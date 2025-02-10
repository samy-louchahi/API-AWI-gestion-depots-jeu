'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameTable('Admins', 'admins');

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable('admins', 'Admins');
  }
};
