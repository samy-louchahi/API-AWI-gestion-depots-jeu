'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Stock', {
      stock_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quant_tot: {
        type: Sequelize.INTEGER
      },
      quant_selled: {
        type: Sequelize.INTEGER
      },
      quant_available: {
        type: Sequelize.INTEGER
      },
      session_id: {
        type: Sequelize.INTEGER
      },
      seller_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Stocks');
  }
};