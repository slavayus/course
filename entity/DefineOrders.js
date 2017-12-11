'use strict';
const DataTypes = require("sequelize");
const connection = require('../connections/DataBaseConnection');

/**
 * Создает представление сущности в бд.
 * Если сущность отсутствует в базе данных, то она создается там.
 *
 * @version 1.0
 */
const Orders = connection.define('orders', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: "id",
                onDelete: 'CASCADE'
            },
            onDelete: 'CASCADE',
            allowNull: false
        },
        sent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        productsSnapshotId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'products_snapshots',
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

Orders.sync();

module.exports = Orders;
