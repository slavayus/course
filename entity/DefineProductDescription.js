'use strict';
const DataTypes = require("sequelize");
const connection = require('../connections/DataBaseConnection');
const Product = require('./DefineProduct');
/**
 * Создает представление сущности в бд.
 * Если сущность отсутствует в базе данных, то она создается там.
 *
 * @version 1.0
 */
const ProductDescription = connection.define('products_description', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Product,
                key: "id",
                onDelete: 'CASCADE'
            },
        }
    },
    {
        timestamps: true,
        createdAt: false,
        updatedAt: false,
        deletedAt: false,
    });


ProductDescription.sync();

module.exports = ProductDescription;