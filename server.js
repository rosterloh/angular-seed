'use strict';

var express   	= require('express');
var morgan      = require('morgan');
var app         = express();
var port    	= process.env.PORT || 8080;
var socketio    = require('socket.io');
var serialport	= require('serialport');
var SerialPort	= serialport.SerialPort; // localize object constructor

var socketServer;
var serialPort;
var portName  =  'COM6';//'/dev/ttyS0';
var sendData  =  '';
var i = 0;

function initSocketIO(httpServer,debug)
{
	socketServer = socketio.listen(httpServer);
	
	if(debug === false)
	{
		socketServer.set('log level', 1); // socket.io debug OFF
	}
	
	socketServer.on('connection', function (socket) {
		console.log('user connected');
		socket.emit('onconnection', {pollOneValue:sendData});		
		
		socketServer.on('update', function(data) {
			socket.emit('updateData',{pollOneValue:data});
		});
		
		socket.on('buttonval', function(data) {
			serialPort.write(data.toString());
			//console.log('buttonval: ' + data);
		});
		
		socket.on('sliderval', function(data) {
			serialPort.write(data.toString());
			//console.log('sliderval: ' + data);
		});
		
		socket.on('start', function(data) {
			serialPort.write(data.toString());
			//console.log('start: ' + data);
		});
    });
}

function serialListener(debug)
{
	//var receivedData = '';

	serialPort = new SerialPort(portName, {
		parser: serialport.parsers.readline('\n'),
		baudrate    :  9600,
		dataBits    :  8,
		parity      : 'none',
		stopBits    :  1,
		flowControl :  false
	});

	serialPort.on('open', function () 
	{
		if(debug === true)
		{
	    	console.log('open serial communication');
	    }

	    serialPort.on('data', function(data) 
	    {
			var receivedData = data;
			sendData = receivedData.split('.');  //Split data by '.'
		
			for(i=0; i<sendData.length; i++)     //transmit the sendData array
			{
				socketServer.emit('update', sendData[i]);
			}
	   });       
   });  
}

function startServer(debug)
{
	app.use(express.static(__dirname + '/public'));
	app.use(morgan('dev'));

	var httpServer = app.listen(port);
	console.log('Server started on port ' + port);

	serialListener(debug);
	initSocketIO(httpServer,debug);
}

startServer(false);

exports.start = startServer;
