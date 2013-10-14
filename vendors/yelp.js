/* jshint node: true */

var apiKeys = require('../keys/yelp'),
	events = require('events'),
	request = require('request');

var getTimestamp = function () {
	return String(Math.round(new Date().getTime() / 1000));
};

var getNonce = function () {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

var getGeocode = function (result, eventEmitter) {
	var addr = result.addr;
	var url = 'http://maps.google.com/maps/api/geocode/json?sensor=false&address='+addr;
	var lat;
	var lon;
	var err = null;
	request(url, function (error, response, body) {
		if (error) {
			console.log(error, lat, lng);
		}
		else {
			var coorJSON = JSON.parse(body);
			if (coorJSON.results.length > 0) {
				lat = coorJSON.results[0].geometry.location.lat;
				lon = coorJSON.results[0].geometry.location.lng;
			}
			else {
				err = 'not found';
			}
			eventEmitter.emit('singleGeocoded', err, lat, lon);
		}
	});
};

exports.getGeocodes = function (results, term, icon, color, eventEmitter) {
	var i = results.length-1;

	var next = function (results, i) {
		i = i - 1;
		if (i <= 0) {
			eventEmitter.emit('geocoded', results);
		}
		else {
			cont(results, i);
		}
	};

	var cont = function (results, i) {
		var internalEmitter = new events.EventEmitter();
		internalEmitter.on('singleGeocoded', function (err, lat, lon) {
			if (err) {
				results[i].coords = false;
			}
			else {
				results[i].coords = true;
				results[i].lat = lat;
				results[i].lon = lon;
				results[i].term = term;
				results[i].icon = icon;
				results[i].color = color;
			}
			next(results, i);
		});
		getGeocode(results[i], internalEmitter);
	};
	cont(results, i);
};

exports.yelp = function(location, term, eventEmitter) {
	// Create the Yelp API request
	var yelp = require('yelp').createClient({
		consumer_key: apiKeys.yelpOauthConsumerKey,
		consumer_secret: apiKeys.yelpOauthSecretConsumerKey,
		token: apiKeys.yelpOauthToken,
		token_secret: apiKeys.yelpOauthSecretToken
	});

	yelp.search(
	{
		ll: location,
		term: term
	},
	function (error, data) {
		if (error) {
			eventEmitter.emit('yelpJSON', {});
		}
		else {
			var yelpJSON = data;
			var retJSON = {};
			var results = yelpJSON.businesses;
			retJSON['results'] = results.map(function (result) {
				var retResult = {};
				var addr = result.location.display_address;
				var aLen = addr.length;
				retResult.name = result.name;
				retResult.text = result.snippet_text;
				retResult.img = result.image_url;
				retResult.url = result.url;
				retResult.rating = result.rating;
				retResult.addr = addr.join(', ');
				retResult.distance = String(Math.ceil(result.distance));
				retResult.numReviews = result.review_count;
				return retResult;
			});
			eventEmitter.emit('yelpJSON', retJSON);
		}
	});
};