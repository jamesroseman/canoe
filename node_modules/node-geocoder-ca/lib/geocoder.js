var http = require('http'),
	qs = require('querystring'),
	EventEmitter = require('events').EventEmitter,
	util = require('util'),
	sax = require('sax'),
	Coords = require('./coords.js');

/**
 * Geocoder object
 *
 * @param {Object} options
 * @constructor
 */
function Geocoder(options) {
	this.options = options || {};

	// Override default node behavior to exit on 'error' event
	this.on('error', function() {});

	// Call super_
	EventEmitter.call(this);
}

// Add event handling to geocoder
util.inherits(Geocoder, EventEmitter);

Geocoder.endpoints = {
	'PRIMARY': 'http://geocoder.ca',
	'BACKUP': 'http://backup-geocoder.ca'
};

/**
 * Do geocode
 *
 * @param {Object} location - Fields to query based on
 * @param {Function} callback - Receives err, coords
 */
Geocoder.prototype.geocode = function(location, callback) {
	var self = this,
		coords = new Coords(),
		request, qs;

	callback = callback || function() {};

	// Make a guess at location
	if (!location || '' == location) {
		var err = new Error('Invalid location');
		return this._error(err, callback);
	} else if ('string' == typeof location) {
		request = {
			locate: location
		};
	} else if ('object' == typeof location) {
		request = location;
	} else if ('number' == typeof location && 5 == location.toString().length) {
		request = {
			postal: location
		};
	} else {
		var err = new Error('Invalid location');
		return this._error(err, callback);
	}

	// Build qs
	qs = this._getQueryString(request);

	// Try main endpoint
	http.get(Geocoder.endpoints.PRIMARY + '?' + qs, function(result) {
		// Process results on success
		self._processHttpResult.call(self, result, coords, callback);
	}).on('error', function(err) {
			// If we have an error and we're a paying user, try again at the backup endpoint
			if (self.options.apiKey) {
				http.get(Geocoder.endpoints.BACKUP + '?' + qs, function(result) {
					// Process results on backup success
					self._processHttpResult.call(self, result, coords, callback);
				}).on('error', function(err) {
						// OK, now we really have an error
						self._error(err, callback);
					});
			} else {
				// Throw error if we're a free account
				self._error(err, callback);
			}
		});

	return this;
}

Geocoder.prototype._processHttpResult = function(result, coords, callback) {
	var self = this,
		currentNode = '',
		saxOpts = {
			trim: true,
			normalize: true,
			lowercase: true
		},
		stream = sax.createStream(false, saxOpts)
			.on('opentag', function(node) {
				currentNode = node.name;
			})
			.on('text', function(text) {
				switch (currentNode) {
					case 'latt':
						coords.latitude = parseFloat(text);
						break;
					case 'longt':
						coords.longitude = parseFloat(text);
						break;
				}
			})
			.on('end', function() {
				if (coords.longitude && coords.latitude) {
					this.emit("result", coords);
					callback.call(coords, null, coords);
				} else {
					var err = new Error('Unable to geocode location.');
					self._error(err, callback);
				}
			})
			.on('error', function(err) {
				self._error(err, callback);
			});

	// Pipe response to SAX
	result.pipe(stream);
}

Geocoder.prototype._error = function(err, callback) {
	this.emit('error', err);
	callback(err, null);
	return err;
}

/**
 * Helper method to build an appropriate query string for the Geocoder.ca API
 *
 * @param {Object} request
 * @returns {String}
 * @throws Error
 * @private
 */
Geocoder.prototype._getQueryString = function(request) {
	// Set up request
	request.geoit = 'XML';
	if (this.options.apiKey) {
		request.auth = this.options.apiKey;
	}

	if ((!request.locate) && (!request.postal) && !(request.addresst && request.stno && request.city && request.prov)) {
		throw new Error('No required location information was provided (locate or postal or addresst/stno/city/prov');
	}

	return qs.stringify(request);
};

module.exports = Geocoder;