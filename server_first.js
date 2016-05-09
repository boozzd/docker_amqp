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
  connection.queue('first', function (q) {
      // Catch all messages
      q.bind('#');

      // Receive messages
      q.subscribe(function (message) {
        // Print messages to stdout
        console.log(message);
      });
  });
});



app.get('/first', function (req, res) {
  res.send('Hello from first!');
  connection.publish('second', {success: true}, {
    contentType: 'application/json'
  });
});

app.listen(8080, function () {
  console.log('First server is started!');
});
