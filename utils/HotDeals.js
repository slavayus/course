'use strict';
const HotDeal = require('../entity/DefineHotDeals');
const Product = require('../entity/DefineProduct');


/**
 * Считывает из базы данных все данные о "горящих" продуктах.
 *
 * @version 2.0
 */
HotDeal.prototype.getAll = () => {
    return HotDeal.findAll({
        include: [{
            model: Product
        }]
        // ,
        // attributes: ['id', 'name', 'image_hot_version', 'price', 'productId', 'old_price']
    });
};


/**
 * Записывает новый продукт в базу данных.
 *
 * @param id
 * @param oldPrice
 * @param image
 * @version 1.0
 */
HotDeal.prototype.create = (id, oldPrice, image) => {
    return HotDeal.create({
        image_hot_version: image,
        productId: id,
        old_price: oldPrice,
    });
};

HotDeal.prototype.getOldPrice = (id) => {
    return HotDeal.findOne(
        {where: {productId: id}},
        {attributes: ['id', 'old_price']});
};


HotDeal.prototype.removeHotById = (id) => {
    return HotDeal.destroy({
        where: {
            id: Number(id)
        }
    });
};

module.exports = HotDeal;