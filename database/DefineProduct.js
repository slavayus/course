'use strict';
const Sequelize = require('sequelize');
const DataTypes = require("sequelize");

const connection = new Sequelize('mysql://root:root@localhost:3306/store');

const Product = connection.define('products', {
    title: {
        type: DataTypes.STRING,
        get() {
            return this.getDataValue('title');
        }
    },
    body: DataTypes.INTEGER
});

module.exports = Product;