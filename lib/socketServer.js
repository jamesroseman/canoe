/* jshint node : true */

/*
	This is your socket server. 
	There are many like it, but this one is yours.
	Any outgoing requests from clients to your server via Socket will be dealt with here.
*/

var dust = require('dustjs-linkedin'),
	help = require('dustjs-helpers');

var airports = {
	'atl' : '33.6367,-84.4281',
	'jfk' : '40.6397,-73.7789',
	'bos' : '42.3631,-71.0064',
	'lax' : '33.9425,-118.4081'
};

exports.socketServer = function(server) {
	var io = require('socket.io').listen(server),
		events = require('events'),
		yelpVendor = require('../vendors/yelp'),
		redis = require('redis');

	//  Logging debug information slows the server, so it is set by default to off.
	io.set('log level', 0);

	io.sockets.on('connection', function (socket) {
		console.log('New Socket Connected');

		// Change of filtered markers
		socket.on('filterReq', function (term, isActive) {
			socket.emit('filterRes', term, isActive);
		});

		// Load markers from Redis
		socket.on('redisLoadReq', function () {
			redisClient = redis.createClient();

			redisClient.keys('*', function (err, keys) {
				if (err) {
					return console.log(err);
				}

				for (var i=0, len = keys.length; i < len; i++) {
					redisClient.hgetall(keys[i], function (err, obj) {
						if (err) {
							return console.log(err);
						}
						socket.emit('redisLoadRes', obj);
					});
				}
			});
		});

		// Change of displayed city
		socket.on('cityChangeReq', function (city) {
			if (airports[city]) {
				socket.emit('cityChangeRes', airports[city]);
			}
		});

		// Store markers to Redis
		socket.on('redisStoreReq', function (location, term, icon, color) {
			var eventEmitter = new events.EventEmitter();
			eventEmitter.on('yelpJSON', function (JSON) {
				eventEmitter.on('geocoded', function (results) {
					if (results) {
						redisClient = redis.createClient();
						for (var i = 0; i < results.length; i++) {
							redisClient.hmset(results[i].lat+','+results[i].lon, results[i]);
						}
						socket.emit('redisStoreRes');
					}
				});
				yelpVendor.getGeocodes(JSON.results, term, icon, color, eventEmitter);
			});
			yelpVendor.yelp(location, term, eventEmitter);
		});
	});
};