const express = require('express');
const router = new express.Router();


const Busboy = require('busboy');
const fs = require('fs');

const ProductSnapshots = require('../entity/ProductSnapshotsDefine');
const Product = require('../utils/ProductUtil');
const HotDeal = require('../utils/HotDeals');
const Users = require('../utils/Users');
const Orders = require('../utils/Orders');

HotDeal.belongsTo(Product);
Orders.belongsTo(ProductSnapshots);
Orders.belongsTo(Users);

const product = new Product;
const user = new Users;
const hotDeal = new HotDeal;
const order = new Orders;
const adminQueue = new (require('../queues/AdminQueue'));


const RESPONSE_TO_CLIENT = 'Ваш запрос обрабатывается';


/**
 * Записывает в бд продукт, полученный от пользователя.
 *
 * В response запроса уведомляет клиента, что задача получена.
 *
 * В очередь admin_orderId отправляет JSON-object с результатми работы.
 * Если не удалось записать в бд продукт, то в очередь отправляется JSON-object со статусом 'error'
 * и сама ошибка.
 * Если удалось записать данные, то в очедерь отправляется JSON-object со статусом 'success'
 * и сам продукт.
 */
router.get('/orders', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    order.getNotSentOrders().then(value => {
        if (value.length === 0) {
            adminQueue.doResponseAdmin(req.query.queueId, {
                status: 'empty',
                data: 'No such element'
            });
        } else {
            adminQueue.doResponseAdmin(req.query.queueId, {
                status: 'success',
                data: value
            });
        }
    }).catch(error => {
        adminQueue.doResponseAdmin(req.query.queueId, {
            status: 'error',
            data: error
        });
    });
});


router.get('/orders/sent', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    order.setSent(req.query.orderId);
});


/**
 * Удаляет продукт из бд.
 *
 * В response запроса уведомляет клиента, что задача получена.
 *
 * В очередь admin_orderId отправляет JSON-object с результатми работы.
 * Если удалось удалить продукт из бд, то в очедерь отправляется JSON-object со статусом 'success'
 * и количество удаленных продуктов.
 * Если произошла ошибка при удалении продукта из бд, то в очередь отправляется JSON-object со статусом 'error'
 * и сама ошибка.
 */
router.delete('/product/delete', (req, res) => {
    product.deleteProductById(req.query.productId).then(value => {
        const message = value === 0 ? 'Продукт не удалось удалить.' : 'Продукт удален.';
        res.send(message);
    }).catch(error => {
        res.send(`Ошибочка вышала: ${error.name}`);
    })
});

/**
 * Удаляет продукты из бд по определенному типу.
 *
 * В response запроса уведомляет клиента, что задача получена.
 *
 * В очередь admin_orderId отправляет JSON-object с результатми работы.
 * Если удалось удалить продукты из бд, то в очедерь отправляется JSON-object со статусом 'success'
 * и количество удаленных продуктов.
 * Если произошла ошибка при удалении продуктов из бд, то в очередь отправляется JSON-object со статусом 'error'
 * и сама ошибка.
 */
router.post('/product/update/price', (req, res) => {
    product.updatePriceById(req.body.newPrice, req.body.productId).then(value => {
        const message = value[0] === 0 ? 'Не удалось обновить цену.' : 'Цена продукта обновлена.';
        res.send(message);
    }).catch(error => {
        res.send(`Ошибочка вышала: ${error.name}`);
    })
});

router.post('/product/update/name', (req, res) => {
    product.updateNameById(req.body.newName, req.body.productId).then(value => {
        const message = value[0] === 0 ? 'Не удалось изменить название.' : 'Название продукта изменено.';
        res.send(message);
    }).catch(error => {
        res.send(`Ошибочка вышала: ${error.name}`);
    })
});

router.post('/product/update/description', (req, res) => {
    product.updateDescriptionById(req.body.newDescription, req.body.productId).then(value => {
        const message = value[0] === 0 ? 'Не удалось изменить описание.' : 'Описание продукта изменено.';
        res.send(message);
    }).catch(error => {
        res.send(`Ошибочка вышала: ${error.name}`);
    })
});


/**
 * Удаляет пользователя из бд по ID.
 *
 * В response запроса уведомляет клиента, что задача получена.
 *
 * В очередь admin_orderId отправляет JSON-object с результатми работы.
 * Если удалось удалить пользователя из бд, то в очедерь отправляется JSON-object со статусом 'success'
 * и количество удаленных пользователей.
 * Если произошла ошибка при удалении продуктов из бд, то в очередь отправляется JSON-object со статусом 'error'
 * и сама ошибка.
 */
/*
router.delete('/user/:id/:orderId', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    user.delete(req.params.id).then(value => {
        adminQueue.doResponseAdmin(req.params.orderId, {
            status: 'success',
            data: value
        });
    }).catch(error => {
        adminQueue.doResponseAdmin(req.params.orderId, {
            status: 'error',
            data: error
        });
    })
});
*/

