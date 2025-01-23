'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('SaleDetails', 'seller_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Sellers',
        key: 'seller_id'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('SaleDetails', 'seller_id');
  }
};
