#!/usr/bin/env node
const Busboy = require('busboy');
const fs = require('fs');

const ProductSnapshots = require('./entity/ProductSnapshotsDefine');
const Product = require('./utils/ProductUtil');
const HotDeal = require('./utils/HotDeals');
const Users = require('./utils/Users');
const Orders = require('./utils/Orders');
const ProductSnapshot = require('./utils/ProductSnapshot');

HotDeal.belongsTo(Product);
Orders.belongsTo(ProductSnapshots);
Orders.belongsTo(Users);

const product = new Product;
const user = new Users;
const hotDeal = new HotDeal;
const order = new Orders;
const productSnapshot = new ProductSnapshot;

const productQueues = new (require('./queues/ProductsQueues'));
const orderQueue = new (require('./queues/OrderQueue'));
const elementQueues = new (require('./queues/ElementQueues'));
const adminQueue = new (require('./queues/AdminQueue'));
const basketQueue = new (require('./queues/BasketQueue'));
const registerQueue = new (require('./queues/RegisterQueue'));
const typeQueue = new (require('./queues/TypeQueue'));
const snapshot = new (require('./queues/Snapshot'));

const app = require('./connections/ExpressConnection');

const RESPONSE_TO_CLIENT = 'Ваш запрос обрабатывается';

app.get('/yee', (req, res) => {
    // console.log(req.session.numberOfVisit);
    // console.log(req.sessionID);
    req.session.numberOfVisit = req.session.numberOfVisit + 1 || 1;
    console.log(req.session.numberOfVisit);
    if (req.session.numberOfVisit > 7) {
        req.session.destroy();
        res.end();
    } else {
        res.send(req.session.numberOfVisit.toString());
    }
});


/**
 * Отправляет в очередь все продукты.
 *
 * В response запроса уведомляет клиента, что задача получена.
 *
 * В очередь products_orderId отправляет JSON-object с результатми работы.
 * Если не удалось прочитать из бд ни одной строки, то в очередь отправляется JSON-object со статусом 'empty'
 * и с данными 'No such element'.
 * Если удалось прочитать данные, то в очедерь отправляется JSON-object со статусом 'success'
 * и данными из бд.
 * Если произошла ошибка при получении данных из бд, то в очередь отправляется JSON-object со статусом 'error'
 * и саму ошибку.
 */
app.get('/products/all', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    product.getAllProducts().then(value => {
        if (value.length === 0) {
            productQueues.doResponseProducts(req.query.queueId, {
                status: 'empty',
                data: 'No such element'
            });
        } else {
            productQueues.doResponseProducts(req.query.queueId, {
                status: 'success',
                data: value
            });
        }
    }).catch(error => {
        productQueues.doResponseProducts(req.query.queueId, {
            status: 'error',
            data: error
        });
    });
});


/**
 * Отправляет в очередь определенный продукт.
 *
 * В response запроса уведомляет клиента, что задача получена.
 *
 * В очередь element_orderId отправляет JSON-object с результатми работы.
 * Если не удалось найти в бд этого продукта, то в очередь отправляется JSON-object со статусом 'empty'
 * и с данными 'No such element'.
 * Если удалось прочитать данные, то в очедерь отправляется JSON-object со статусом 'success'
 * и сам продукт.
 * Если произошла ошибка при получении продукта из бд, то в очередь отправляется JSON-object со статусом 'error'
 * и саму ошибку.
 */
app.get('/product/:id', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    product.getProductById(req.params.id).then(value => {
        if (value === null) {
            elementQueues.doResponseElement(req.query.queueId, {
                status: 'empty',
                data: 'No such element'
            });
        } else {
            elementQueues.doResponseElement(req.query.queueId, {
                status: 'success',
                data: value
            });
        }
    }).catch(error => {
        elementQueues.doResponseElement(req.query.queueId, {
            status: 'error',
            data: error.name
        });
    });
});


/**
 * Отправляет в очередь продукты определенного типа.
 *
 * В response запроса уведомляет клиента, что задача получена.
 *
 * В очередь products_orderId отправляет JSON-object с результатми работы.
 * Если не удалось найти в бд ни одного продукта с таким типом, то в очередь отправляется JSON-object со статусом 'empty'
 * и с данными 'No such element'.
 * Если удалось прочитать данные, то в очедерь отправляется JSON-object со статусом 'success'
 * и сами продукты.
 * Если произошла ошибка при получении продуктов из бд, то в очередь отправляется JSON-object со статусом 'error'
 * и саму ошибку.
 */
