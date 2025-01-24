'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales', {
      sale_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      buyer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'buyers',
          key: 'buyer_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' // ou 'CASCADE' selon ta logique
      },
      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sessions',
          key: 'session_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      sale_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      sale_status: {
        type: Sequelize.ENUM('en cours', 'finalisé', 'annulé'),
        allowNull: false,
        defaultValue: 'en cours'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sales');
  }
};