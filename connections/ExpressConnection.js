const config = require('../etc/config.json');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(cors({credentials: true, origin: `${config.clientHost}:${config.clientPort}`}));
app.use(bodyParser.json());
app.use(cookieParser());


const MySQLStore = require('express-mysql-session')(session);
app.listen(config.serverPort, '192.168.1.34', function () {
    console.log('App started on ' + config.serverPort + ' port!');
});

const configMS = {
    user: config.database.login,
    password: config.database.password,
    host: config.database.host,
    port: config.database.port,
    database: config.database.name
};

const sessionStore = new MySQLStore(configMS);

app.use(session({
    secret: config.session.secret,
    key: config.session.key,
    cookie: config.session.cookie,
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}));

// routes
const authRoutes = require('../auth/auth');
app.use('/auth', authRoutes);

const adminRoutes = require('../admin/admin');
app.use('/admin', adminRoutes);

module.exports = app;