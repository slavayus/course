'use strict';
const ProductSnapshot = require('../entity/ProductSnapshotsDefine');

ProductSnapshot.prototype.loadSnapshotById = (id) => {
    return ProductSnapshot.findById(id);
};

ProductSnapshot.prototype.confirmOrder = (productId) => {
    return ProductSnapshot.update(
        {delivered: true},
        {where: {id: productId}}
    );
};

module.exports = ProductSnapshot;