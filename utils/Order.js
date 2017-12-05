'use strict';
const Order = require('../entity/DefineOrder');
const Product = require('../entity/DefineProduct');
const User = require('../entity/DefineUser');

Order.prototype.getAll = () => {
    return Order.findAll({
        include: [{
            model: Product
        }]
        // ,
        // attributes: ['id', 'name', 'image_hot_version', 'price', 'productId', 'old_price']
    });
};

Order.prototype.create = (data, userId) => {
    return Order.create({
        productId: data.productId,
        usersId: Number(userId),
    });
};

module.exports = Order;