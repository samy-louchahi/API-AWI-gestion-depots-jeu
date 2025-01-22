'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Supprimer les colonnes stock_id, deposit_id, seller_id, price si elles existent
    await queryInterface.removeColumn('Games', 'stock_id');
    await queryInterface.removeColumn('Games', 'deposit_id');
    await queryInterface.removeColumn('Games', 'seller_id');
    await queryInterface.removeColumn('Games', 'price');
  },

  async down(queryInterface, Sequelize) {
    // Recréer les colonnes si nécessaire
    await queryInterface.addColumn('Games', 'stock_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Stocks',
        key: 'stock_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addColumn('Games', 'deposit_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Deposits',
        key: 'deposit_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addColumn('Games', 'seller_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Sellers',
        key: 'seller_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addColumn('Games', 'price', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    });
  }
};