app.get('/products', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    product.getProductsByType(req.query.type).then(value => {
        if (value.length === 0) {
            productQueues.doResponseProducts(req.query.queueId, {
                status: 'empty',
                data: 'No such element'
            });
        } else {
            productQueues.doResponseProducts(req.query.queueId, {
                status: 'success',
                data: value
            });
        }
    }).catch(error => {
        productQueues.doResponseProducts(req.query.queueId, {
            status: 'error',
            data: error
        });
    });
});


/**
 * Отправляет в очередь все типы продуктов, которые имеются в бд.
 *
 * В response запроса уведомляет клиента, что задача получена.
 *
 * В очередь product_types отправляет JSON-object с результатми работы.
 * Если не удалось найти в бд такого атрибута, то в очередь отправляется JSON-object со статусом 'empty'
 * и с данными 'No such element'.
 * Если удалось прочитать данные, то в очедерь отправляется JSON-object со статусом 'success'
 * и сами продукты.
 * Если произошла ошибка при получении атрибута из бд, то в очередь отправляется JSON-object со статусом 'error'
 * и саму ошибку.
 */
app.get('/products/alltypes', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    product.getProductsAllTypes().then(value => {
        if (value.length === 0) {
            typeQueue.doResponseType(req.query.queueId, {
                status: 'empty',
                data: 'No such element'
            });
        } else {
            typeQueue.doResponseType(req.query.queueId, {
                status: 'success',
                data: value
            });
        }
    }).catch(error => {
        typeQueue.doResponseType(req.query.queueId, {
            status: 'error',
            data: error
        });
    });
});


/**
 * Отправляет в очередь продукты, в названии которых имеется строка, полученная от пользователя.
 *
 * В response запроса уведомляет клиента, что задача получена.
 *
 * В очередь product_types отправляет JSON-object с результатми работы.
 * Если не удалось найти в бд ни одного продукта, то в очередь отправляется JSON-object со статусом 'empty'
 * и с данными 'No such element'.
 * Если удалось прочитать данные, то в очедерь отправляется JSON-object со статусом 'success'
 * и сами продукты.
 * Если произошла ошибка при получении продуктов из бд, то в очередь отправляется JSON-object со статусом 'error'
 * и сама ошибка.
 */
