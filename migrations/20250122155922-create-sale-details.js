'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sale_details', {
      sale_detail_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sale_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sales',
          key: 'sale_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      deposit_game_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'deposit_games',
          key: 'deposit_game_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' // ou 'CASCADE' selon ta logique
      },
      seller_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sellers',
          key: 'seller_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' // ou 'CASCADE' selon ta logique
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
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
    await queryInterface.dropTable('sale_details');
  }
};