let fileName = '';

/**
 * Запиывает и бд "горящие" продукты.
 *
 * В response запроса уведомляет клиента, что задача получена.
 *
 * В очередь products_orderId отправляет JSON-object с результатми работы.
 * Если не удалось записать в бд ни одного продукта, то в очередь отправляется JSON-object со статусом 'empty'
 * и с данными 'No such element'.
 * Если удалось записать данные в бд, то в очедерь отправляется JSON-object со статусом 'success'
 * и коливество добавленных продуктов.
 * Если произошла ошибка при записи продкутов в бд, то в очередь отправляется JSON-object со статусом 'error'
 * и сама ошибка.
 */
router.post('/product/addHot', (req, res) => {
    if (fileName === '') {
        return res.send('Выберите файл.');
    }
    product.getProductById(req.body.productId).then(value => {
        const price = value.price;
        product.updatePriceById(req.body.hotPrice, req.body.productId).then(() => {
            hotDeal.create(req.body.productId, price, fileName).then(value3 => {
                const message = value3 === 0 ? 'Продукт не удалось добавить.' : 'Продукт добавлен.';
                fileName = '';
                res.send(message);
            }).catch(error => {
                res.send(`Ошибочка вышла: ${error.name}`);
            })
        }).catch(error => {
            res.send(`Ошибочка вышла: ${error.name}`);
        })
    }).catch(error => {
        res.send(`Ошибочка вышла: ${error.name}`);
    });
});


router.delete('/product/deleteHot', (req, res) => {
    hotDeal.getOldPrice(req.query.productId).then(value => {
        product.updatePriceById(value.dataValues.old_price, req.query.productId).then(() => {
            hotDeal.removeHotById(value.dataValues.id).then(value3 => {
                const message = value3 === 0 ? 'Акцию не удалось удалить.' : 'Акция удалена.';
                res.send(message);
            }).catch(error => {
                res.send(`Ошибочка вышала: ${error.name}`);
            })
        }).catch(error => {
            res.send(`Ошибочка вышала: ${error.name}`);
        });
    }).catch(error => {
        res.send(`Ошибочка вышала: ${error.name}`);
    })
});

router.post('/upload', (req, res) => {
    const busboy = new Busboy({headers: req.headers});
    busboy.on('file', function (fieldname, file, filename) {
        let saveTo = '/home/slavik/Dropbox/itmo/2course/pip/курсач/second/front/src/hot/img/' + filename;
        file.pipe(fs.createWriteStream(saveTo));
        fileName = filename;
    });
    busboy.on('finish', function () {
        res.end('done');
    });
    res.on('close', function () {
        req.unpipe(busboy);
    });
    req.pipe(busboy);
});

let imageMin = '';
let imageMax = '';

router.post('/product/new', (req, res) => {
    console.log("YEE");
    if (imageMin === '' || imageMax === '') {
        return res.send('Выберите файлы.');
    }

    product.createProduct(req.body, imageMin, imageMax).then(value => {
        const message = value === 0 ? 'Продукт не удалось добавить.' : 'Продукт добавлен.';
        imageMin = '';
        imageMax = '';
        res.send(message);
    }).catch(error => {
        res.send(`Ошибочка вышла: ${error.name}`);
    });
});

router.post('/product/image/min', (req, res) => {
    console.log("YEE@");
    const busboy = new Busboy({headers: req.headers});
    busboy.on('file', function (fieldname, file, filename) {
        let saveTo = '/home/slavik/Dropbox/itmo/2course/pip/курсач/second/front/src/product/img/' + filename;
        file.pipe(fs.createWriteStream(saveTo));
        imageMin = filename;
    });
    busboy.on('finish', function () {
        res.end('done');
    });
    res.on('close', function () {
        req.unpipe(busboy);
    });
    req.pipe(busboy);
});

router.post('/product/image/max', (req, res) => {
    const busboy = new Busboy({headers: req.headers});
    busboy.on('file', function (fieldname, file, filename) {
        let saveTo = '/home/slavik/Dropbox/itmo/2course/pip/курсач/second/front/src/one/img/' + filename;
        file.pipe(fs.createWriteStream(saveTo));
        imageMax = filename;
    });
    busboy.on('finish', function () {
        res.end('done');
    });
    res.on('close', function () {
        req.unpipe(busboy);
    });
    req.pipe(busboy);
});

router.get('/isAdmin', (req, res) => {
    const userId = req.session.user;
    if (userId !== undefined) {
        user.isThisAdmin(userId).then(value => {
            if (value.dataValues.isAdmin) {
                res.send("Yes");
            } else {
                res.send("Permission denied");
            }
        });
    } else {
        res.send("Permission denied");
    }
});

module.exports = router;