'use strict';
const DataTypes = require("sequelize");
const connection = require('../connections/DataBaseConnection');

/**
 * Создает представление сущности в бд.
 * Если сущность отсутствует в базе данных, то она создается там.
 *
 * @version 1.0
 */
const HotDeal = connection.define('hot_deals', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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

        },
        id_product: {
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
    });

HotDeal.sync();

module.exports = HotDeal;