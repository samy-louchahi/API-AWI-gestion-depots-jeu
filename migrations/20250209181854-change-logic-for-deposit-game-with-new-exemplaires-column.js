'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Supprimer les anciens champs s'ils existent (si vous les aviez créés précédemment)
    await queryInterface.removeColumn('deposit_games', 'states');
    await queryInterface.removeColumn('deposit_games', 'prices');

    // Ajouter le champ exemplaires
    await queryInterface.addColumn('deposit_games', 'exemplaires', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('deposit_games', 'exemplaires');
    // Vous pouvez recréer les anciens champs si nécessaire
    await queryInterface.addColumn('deposit_games', 'states', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });
    await queryInterface.addColumn('deposit_games', 'prices', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });
  }
};