app.get('/search', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    product.searchProducts(req.query.text).then(value => {
        if (value.length === 0) {
            productQueues.doResponseProducts(req.query.queueId, {
                status: 'empty',
                data: 'No such element'
            });
        } else {
            productQueues.doResponseProducts(req.query.queueId, {
                status: 'success',
                data: value
            });
        }
    }).catch(error => {
        productQueues.doResponseProducts(req.query.queueId, {
            status: 'error',
            data: error
        });
    });
});


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
app.get('/admin/orders', (req, res) => {
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


app.get('/admin/orders/sent', (req, res) => {
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
app.delete('/admin/product/delete', (req, res) => {
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
app.delete('/admin/product/type/:type/:orderId', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    product.deleteProductType(req.params.type).then(value => {
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
app.delete('/admin/user/:id/:orderId', (req, res) => {
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


/**
 * Отправляет в очередь "горящие" продукты.
 *
 * В response запроса уведомляет клиента, что задача получена.
 *
 * В очередь products_orderId отправляет JSON-object с результатми работы.
 * Если не удалось получить из бд ни одного продукта, то в очередь отправляется JSON-object со статусом 'empty'
 * и с данными 'No such element'.
 * Если удалось получить данные из бд, то в очедерь отправляется JSON-object со статусом 'success'
 * и сами продукты.
 * Если произошла ошибка при получении продкутов из бд, то в очередь отправляется JSON-object со статусом 'error'
 * и сама ошибка.
 */
app.get('/', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    hotDeal.getAll().then(value => {
        if (value.length === 0) {
            productQueues.doResponseProducts(req.query.queueId, {
                status: 'empty',
                data: 'No such element'
            });
        } else {
            productQueues.doResponseProducts(req.query.queueId, {
                status: 'success',
                data: value
            });
        }
    }).catch(error => {
        console.log(error);
        productQueues.doResponseProducts(req.query.queueId, {
            status: 'error',
            data: error.name
        });
    });
});

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
app.post('/admin/product/addHot', (req, res) => {
    console.log(req.body);
    product.getProductById(req.body.productId).then(value => {
        const price = value.price;
        console.log(price);
        product.updatePriceById(req.body.hotPrice, req.body.productId).then(value2 => {
            hotDeal.create(req.body.productId, price, fileName).then(value3 => {
                console.log(price);
                const message = value3 === 0 ? 'Продукт не удалось удалить.' : 'Продукт удален.';
                res.send(message);
            }).catch(error => {
                res.send(`Ошибочка вышала: ${error.name}`);
            })
        }).catch(error => {
            res.send(`Ошибочка вышала: ${error.name}`);
        })
    }).catch(error => {
        res.send(`Ошибочка вышала: ${error.name}`);
    });
});


app.post('/admin/upload', (req, res) => {
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


app.get('/user/orders', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    let userId = req.session.user;

    order.loadOrdersById(userId).then(value => {
        if (value.length === 0) {
            orderQueue.doResponseOrders(req.query.queueId, {
                status: 'empty',
                data: 'No such element'
            });
        } else {
            orderQueue.doResponseOrders(req.query.queueId, {
                status: 'success',
                data: value
            });
        }
    }).catch(error => {
        orderQueue.doResponseOrders(req.query.queueId, {
            status: 'error',
            data: error.name
        });
    });
});


app.post('/user/basket', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    let userBasket = req.body.basket;
    req.session.basket = userBasket;

    product.loadProdcutsFromArray(userBasket).then(value => {
        if (value.length === 0) {
            basketQueue.doResponseElement(req.query.queueId, {
                status: 'empty',
                data: 'No such element'
            });
        } else {
            basketQueue.doResponseElement(req.query.queueId, {
                status: 'success',
                data: value
            });
        }
    }).catch(error => {
        basketQueue.doResponseElement(req.query.queueId, {
            status: 'error',
            data: error.name
        });
    });
});


app.get('/snapshot/:id', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    productSnapshot.loadSnapshotById(req.params.id).then(value => {
        if (value === null) {
            snapshot.doResponseElement(req.query.queueId, {
                status: 'empty',
                data: 'No such element'
            });
        } else {
            snapshot.doResponseElement(req.query.queueId, {
                status: 'success',
                data: value
            });
        }
    }).catch(error => {
        snapshot.doResponseElement(req.query.queueId, {
            status: 'error',
            data: error.name
        });
    });
});

app.post('/order', (req, res) => {
    let userId = req.session.user;

    product.getProductById(req.body.productId).then(value => {
        ProductSnapshots.create({
            productId: value.id,
            name: value.name,
            image_min_version: value.image_min_version,
            image_large_version: value.image_large_version,
            description: value.description,
            date_post: value.date_post,
            price: value.price,
            type: value.type
        }).then(value => {
            order.create(value.dataValues.id, userId).then(() => {
                res.send('Ваш заказ принят.\nНаш администратор свяжется с вами в ближайщее время.')
            }).catch(error => {
                res.send(`Не удалось оформить заказ.\nКод ошибки: \n${error.name}`);
            })
        }).catch(error => {
            res.send(`Не удалось оформить заказ.\nКод ошибки: \n${error.name}`);
        })
    }).catch(error => {
        res.send(`Не удалось оформить заказ.\nКод ошибки: \n${error.name}`);
    })
});

app.post('/login/facebook', (req, res) => {
    user.checkUser(`facebook.com/${req.body.facebookId}`).then(value => {
        if (value === null) {
            user.create({
                name: req.body.name,
                email: 'facebook.com/' + req.body.facebookId,
                password: req.body.password,
                salt: '0Auth'
            }).then(value => {
                req.session.user = value.id;
                req.session.basket = value.basket;
                return res.json({success: true, data: req.session.user});
            }).catch(error => {
                // console.log(error);
            });
        } else {
            req.session.user = value.id;
            return res.json({success: true, data: req.session.user});
        }
    }).catch(error => {
        console.log(error);
    });
});

/*

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
*/

// Product.hasOne(HotDeal, {foreignKey: 'id_product'});
// Product.associate = function (models) {
//     models.Product.hasOne(models.HotDeal);
// };

// Product.associate = function(models) {
//     models.Product.hasOne(models.HotDeal);
// };

//
// HotDeal.associate = function(models) {
//     models.HotDeal.belongsTo(models.Product,{foreignKey: 'id_product'});
// };

// HotDeal.associate = function (models) {
//     models.HotDeal.belongsTo(models.Product, {
//         onDelete: "CASCADE",
//         foreignKey: {
//             allowNull: false
//         }
//     });
// };


// Product.hasOne(HotDeal, {foreignKey: 'id_product'});
// HotDeal.hasOne(Product, {foreignKey: 'id_product'});
// Product.associate = function (models) {
//     models.Product.hasOne(models.HotDeal, {as: 'AwayTeam'});
// };
