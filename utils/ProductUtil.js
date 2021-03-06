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


Product.prototype.updatePriceById = (newPrice, productId) => {
    return Product.update(
        {price: Number(newPrice)},
        {where: {id: Number(productId)}});
};

Product.prototype.updateNameById = (newName, productId) => {
    return Product.update(
        {name: newName},
        {where: {id: Number(productId)}});
};

Product.prototype.updateDescriptionById = (newDescription, productId) => {
    return Product.update(
        {description: newDescription},
        {where: {id: Number(productId)}});
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
 * Удаляет продукты из бд по определенному типу.
 *
 * @version 2.0
 * @param productType
 */
Product.prototype.deleteProductByType = (productType) => {
    return Product.destroy({
        where: {
            type: productType
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
 * @param imageMin
 * @param imageMax
 * @version 2.0
 */
Product.prototype.createProduct = (data, imageMin, imageMax) => {
    return Product.create({
        name: data.name,
        image_min_version: imageMin,
        image_large_version: imageMax,
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

Product.prototype.loadProductsFromArray = (idArray) => {
    return Product.findAll({
        where: {
            id: idArray
        }
    });
};


module.exports = Product;