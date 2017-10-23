const Product = require('./database/DefineProduct');
const express = require('express');
const HotDeals = require('./database/DefineHotDeals');

const app = express();
app.listen(3030, function () {
    console.log('App started on 3030 port!');
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//REQUEST AND RESPONS. SERVER LISTENERS
app.all('/products', function (req, res) {
    Product.findAll()
        .then(value => res.send(value));
});


app.all('/product/:id', function (req, res) {
    Product.findById(Number(req.params.id))
        .then(value => res.send(value));
});


app.all('/', function (req, res) {
    Product.findAll()
        .then(value => res.send(value));
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//INSERT DATA INTO TABLES
Product.create({
    name: 'John1',
    image_min_version: 'ae',
    image_large_version: 'fe5',
    description: '2aes',
    date_post: '2017-10-23 18:04:42',
    price: 50,
    type: '1aesa',
}).catch(reason => console.log(1, reason.message));


HotDeals.create({
    image_hot_version: 'dsddsdf',
    until: '2017-10-23 23:04:42',
}).catch(reason => console.log(2, reason.message));


// try {
//     Product.findAll({
//         where: {
//             title: 'John1'
//         }
//     }).then(value => {
//         if (value.length===0){
//             throw new SyntaxError("Мало данных");
//         }
//         console.log(value)
//     });
//
// } catch (err) {
//     console.log(err.name);
//     //Do nothing
// }


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
