'use strict';
const amqp = require('amqplib/callback_api');
const config = require('../etc/config.json');

class TypeQueue {
    doResponseType(queueId, data) {
        amqp.connect(config.amqp_host, function (err, conn) {
            conn.createChannel(function (err, ch) {
                const queueName = 'product_types_' + queueId;

                ch.assertQueue(queueName, {durable: false, autoDelete: true});

                ch.sendToQueue(queueName, new Buffer(JSON.stringify(data)));
                console.log(" [x] Sent 'Data from types!'");
            })
        });
    };

}

module.exports = TypeQueue;