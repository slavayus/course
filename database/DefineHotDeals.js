'use strict';
const Sequelize = require('sequelize');
const DataTypes = require("sequelize");

const connection = new Sequelize('mysql://root:root@localhost:3306/store');

const Product = connection.define('hot_deals', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        image_hot_version: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        until: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isAfter: String(new Date()),
            }

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

Product.sync();

module.exports = Product;