'use strict';

var fs      =  require('fs');
//var server  =  require('./server');

function sendInterface(response) {
	console.log('Request handler was called.');
	response.writeHead(200, {'Content-Type': 'text/html'});
	var html = fs.readFileSync(__dirname + '/public/index.html');
	response.end(html);
}

exports.sendInterface = sendInterface;
