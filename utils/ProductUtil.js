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
    return Product.findAll();
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
        where: {
            type: type
        }
    });
};


/**
 * Считывает из базы данных все типы продуктов.
 *
 * @param req - Запрос от клиента.
 * @param res - Ответ клиенту.
 * @version 1.0
 */
Product.prototype.getProductsAllTypes = function (req, res) {
    console.log(req.header());
    console.log();
    console.log(res.header());

    Product.findAll({
        where: {
            type: req.params.type
        }
    }).then(value => {
        if (value.length !== 0) {
            res.send(value)
        } else {
            res.send('No such element')
        }
    });
};


/**
 * Получает в переменной req слово.
 * Осуществляет поиск этого слова в названии продукта.
 *
 * @param text - Запрос от клиента.
 * @version 2.0
 */
Product.prototype.searchProducts = function (text) {
    return Product.findAll({
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