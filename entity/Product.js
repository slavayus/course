'use strict';
const Product = require('../database/DefineProduct');


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


Product.prototype.products = function (req, res) {
    Product.findAll()
        .then(value => {
            if (value.length === 0) {
                res.send('No such element')
            } else {
                res.send(value)
            }
        });
};


module.exports = Product;