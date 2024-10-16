// models/seller.js
module.exports = (sequelize, DataTypes) => {
    const Seller = sequelize.define('Seller', {
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
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    return Seller;
  };