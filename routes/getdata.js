var express = require('express');
var router = express.Router();

var modbusHost = '82.200.166.231';
var modbusPort = '55999';

router.get('/', function(req, res, next) {
    modbusReadAll(function (data) {
        res.send(JSON.stringify(data));
    });
});


function modbusReadAll(callback) {
    var a = {
        'totalEnergy': 0,
        'currPower': 0,
        'coSawing': 0
    };
    modbusTotalEnergy(function (totalEnergy) {
        modbusCurrPower(function (currPower) {
            //console.log(currPower);
            a.currPower = currPower;
        });
        a.totalEnergy = totalEnergy;
        a.coSawing = totalEnergy * 0.5;
        console.log(a);
        callback(a);
    })

}

function modbusTotalEnergy(callback) {
    var Uint64BE = require('int64-buffer').Uint64BE;
    var modbus = require('jsmodbus');
    var net = require('net');
    var socket = new net.Socket();
    var options = {
        'host': modbusHost,
        'port': modbusPort
    };
    var client = new modbus.client.TCP(socket, 2);

    socket.on('connect', function () {
        client.readHoldingRegisters(30513, 4)
            .then(function (resp) {
                var buf = new Buffer(Uint16Array.from(resp.response._body.values).buffer);
                var temp1 = Uint8Array.from(buf);
                var temp2 = [];
                for (i=0; i<temp1.length; i++){
                    if((i%2)===0){
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
    var modbus = require('jsmodbus');
    var net = require('net');
    var socket = new net.Socket();
    var options = {
        'host': modbusHost,
        'port': modbusPort
    };
    var client = new modbus.client.TCP(socket, 2);

    socket.on('connect', function () {
        client.readHoldingRegisters(30775, 2)
            .then(function (resp) {
                var buf = new Buffer(Uint16Array.from(resp.response._body.values).buffer);
                var temp1 = Uint8Array.from(buf);
                var temp2 = [];
                for (i=0; i<temp1.length; i++){
                    if((i%2)===0){
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

/**
 *
 * Functon for test
 */
function genData(callback){
    var currPower = (Math.random()*(10000-100)+100).toFixed(2);
    var totalEnergy = (Math.random()*(10000-100)+100).toFixed(2);
    var coSawing = (Math.random()*(10000-100)+100).toFixed(2);
    var data = '{\"currPower\":'+currPower+',\"totalEnergy\":'+totalEnergy+',\"coSawing\":'+coSawing+'}';
    callback(data);
}

module.exports = router;
