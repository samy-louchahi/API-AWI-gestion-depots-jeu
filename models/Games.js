// models/game.js
module.exports = (sequelize, DataTypes) => {
    const Game = sequelize.define('Game', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      publisher: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deposit_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    });
    return Game;
  };