'use strict';
const DataTypes = require("sequelize");
const connection = require('../connections/DataBaseConnection');

/**
 * Создает представление сущности в бд.
 * Если сущность отсутствует в базе данных, то она создается там.
 *
 * @version 1.0
 */
const Order = connection.define('orders', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        usersId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: "id",
                onDelete: 'CASCADE'
            },
            onDelete: 'CASCADE',
            allowNull: false
        },
        productId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'products',
                key: "id",
                onDelete: 'CASCADE'
            },
            onDelete: 'CASCADE',
            allowNull: false
        }
    },
    {
        timestamps: true,
        createdAt: false,
        updatedAt: false,
        deletedAt: false,
    }
);

Order.sync();

module.exports = Order;
