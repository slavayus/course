'use strict';
const Product = require('../entity/DefineProduct');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;


/**
 * Считывает из базы данных все продукты.
 *
 * @version 2.0
 */
Product.prototype.getAllProducts = () => {
    return Product.findAll({
        attributes: ['id', 'name', 'image_min_version', 'price']
    });
};


/**
 * Считывает из базы данных продукт по ID.
 *
 * @param id - ID продукта.
 * @version 2.0
 */
Product.prototype.getProductById = (id) => {
    return Product.findById(Number(id));
};


/**
 * Считывает из базы данных все продукты по определенному типу.
 *
 * @param type - Тип продукта.
 * @version 2.0
 */
Product.prototype.getProductsByType = (type) => {
    return Product.findAll({
        attributes: ['id', 'name', 'image_min_version', 'price'],
        where: {
            type: type
        }
    });
};


/**
 * Считывает из базы данных все типы продуктов.
 *
 * @version 2.0
 */
Product.prototype.getProductsAllTypes = () => {
    return Product.findAll({
        attributes: ['type'],
        group: ['type']
    })
};


/**
 * Получает в переменной text слово.
 * Осуществляет поиск этого слова в названии продукта.
 *
 * @param text - Запрос от клиента.
 * @version 2.0
 */
Product.prototype.searchProducts = (text) => {
    return Product.findAll({
        attributes: ['id', 'name', 'image_min_version', 'price'],
        where: {
            name: {[Op.like]: '%' + text + '%'}
        }
    });
};


/**
 * Записывает новый продукт в базу данных.
 *
 * @param data - Данные о новом продукте.
 * @version 2.0
 */
Product.prototype.createProduct = (data) => {
    return Product.create({
        name: data.name,
        image_min_version: data.image_min_version,
        image_large_version: data.image_large_version,
        description: data.description,
        date_post: new Date(),
        price: Number(data.price),
        type: data.type,
    });
};


/**
 *
 * Удаляет из базы данных продукт по ID.
 *
 * @param id - ID продукта.
 * @version 2.0
 */
Product.prototype.deleteProductById = (id) => {
    return Product.destroy({
        where: {
            id: Number(id)
        }
    });
};


/**
 * Удаляет продукты из бд по определенному типу.
 *
 * @param type - Тип удаляемого продукта.
 * @version 2.0
 */
Product.prototype.deleteProductType = (type) => {
    return Product.destroy({
        where: {
            type: type
        }
    });
};


module.exports = Product;