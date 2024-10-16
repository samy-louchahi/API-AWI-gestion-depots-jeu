// models/administrator.js
module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define('Administrator', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    return Admin;
  };