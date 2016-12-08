var thrift = require('thrift');
var Calculator = require('./gen-nodejs/Calculator');
var ttypes = require('./gen-nodejs/tutorial_types');


var transport = thrift.TBufferedTransport;
var protocol = thrift.TBinaryProtocol;

var connection = thrift.createConnection("localhost", 9090, {
    transport : transport,
    protocol : protocol
});

connection.on('error', function(err) {
    assert(false, err);
});

// Create a Calculator client with the connection
var client = thrift.createClient(Calculator, connection);


client.ping()
    .then(function() {
        console.log('ping()');
    });

client.add(1,1)
    .then(function(response) {
        console.log("1+1=" + response);
    });

work = new ttypes.Work();
work.op = ttypes.Operation.DIVIDE;
work.num1 = 1;
work.num2 = 0;

client.calculate(1, work)
    .then(function(message) {
        console.log('Whoa? You know how to divide by zero?');
    })
    .fail(function(err) {
        console.log("InvalidOperation " + err);
    });


work.op = ttypes.Operation.SUBTRACT;
work.num1 = 15;
work.num2 = 10;

client.calculate(1, work)
    .then(function(value) {
        console.log('15-10=' + value);
        return client.getStruct(1);
    })
    .then(function(message) {
        console.log('Check log: ' + message.value);
    })
    .fin(function() {
        //close the connection once we're done
        connection.end();
    });