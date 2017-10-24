'use strict';
const Product = require('../database/DefineProduct');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;


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