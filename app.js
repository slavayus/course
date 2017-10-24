const Product = require('./entity/Product');
const product = new Product;

const User = require('./entity/User');
const user = new User;

const HotDeal = require('./entity/HotDeals');
const hotDeal = new HotDeal;

const express = require('express');
const app = express();
app.listen(3030, function () {
    console.log('App started on 3030 port!');
});


app.all('/products', product.getAllProducts);

app.all('/product/:id', product.getProductById);

app.all('/products/:type', product.getProductsByType);

app.all('/products/types', product.getProductsAllTypes);

app.all('/search/:data', product.searchProducts);

app.all('/admin/product/insert/:name/:image_min_version/:image_large_version/:description/:price/:type', product.createProduct);

app.all('/admin/product/delete/element/:id', product.deleteProductById);

app.all('/admin/product/delete/type/:type', product.deleteProductType);


app.all('/admin/user/delete/:id', user.delete);

app.all('/user/:login/:password', user.checkUser);

app.all('/user/new/:name/:surname/:login/:password/', user.create);


app.all('/', hotDeal.getAll);
app.all('/admin/hotdeal/add/:image/:until/:id', hotDeal.create);


Product.create({
    name: 'John9',
    image_min_version: '4',
    image_large_version: '4',
    description: '4',
    date_post: '2017-10-23 18:04:42',
    price: 50,
    type: 'posters',
}).catch(reason => console.log(1, reason.message));


HotDeal.create({
    image_hot_version: 'sddsddsdf',
    until: '2017-12-23 23:04:42',
    id_product: 2,
}).catch(reason => console.log(2, reason.message));


User.create({
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
