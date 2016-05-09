var express = require('express');
var app = express();
var amqp = require('amqp');

var connection = amqp.createConnection({ host: 'rabbit'
, port: 5672
, login: 'user'
, password: 'user'
, connectionTimeout: 10000
, authMechanism: 'AMQPLAIN'
, vhost: '/'
, noDelay: true
, ssl: { enabled : false
       }
});
connection.on('ready', function () {
  // Use the default 'amq.topic' exchange
  connection.queue('second', function (q) {
      // Catch all messages
      q.bind('#');

      // Receive messages
      q.subscribe(function (message) {
        // Print messages to stdout
        console.log(message);
      });
  });
});

app.get('/second', function (req, res) {
  res.send('Hello from second!');
  connection.publish('first', {success: true}, {
    contentType: 'application/json'
  });
});

app.listen(8081, function () {
  console.log('Second server is started!');
});
