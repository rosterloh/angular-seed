'use strict';

var server = require('./server');
var router = require('./route');
var requestHandlers = require('./requestHandlers');

var debug = false;

var handle = {};
handle['/'] = requestHandlers.sendInterface;
handle['/public'] = requestHandlers.sendInterface;

server.start(router.route,handle,debug);
