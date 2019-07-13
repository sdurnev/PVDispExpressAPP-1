var modbusHost = '82.200.166.231';
var modbusPort = '55999';


function modbusReadAll(callback) {
    var a = {
        'totalEnergy': 0,
        'currPower': 0,
        'coSawing': 0
    };
    modbusTotalEnergy(function (totalEnergy) {
        modbusCurrPower(function (currPower) {
            a.currPower = currPower;
        });
        a.totalEnergy = totalEnergy;
        a.coSawing = totalEnergy * 0.5;
        console.log(a);
    })

}

function modbusTotalEnergy(callback) {
    var Uint64BE = require('int64-buffer').Uint64BE;
    let modbus = require('jsmodbus');
    let net = require('net');
    let socket = new net.Socket();
    let options = {
        'host': modbusHost,
        'port': modbusPort
    };
    let client = new modbus.client.TCP(socket, 2);

    socket.on('connect', function () {
        client.readHoldingRegisters(30513, 4)
            .then(function (resp) {
                var buf = new Buffer(Uint16Array.from(resp.response._body.values).buffer);
                var temp1 = Uint8Array.from(buf);
                var temp2 = [];
                for (i=0; i<temp1.length; i++){
                    if((i%2)==0){
                        temp2.push(temp1[i+1],temp1[i]);
                    }
                }
                var big = new Uint64BE(new Uint8Array(temp2));
                socket.end();
                callback(big*1);
            }).catch(function () {
            console.error(require('util').inspect(arguments, {
                depth: null
            }));
            socket.end()
        })
    });
    socket.on('error', console.error);
    socket.connect(options)
}

function modbusCurrPower(callback) {
    let modbus = require('jsmodbus');
    let net = require('net');
    let socket = new net.Socket();
    let options = {
        'host': modbusHost,
        'port': modbusPort
    };
    let client = new modbus.client.TCP(socket, 2);

    socket.on('connect', function () {
        client.readHoldingRegisters(30775, 2)
            .then(function (resp) {
                var buf = new Buffer(Uint16Array.from(resp.response._body.values).buffer);
                var temp1 = Uint8Array.from(buf);
                var temp2 = [];
                for (i=0; i<temp1.length; i++){
                    if((i%2)==0){
                        temp2.push(temp1[i+1],temp1[i]);
                    }
                }
                var buf1 = new Buffer(Uint8Array.from(temp2).buffer);
                var big = buf1.readInt32BE();
                socket.end();
                callback(big*1);
            }).catch(function () {
            console.error(require('util').inspect(arguments, {
                depth: null
            }));
            socket.end()
        })
    });

    socket.on('error', console.error);
    socket.connect(options)
}


modbusReadAll();

/*

function modbusReadAll(callback) {
    var a = {
        'totalEnergy': 0,
        'currPower': 0,
        'coSawing': 0
    };
    modbusTotalEnergy(function (totalEnergy) {
        modbusCurrPower(function (currPower) {
            a.currPower = currPower;
        });
        a.totalEnergy = totalEnergy;
        a.coSawing = totalEnergy * 0.5;
        console.log(a);
    })

}

function modbusTotalEnergy(callback) {
    var modbus = require('node-modbus');
    var Uint64BE = require('int64-buffer').Uint64BE;
    var client = modbus.client.tcp.complete({
        'host': modbusHost,
        'port': modbusPort,
        'unitId': 2,
        'logEnabled': false,
        'logLevel': 'debug',
        'logTimestamp': true
    });

    client.on('connect', function () {
        client.readInputRegisters(30513, 4).then(function (resp) {
            var big = new Uint64BE(resp.payload);
            console.log(resp);
            //console.log(big.toString(10));
            callback(big * 1);
        }).catch(function (err) {
            console.log(err)
        }).done(function () {
            client.close()
        })
    });

    client.on('error', function (err) {
        console.log(err)
    });

    client.connect();
}

function modbusCurrPower(callback) {
    var modbus = require('node-modbus');
    var Uint64BE = require('int64-buffer').Uint64BE;
    var client = modbus.client.tcp.complete({
        'host': modbusHost,
        'port': modbusPort,
        'unitId': 2,
        'logEnabled': false,
        'logLevel': 'debug',
        'logTimestamp': true
    });

    client.on('connect', function () {
        client.readInputRegisters(30775, 2).then(function (resp) {
            var big = resp.payload.readInt32BE();
            //console.log(big);
            //console.log(big * 2);
            //console.log(big.toString(16));
            callback(big.toString(10));
        }).catch(function (err) {
            console.log(err)
        }).done(function () {
            client.close()
        })
    });

    client.on('error', function (err) {
        console.log(err)
    });

    client.connect();
}
*/

//modbusReadAll();
