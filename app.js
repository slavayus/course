const Product = require('./entity/Product');
let product = new Product;


const express = require('express');
const HotDeals = require('./database/DefineHotDeals');
const Users = require('./database/DefineUser');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;


const app = express();
app.listen(3030, function () {
    console.log('App started on 3030 port!');
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//REQUEST AND RESPONS. SERVER LISTENERS
//PRODUCT FIND
app.all('/products', product.getAllProducts);


app.all('/product/:id', function (req, res) {
    Product.findById(Number(req.params.id))
        .then((value => {
            if (value != null) {
                res.send(value)
            } else {
                res.send('Element not found')
            }
        }));
});

app.all('/products/:type', function (req, res) {
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
});


app.all('/products/types', function (req, res) {
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
});

app.all('/search/:data', function (req, res) {
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
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PRODUCT INSERT
app.all('/admin/product/insert/:name/:image_min_version/:image_large_version/:description/:price/:type', function (req, res) {
    Product.create({
        name: req.params.name,
        image_min_version: req.params.image_min_version,
        image_large_version: req.params.image_large_version,
        description: req.params.description,
        date_post: new Date(),
        price: Number(req.params.price),
        type: req.params.type,
    }).catch(reason => res.send(reason.message));
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PRODUCT DELETE
app.all('/admin/product/delete/element/:id', function (req, res) {
    Product.findById(Number(req.params.id))
        .then(task => {
            if (task !== null) {
                if (task.destroy()) {
                    res.send('Row deleted')
                } else {
                    res.send('Row doesn\'t deleted')
                }
            } else {
                res.send('No such element')
            }
        })
});


app.all('/admin/product/delete/type/:type', function (req, res) {
    Product.findAll()
        .then(task => {
            if (task !== null) {
                task.forEach(value => value.destroy());
                res.send('Type deleted')
            } else {
                res.send('No such element')
            }
        })
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//DELETE USER
app.all('/admin/user/delete/:id', function (req, res) {
    Users.findById(Number(req.params.id))
        .then(task => {
            if (task !== null) {
                task.destroy();
                res.send('User deleted')
            } else {
                res.send('User not found')
            }
        })
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//SELECT USER
app.all('/user/:login/:password', function (req, res) {
    let login = req.params.login;
    let password = req.params.password;

    Users.findAll({
        where: {
            login: login,
            password: password,
        }
    }).then(value => {
        if (value.length === 0) {
            res.send("User not found")
        }
        res.send(value)
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//INSERT NEW USER
app.all('/user/new/:name/:surname/:login/:password/', function (req, res) {
    Users.create({
        name: req.params.name,
        surname: req.params.surname,
        login: req.params.login,
        password: req.params.password
    }).catch(reason => res.send(reason.errno));
});


app.all('/', function (req, res) {
    HotDeals.findAll()
        .then(value => {
            if (value.length === 0) {
                res.send('No such element')
            } else {
                res.send(value)
            }
        });
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//INSERT DATA INTO TABLES
Product.create({
    name: 'John9',
    image_min_version: '4',
    image_large_version: '4',
    description: '4',
    date_post: '2017-10-23 18:04:42',
    price: 50,
    type: 'posters',
}).catch(reason => console.log(1, reason.message));


HotDeals.create({
    image_hot_version: 'sddsddsdf',
    until: '2017-12-23 23:04:42',
    id_product: 2,
}).catch(reason => console.log(2, reason.message));


Users.create({
    name: 'John',
    surname: 'John',
    login: 'John',
    password: 'John'
}).catch(reason => console.log(3, reason.message));


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
