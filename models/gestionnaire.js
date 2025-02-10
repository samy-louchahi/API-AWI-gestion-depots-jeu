// models/gestionnaire.js

'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class Gestionnaire extends Model {
        // Méthode pour vérifier le mot de passe
        validPassword(password) {
            return bcrypt.compareSync(password, this.password);
        }
    }
    Gestionnaire.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
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
        modelName: 'Gestionnaire',
        tableName: 'gestionnaires',
        hooks: {
            beforeCreate: async (gestionnaire) => {
                if (gestionnaire.password) {
                    const salt = await bcrypt.genSalt(10);
                    gestionnaire.password = await bcrypt.hash(gestionnaire.password, salt);
                }
            },
            beforeUpdate: async (gestionnaire) => {
                if (gestionnaire.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    gestionnaire.password = await bcrypt.hash(gestionnaire.password, salt);
                }
            }
        }
    });
    return Gestionnaire;
};