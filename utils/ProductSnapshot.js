'use strict';
const ProductSnapshot = require('../entity/ProductSnapshotsDefine');

ProductSnapshot.prototype.loadSnapshotById = (id) => {
    return ProductSnapshot.findById(id);
};

module.exports = ProductSnapshot;