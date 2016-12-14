var thrift = require("thrift");
var Calculator = require("./thriftMessage/Calculator");
var ttypes = require("./gen-nodejsthriftMessage/tutorial_types");
var SharedStruct = require("./thriftMessage/shared_types").SharedStruct;

var data = {};

var server = thrift.createServer(Calculator, {
    ping: function() {
        console.log("ping()");
    },

    add: function(n1, n2) {
        console.log("add(", n1, ",", n2, ")");
        return n1 + n2;
    },

    calculate: function(logid, work) {
        console.log("calculate(", logid, ",", work, ")");

        var val = 0;
        if (work.op == ttypes.Operation.ADD) {
            val = work.num1 + work.num2;
        } else if (work.op === ttypes.Operation.SUBTRACT) {
            val = work.num1 - work.num2;
        } else if (work.op === ttypes.Operation.MULTIPLY) {
            val = work.num1 * work.num2;
        } else if (work.op === ttypes.Operation.DIVIDE) {
            if (work.num2 === 0) {
                var x = new ttypes.InvalidOperation();
                x.whatOp = work.op;
                x.why = 'Cannot divide by 0';
                throw x;
            }
            val = work.num1 / work.num2;
        } else {
            var x = new ttypes.InvalidOperation();
            x.whatOp = work.op;
            x.why = 'Invalid operation';
            throw x;
        }

        var entry = new SharedStruct();
        entry.key = logid;
        entry.value = ""+val;
        data[logid] = entry;
        return val;
    },

    getStruct: function(key) {
        console.log("getStruct(", key, ")");
        return data[key];
    },

    zip: function() {
        console.log("zip()");
    }

});

server.listen(9090);