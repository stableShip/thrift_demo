'use strict';
var thrift = require('thrift');
var Calculator = require('./thriftMessage/Calculator');
var ttypes = require('./thriftMessage/tutorial_types');
var co = require('co');

var transport = thrift.TBufferedTransport;
var protocol = thrift.TBinaryProtocol;

var connection = thrift.createConnection("localhost", 9090, {
    transport: transport,
    protocol: protocol
});


connection.on('error', function (err) {
    assert(false, err);
});

connection.on('connect', co.wrap(function*() {
    try {
        // Create a Calculator client with the connection
        var client = thrift.createClient(Calculator, connection);


        var pinged = yield client.ping();
        console.log(pinged);

        var addResult = yield client.add(1, 1);
        console.log("1+1=" + addResult);

        var work = new ttypes.Work();
        work.op = ttypes.Operation.DIVIDE;
        work.num1 = 1;
        work.num2 = 1;
        var divideResult = yield client.calculate(1, work);
        console.log(divideResult);

        work.op = ttypes.Operation.SUBTRACT;
        work.num1 = 15;
        work.num2 = 10;
        var subtractResult = yield client.calculate(2, work);
        console.log('subtractResult: ', subtractResult);

        var struct = yield client.getStruct(2);
        console.log('Check log: ' + JSON.stringify(struct));

    } catch (err) {
        if(err instanceof ttypes.InvalidOperation){
            console.log("无效的操作: ", err.why);
        }else{
            console.log("未知错误: ", err);
        }
    } finally {
        //close the connection once we're done
        connection && connection.end();
    }
}));