#!/usr/bin/env node

const product = new (require('./utils/ProductUtil'));
const user = new (require('./utils/User'));
const hotDeal = new (require('./utils/HotDeals'));


const productQueues = new (require('./queues/ProductsQueues'));
const elementQueues = new (require('./queues/ElementQueues'));
const adminQueue = new (require('./queues/AdminQueue'));
const registerQueue = new (require('./queues/RegisterQueue'));
const typeQueue = new (require('./queues/TypeQueue'));

const app = require('./connections/ExpressConnection');

const RESPONSE_TO_CLIENT = 'Ваш запрос обрабатывается';

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
app.post('/admin/product/:orderId', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    product.createProduct(req.body).then(value => {
        adminQueue.doResponseAdmin(req.params.orderId, {
            status: 'success',
            data: value
        }).catch(error => {
            adminQueue.doResponseAdmin(req.params.orderId, {
                status: 'error',
                data: error
            });
        });
    });
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
app.delete('/admin/product/:id/:orderId', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    product.deleteProductById(req.params.id).then(value => {
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
 * Проверяет существует ли пользователь с опреденными данными.
 *
 * В response запроса уведомляет клиента, что задача получена.
 *
 * В очередь register_orderId отправляет JSON-object с результатми работы.
 * Если в бд существует такой пользователь, то в очередь отправляется JSON-object со статусом 'empty'
 * и с данными 'No such element'.
 * Если не удалось найти в бд такого пользователя, то в очедерь отправляется JSON-object со статусом 'success'
 * и количество найденных пользователей.
 * Если произошла ошибка при получении пользователя из бд, то в очередь отправляется JSON-object со статусом 'error'
 * и саму ошибку.
 */
app.post('/user/:orderId', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    user.checkUser(req.data).then(value => {
        if (value.length === 0) {
            registerQueue.doResponseRegister(req.params.orderId, {
                status: 'empty',
                data: 'User not found'
            })
        } else {
            registerQueue.doResponseRegister(req.params.orderId, {
                status: 'success',
                data: value
            })
        }
    }).catch(error => {
        registerQueue.doResponseRegister(req.params.orderId, {
            status: 'error',
            data: error
        });
    });
});


/**
 * Записывает в бд нового пользователя.
 *
 * В response запроса уведомляет клиента, что задача получена.
 *
 * В очередь register_orderId отправляет JSON-object с результатми работы.
 * Если в бд существует такой пользователь, то в очередь отправляется JSON-object со статусом 'fail'
 * и с данными 'The user is not added'.
 * Если удалось добавить в бд этого пользователя, то в очедерь отправляется JSON-object со статусом 'success'
 * и количество добавленных пользователей.
 * Если произошла ошибка при добавлении пользователя из бд, то в очередь отправляется JSON-object со статусом 'error'
 * и саму ошибку.
 */
app.all('/user/new/:orderId', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    user.create(req.data).then(value => {
        if (value.length === 0) {
            registerQueue.doResponseRegister(req.params.orderId, {
                status: 'fail',
                data: 'The user is not added'
            })
        } else {
            registerQueue.doResponseRegister(req.params.orderId, {
                status: 'success',
                data: value
            })
        }
    }).catch(error => {
        registerQueue.doResponseRegister(req.params.orderId, {
            status: 'error',
            data: error
        });
    });
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
app.get('/:orderId', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    hotDeal.getAll().then(value => {
        if (value.length === 0) {
            productQueues.doResponseProducts(req.params.orderId, {
                status: 'empty',
                data: 'No such element'
            });
        } else {
            productQueues.doResponseProducts(req.params.orderId, {
                status: 'success',
                data: value
            });
        }
    }).catch(error => {
        productQueues.doResponseProducts(req.params.orderId, {
            status: 'error',
            data: error
        });
    });
});


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
app.post('/admin/hotdeal/:orderId', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    hotDeal.create(req.data).then(value => {
        if (value.length === 0) {
            productQueues.doResponseProducts(req.params.orderId, {
                status: 'empty',
                data: 'No such element'
            });
        } else {
            productQueues.doResponseProducts(req.params.orderId, {
                status: 'success',
                data: value
            });
        }
    }).catch(error => {
        productQueues.doResponseProducts(req.params.orderId, {
            status: 'error',
            data: error
        });
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
