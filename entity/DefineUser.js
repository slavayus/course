'use strict';
const DataTypes = require("sequelize");
const connection = require('../connections/DataBaseConnection');


/**
 * Создает представление сущности в бд.
 * Если сущность отсутствует в базе данных, то она создается там.
 *
 * @version 1.0
 */
const User = connection.define('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        surname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull:
                false
        }
    },
    {
        timestamps: true,
        createdAt:
            false,
        updatedAt:
            false,
        deletedAt:
            false,
    }
    )
;

User.sync();

module.exports = User;