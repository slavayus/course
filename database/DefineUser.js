'use strict';
const Sequelize = require('sequelize');
const DataTypes = require("sequelize");

const connection = new Sequelize('mysql://root:root@localhost:3306/store');

const Users = connection.define('users', {
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

Users.sync();

module.exports = Users;