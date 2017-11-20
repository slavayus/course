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

module.exports = app;