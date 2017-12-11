'use strict';
const Orders = require('../entity/DefineOrders');
const Product = require('../utils/ProductUtil');
const ProductSnapshot = require('../entity/ProductSnapshotsDefine');
const Users = require('../utils/Users');

Orders.prototype.getAll = () => {
    return Orders.findAll({
        include: [{
            model: Product
        }]
        // ,
        // attributes: ['id', 'name', 'image_hot_version', 'price', 'productId', 'old_price']
    });
};

Orders.prototype.create = (product_snapshotId, userId) => {
    return Orders.create({
        productsSnapshotId: product_snapshotId,
        userId: Number(userId),
    });
};

Orders.prototype.loadOrdersById = (userId) => {
    return Orders.findAll({
        where: {
            userId: Number(userId)
        },
        include: [{
            model: ProductSnapshot
        }]
    });
};

Orders.prototype.getNotSentOrders = () => {
    return Orders.findAll({
        where: {
            sent: false
        },
        include: [{model: Users}, {model: ProductSnapshot}]
    });
};

Orders.prototype.setSent = (orderId) => {
    Orders.update(
        {sent: true},
        {where: {id: orderId}});
};

module.exports = Orders;