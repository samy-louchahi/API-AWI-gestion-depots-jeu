// models/admin.js

'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class Admin extends Model {
        // Méthode pour vérifier le mot de passe
        validPassword(password) {
            return bcrypt.compareSync(password, this.password);
        }
    }
    Admin.init({
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        sequelize,
        modelName: 'Admin',
        tableName: 'admins',
        hooks: {
            beforeCreate: async (admin) => {
                if (admin.password) {
                    console.log('Hashing password for admin:', admin.email);
                    const salt = await bcrypt.genSalt(10);
                    admin.password = await bcrypt.hash(admin.password, salt);
                    console.log('Password hashed:', admin.password);
                }
            },
            beforeUpdate: async (admin) => {
                if (admin.changed('password')) {
                    console.log('Hashing updated password for admin:', admin.email);
                    const salt = await bcrypt.genSalt(10);
                    admin.password = await bcrypt.hash(admin.password, salt);
                    console.log('Updated password hashed:', admin.password);
                }
            }
        }
    });
    return Admin;
};