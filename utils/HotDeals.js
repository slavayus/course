'use strict';
const HotDeal = require('../entity/DefineHotDeals');


/**
 * Считывает из базы данных все данные.
 *
 * @version 2.0
 */
HotDeal.prototype.getAll = () => {
    return HotDeal.findAll();
};


/**
 * Записывает новый продукт в базу данных.
 *
 * @param data - данные о продукте для записи в бд(image, until, id).
 * @version 1.0
 */
HotDeal.prototype.create = (data) => {
    return HotDeal.create({
        image_hot_version: data.image,
        until: data.until,
        id_product: data.id,
    });
};

module.exports = HotDeal;