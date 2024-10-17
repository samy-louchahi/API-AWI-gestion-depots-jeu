'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FinancialStatement', {
      statement_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tot_deposit_fees: {
        type: Sequelize.DECIMAL
      },
      tot_commission: {
        type: Sequelize.DECIMAL
      },
      tot_sales: {
        type: Sequelize.DECIMAL
      },
      tot_benefice: {
        type: Sequelize.DECIMAL
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
    await queryInterface.dropTable('FinancialStatements');
  }
};