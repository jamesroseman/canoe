/* jshint node : true */

/*
	This is your socket server. 
	There are many like it, but this one is yours.
	Any outgoing requests from clients to your server via Socket will be dealt with here.
*/

/*var redis = require('redis'),
	redisClient = redis.createClient();*/

exports.socketServer = function(server) {
	var io = require('socket.io').listen(server),
		events = require('events'),
		yelpVendor = require('../vendors/yelp');

	//  Logging debug information slows the server, so it is set by default to off.
	io.set('log level', 0);

	io.sockets.on('connection', function (socket) {
		console.log('New Socket Connected');

		socket.on('yelpReq', function (location, term) {
			var eventEmitter = new events.EventEmitter();
			eventEmitter.on('yelpJSON', function (JSON) {
				eventEmitter.on('geocoded', function (results) {
					// Send points to be generated
					JSON.results = results;
					socket.emit('yelpRes', JSON);
				});
				yelpVendor.getGeocodes(JSON.results, eventEmitter);
			});
			yelpVendor.yelp(location, term, eventEmitter);
		});

	});
};