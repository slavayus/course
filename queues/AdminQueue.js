'use strict';
const amqp = require('amqplib/callback_api');

class AdminQueue {
    doResponseAdmin(orderId, data) {
        amqp.connect('amqp://localhost', function (err, conn) {
            conn.createChannel(function (err, ch) {
                const queueName = 'admin_' + orderId;

                ch.assertQueue(queueName, {durable: false, autoDelete: true});

                ch.sendToQueue(queueName, new Buffer(JSON.stringify(data)));
                console.log(" [x] Sent 'Data from admin!'");
            })
        });
    };

}

module.exports = AdminQueue;