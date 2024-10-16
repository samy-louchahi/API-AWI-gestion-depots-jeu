// models/session.js
module.exports = (sequelize, DataTypes) => {
    const Session = sequelize.define('Session', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    });
    return Session;
  };