'use strict';
const Product = require('../database/DefineProduct');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;


/**
 * Считывает из базы данных все продукты.
 *
 * @param req - Запрос от клиента.
 * @param res - Ответ клиенту.
 * @version 1.0
 */
Product.prototype.getAllProducts = function (req, res) {
    Product.findAll()
        .then(value => {
            if (value.length === 0) {
                res.send('No such element')
            } else {
                res.send(value)
            }
        });
};


/**
 * Считывает из базы данных продукт по ID.
 *
 * @param req - Запрос от клиента.
 * @param res - Ответ клиенту.
 * @version 1.0
 */
Product.prototype.getProductById = function (req, res) {
    Product.findById(Number(req.params.id))
        .then((value => {
            if (value != null) {
                res.send(value)
            } else {
                res.send('Element not found')
            }
        }));
};


/**
 * Считывает из базы данных все продукты по определенному типу.
 *
 * @param req - Запрос от клиента.
 * @param res - Ответ клиенту.
 * @version 1.0
 */
Product.prototype.getProductsByType = function (req, res) {
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
 * Считывает из базы данных все типы продуктов.
 *
 * @param req - Запрос от клиента.
 * @param res - Ответ клиенту.
 * @version 1.0
 */
Product.prototype.getProductsAllTypes = function (req, res) {
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
 * @param req - Запрос от клиента.
 * @param res - Ответ клиенту.
 * @version 1.0
 */
Product.prototype.searchProducts = function (req, res) {
    Product.findAll({
        where: {
            name: {[Op.like]: '%' + req.params.data + '%'}
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
 * Записывает новый продукт в базу данных.
 *
 * @param req - Запрос от клиента.
 * @param res - Ответ клиенту.
 * @version 1.0
 */
Product.prototype.createProduct = function (req, res) {
    Product.create({
        name: req.params.name,
        image_min_version: req.params.image_min_version,
        image_large_version: req.params.image_large_version,
        description: req.params.description,
        date_post: new Date(),
        price: Number(req.params.price),
        type: req.params.type,
    }).catch(reason => res.send(reason.message));
};


/**
 *
 * Удаляет из базы данных продукт по ID.
 *
 * @param req - Запрос от клиента.
 * @param res - Ответ клиенту.
 * @version 1.0
 */
Product.prototype.deleteProductById = function (req, res) {
    Product.findById(Number(req.params.id))
        .then(task => {
            if (task !== null) {
                if (task.destroy()) {
                    res.send('Product deleted')
                } else {
                    res.send('Row doesn\'t deleted')
                }
            } else {
                res.send('No such element')
            }
        })
};


/**
 * Удаляет продукты из бд по определенному типу.
 *
 * @param req - Запрос от клиента.
 * @param res - Ответ клиенту.
 * @version 1.0
 */
Product.prototype.deleteProductType = function (req, res) {
    Product.findAll()
        .then(task => {
            if (task !== null) {
                task.forEach(value => value.destroy());
                res.send('Type deleted')
            } else {
                res.send('No such element')
            }
        })
};


module.exports = Product;