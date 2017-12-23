#!/usr/bin/env node
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
const basketQueue = new (require('./queues/BasketQueue'));
const typeQueue = new (require('./queues/TypeQueue'));
const snapshot = new (require('./queues/Snapshot'));

const crypto = require('crypto');
const nodemailer = require('nodemailer');
const config = require('./etc/config.json');

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
            user.getUserCount(req.session.user).then(value2 => {
                elementQueues.doResponseElement(req.query.queueId, {
                    status: 'success',
                    data: value,
                    count: value2
                });
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

    let size = req.query.size;

    hotDeal.getAll().then(value => {
        let isEnd = value.length <= size;
        value = value.slice(0, size);
        if (value.length === 0) {
            productQueues.doResponseProducts(req.query.queueId, {
                status: 'empty',
                data: 'No such element'
            });
        } else {
            productQueues.doResponseProducts(req.query.queueId, {
                status: 'success',
                data: value,
                end: isEnd
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

    product.loadProductsFromArray(userBasket).then(value => {
        if (value.length === 0) {
            basketQueue.doResponseElement(req.query.queueId, {
                status: 'empty',
                data: 'No such element'
            });
        } else {
            user.getUserCount(req.session.user).then(value2 => {
                basketQueue.doResponseElement(req.query.queueId, {
                    status: 'success',
                    data: value,
                    count: value2
                });
            });
        }
    }).catch(error => {
        basketQueue.doResponseElement(req.query.queueId, {
            status: 'error',
            data: error.name
        });
    });
});

app.get('/user/bank/count', (req, res) => {
    let userId = req.session.user;

    user.getUserCount(userId).then(value => {
        res.send(value.dataValues.count + '');
    }).catch(error => {
        console.log(error);
    });
});

app.get('/user/bank/count/add', (req, res) => {
    let userId = req.session.user;


    user.getUserCount(userId).then(value1 => {
        let sum = Number(req.query.sum) + value1.dataValues.count;
        user.userCountAdd(userId, sum).then(value => {
            user.getUserCount(userId).then(value => {
                res.send({count: value.dataValues.count, status: true});
            }).catch(error => {
                res.send({status: false});
            });
        }).catch(error => {
            res.send({status: false});
        });
    }).catch(error => {
        res.send({status: false});
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
    res.send(RESPONSE_TO_CLIENT);

    let userId = req.session.user;

    const code = crypto.randomBytes(6)
        .toString('hex')
        .slice(0, 6);

    user.setOrderCode(code, userId, req.body.productPrice).then(() => {
        nodemailer.createTestAccount((err, account) => {
            let transporter = nodemailer.createTransport({
                host: config.mail.host,
                port: Number(config.mail.port),
                secure: config.mail.secure,
                auth: {
                    user: config.mail.login,
                    pass: config.mail.password
                }
            });

            user.getUser(userId).then(value => {
                let mailOptions = {
                    from: `Mr. Robot <${config.mail.login}>`,
                    to: value.email,
                    subject: 'Подтвердите покупку продуктов на Mr.Robot-store',
                    text: `Введите этот код в поле ввода для подтверждения покупки.\n${value.orderCode}`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                });
            })
        });

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
                order.create(value.dataValues.id, userId, code).then(() => {
                    console.log('Ваш заказ принят.\nНаш администратор свяжется с вами в ближайщее время.')
                }).catch(error => {
                    res.send(`Не удалось оформить заказ.\nКод ошибки: \n${error.name}`);
                })
            }).catch(error => {
                console.log(`Не удалось оформить заказ.\nКод ошибки: \n${error.name}`);
            })
        }).catch(error => {
            console.log(`Не удалось оформить заказ.\nКод ошибки: \n${error.name}`);
        })
    });
});


app.get('/checkorder', (req, res) => {
    let userId = req.session.user;

    user.getUser(userId).then(value => {
        if (req.query.code === value.dataValues.orderCode) {
            order.confirmProducts(value.dataValues.id, req.query.code).then(value2 => {
                let newCount = value.dataValues.count - value.dataValues.orderPrice;
                user.userCountAdd(userId, newCount).then(value3 => {
                    res.send('codeIsOk');
                })
            }).catch(reason => {
                console.log(reason.name);
            })
        } else {
            res.send('codeIsFalse');
        }
    }).catch(error => {
        console.log(`Не удалось оформить заказ.\nКод ошибки: \n${error}`);
    })
});

app.post('/order/confirm', (req, res) => {
    order.setDelivered(req.body.id).then(value => {
        res.send('sucess')
    }).catch(reason => {
        res.send('fail');
    });
});

app.post('/order/basket', (req, res) => {
    res.send(RESPONSE_TO_CLIENT);

    let userId = req.session.user;

    const code = crypto.randomBytes(6)
        .toString('hex')
        .slice(0, 6);

    console.log(req.body.productsPrice);
    user.setOrderCode(code, userId, req.body.productsPrice).then(() => {
        nodemailer.createTestAccount((err, account) => {
            let transporter = nodemailer.createTransport({
                host: config.mail.host,
                port: Number(config.mail.port),
                secure: config.mail.secure,
                auth: {
                    user: config.mail.login,
                    pass: config.mail.password
                }
            });

            user.getUser(userId).then(value => {
                let mailOptions = {
                    from: `Mr. Robot <${config.mail.login}>`,
                    to: value.email,
                    subject: 'Подтвердите покупку продуктов на Mr.Robot-store',
                    text: `Введите этот код в поле ввода для подтверждения покупки.\n${value.orderCode}`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                });
            })
        });

        req.body.productsId.forEach(v => {
            product.getProductById(v).then(value => {
                ProductSnapshots.create({
                    productId: value.id,
                    name: value.name,
                    image_min_version: value.image_min_version,
                    image_large_version: value.image_large_version,
                    description: value.description,
                    date_post: value.date_post,
                    price: value.price,
                    type: value.type
                }).then(value2 => {
                    order.create(value2.dataValues.id, userId, code).then(() => {
                        console.log(`Ваш заказ на товар №${value.id} принят.`)
                    }).catch(error => {
                        console.log(`Не удалось оформить заказ на товар №${value.id}.\nКод ошибки: \n${error.name}`);
                    })
                }).catch(error => {
                    console.log(`Не удалось оформить заказ на товар №${value.id}.\nКод ошибки: \n${error.name}`);
                })
            }).catch(error => {
                console.log(`Не удалось оформить заказ на товар №${value.id}.\nКод ошибки: \n${error.name}`);
            })
        });
    });

});

app.post('/login/facebook', (req, res) => {
    user.checkUser(`facebook.com/${req.body.facebookId}`).then(value => {
        if (value === null) {
            user.create({
                name: req.body.name,
                email: 'facebook.com/' + req.body.facebookId,
                password: req.body.password,
                salt: '0Auth',
                isAdmin: false
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