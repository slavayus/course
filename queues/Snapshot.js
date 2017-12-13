'use strict';
const amqp = require('amqplib/callback_api');
const config = require('../etc/config.json');

class Snapshot {
    doResponseElement(orderId, data) {
        amqp.connect(config.amqp_host, function (err, conn) {
            conn.createChannel(function (err, ch) {
                const queueName = 'snapshot_' + orderId;

                ch.assertQueue(queueName, {durable: false, autoDelete: true});

                ch.sendToQueue(queueName, new Buffer(JSON.stringify(data)));
                console.log(" [x] Sent 'Data from snapshot!'");
            })
        });
    };

}

module.exports = Snapshot;