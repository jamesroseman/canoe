/* jshint node: true */

var events = require('events'),
	yelpVendor = require('../../vendors/yelp');

exports.yelp = function(req, res) {
	// Capture input
	var locationTerm = req.params.location.split(',');
	var location = locationTerm[0]+','+locationTerm[1];
	var term = locationTerm[2];

	var eventEmitter = new events.EventEmitter();
	eventEmitter.on('yelpJSON', function (JSON) {
		res.json(JSON);
	});
	yelpVendor.yelp(location, term, eventEmitter);
};