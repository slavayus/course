'use strict';
const HotDeal = require('../database/DefineHotDeals');


HotDeal.prototype.getAll = function (req, res) {
    HotDeal.findAll()
        .then(value => {
            if (value.length === 0) {
                res.send('No such element')
            } else {
                res.send(value)
            }
        });
};


HotDeal.prototype.create = function (req, res) {
    HotDeal.create({
        image_hot_version: req.params.image,
        until: req.params.until,
        id_product: req.params.id,
    }).then(value => res.send('Added')).catch(reason => res.send(reason.message));

};

module.exports = HotDeal;