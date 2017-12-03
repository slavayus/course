const config = require('../etc/config.json');

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.listen(config.serverPort, function () {
    console.log('App started on ' + config.serverPort + ' port!');
});


app.use(cors());
app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({ extended: false }));

// routes
const authRoutes = require('../auth/auth');
app.use('/auth', authRoutes);

module.exports = app;