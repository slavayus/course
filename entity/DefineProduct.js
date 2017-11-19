'use strict';
const DataTypes = require("sequelize");
const connection = require('../connections/DataBaseConnection');

/**
 * Создает представление сущности в бд.
 * Если сущность отсутствует в базе данных, то она создается там.
 *
 * @version 1.0
 */
const Product = connection.define('products', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        image_min_version: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        image_large_version: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date_post: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                priceValidate(value) {
                    if (value <= 0) {
                        throw new Error('Only positive price are allowed!')
                    }
                }
            }
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: true,
        createdAt: false,
        updatedAt: false,
        deletedAt: false,
    });

Product.sync();

module.exports = Product;