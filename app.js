#!/usr/bin/env node

const product = new (require('./utils/ProductUtil'));
const user = new (require('./utils/User'));
const hotDeal = new (require('./utils/HotDeals'));


const productQueues = new (require('./queues/ProductsQueues'));
const elementQueues = new (require('./queues/ElementQueues'));
const adminQueue = new (require('./queues/AdminQueue'));
const registerQueue = new (require('./queues/RegisterQueue'));
const typeQueue = new (require('./queues/TypeQueue'))

const app = require('./connections/ExpressConnection');

const RESPONSE_TO_CLIENT = 'Ваш запрос обрабатывается';

app.get('/products/all/:orderId', function (req, res) {
    res.send(RESPONSE_TO_CLIENT);

    product.getAllProducts().then(value => {
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

app.get('/product/:id/:orderId', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    product.getProductById(req.params.id).then(value => {
        if (value === null) {
            elementQueues.doResponseElement(req.params.orderId, {
                status: 'empty',
                data: 'No such element'
            });
        } else {
            elementQueues.doResponseElement(req.params.orderId, {
                status: 'success',
                data: value
            });
        }
    }).catch(error => {
        elementQueues.doResponseElement(req.params.orderId, {
            status: 'error',
            data: error
        });
    });
});

app.get('/products/:type/:orderId', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    product.getProductsByType(req.params.type).then(value => {
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

app.get('/products/alltypes', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    product.getProductsAllTypes(req.params.type).then(value => {
        if (value.length === 0) {
            typeQueue.doResponseType({
                status: 'empty',
                data: 'No such element'
            });
        } else {
            typeQueue.doResponseType({
                status: 'success',
                data: value
            });
        }
    }).catch(error => {
        typeQueue.doResponseType({
            status: 'error',
            data: error
        });
    });
});

app.get('/search/:text/:orderId', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    product.searchProducts(req.params.text).then(value => {
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

app.all('/user/new/:orderId', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    user.create(req.data).then(value => {
        if (value.length === 0) {
            registerQueue.doResponseRegister(req.params.orderId, {
                status: 'empty',
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
