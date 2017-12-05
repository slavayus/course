'use strict';
const amqp = require('amqplib/callback_api');

class OrderQueue{
    doResponseOrders(orderId, data) {
        amqp.connect('amqp://localhost', function (err, conn) {
            conn.createChannel(function (err, ch) {
                const queueName = 'order_' + orderId;

                ch.assertQueue(queueName, {durable: false, autoDelete: true});

                ch.sendToQueue(queueName, new Buffer(JSON.stringify(data)));
                console.log(" [x] Sent 'Data from orders!'");
            })
        });
    };

}

module.exports = OrderQueue;