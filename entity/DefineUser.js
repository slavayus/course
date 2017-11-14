'use strict';
const Sequelize = require('sequelize');
const DataTypes = require("sequelize");

const config = require('../etc/config.json');
const connection = new Sequelize(`mysql://${config.database.login}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.name}`);


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