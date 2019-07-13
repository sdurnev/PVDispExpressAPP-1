var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var getdataRouter = require('./routes/getdata');
var getdataaktauRouter = require('./routes/getdataaktau');
var getdatauralskRouter = require('./routes/getdatauralsk');

var app = express();

/***
 * -=============-
 */
/*
var modbus = require('node-modbus');
var Uint64BE = require('int64-buffer').Uint64BE;
var client = modbus.client.tcp.complete({
    'host': '192.168.151.20',
    'port': 502,
    'unitId': 2,
    'logEnabled': false,
    'logLevel': 'debug',
    'logTimestamp': true
});

global.currPower1 = 0;
global.totalEnergy1 = 0;
global.modbusTimer = Date.now();

function modbusCicle() {
    while (true) {
        if ((Date.now() - modbusTimer) >= 5000) {
            console.log("RUN");
            global.modbusTimer = Date.now();
        }
    }
}


function getModbus() {
    client.on('connect', function () {
        client.readInputRegisters(30513, 4).then(function (resp) {
            //var buffer = Buffer.from(resp.payload);
            //console.log(buffer);
            //console.log(resp);
            var big = new Uint64BE(resp.payload);
            console.log(big);
            console.log(big * 2);
            console.log(big.toString(10));
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

//modbusCicle();

/***
 * -=============-
 */




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/getdata', getdataRouter);
app.use('/getdataaktau', getdataaktauRouter);
app.use('/getdatauralsk', getdatauralskRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
