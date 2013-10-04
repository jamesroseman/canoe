var vows = require('vows'),
	assert = require('assert'),
	geo = require('../index.js'),
	Coords = geo.Coords,
	geocoder = new geo.Geocoder(),
	specReporter = require("vows/lib/vows/reporters/spec"),
	testData = {
		validAddress: {
			address: '525 Market St, Philadelphia, PA 19106',
			point: [39.950598, -75.149274]
		},
		partialAddress: {
			address: '525 Market 19106',
			point: [39.950598, -75.149274]
		},
		ambiguousAddress: {
			address: 'Market St Philadelphia PA 19106'
		},
		usZip: {
			address: 19106,
			point: [39.947420, -75.147271]
		},
		caProvinceWithSpace: {
			address: 'M4A 2L7',
			point: [43.718971, -79.300228]
		},
		caProvinceNoSpace: {
			address: 'M4A2L7',
			point: [43.718971, -79.300228]
		}
	};

// Geocoder Test Suite
vows.describe('When geocoding').addBatch({
	'A valid, full US address': {
		topic: function() {
			geocoder.geocode(testData.validAddress.address, this.callback);
		},

		'does not return an error': function (err, coords) {
			assert.isNull(err);
		},
		'returns coords': function (err, coords) {
			assert.instanceOf(coords, Coords);
		},
		'coords are within 0.25 miles of pre-calculated point': function(err, coords) {
			var distance = coords.distanceTo(testData.validAddress.point);
			assert(distance < 0.25);
		}
	},
	'A valid, partial address': {
		topic: function() {
			geocoder.geocode(testData.partialAddress.address, this.callback);
		},

		'does not return an error': function (err, coords) {
			assert.isNull(err);
		},
		'returns coords': function (err, coords) {
			assert.instanceOf(coords, Coords);
		},
		'coords are within 0.25 miles of pre-calculated point': function(err, coords) {
			var distance = coords.distanceTo(testData.partialAddress.point);
			assert(distance < 0.25);
		}
	},
	'An ambiguous address': {
		topic: function() {
			geocoder.geocode(testData.ambiguousAddress.address, this.callback);
		},

		'returns an error': function (err, coords) {
			assert.isNotNull(err);
			assert.instanceOf(err, Error);
		}
	},
	'A US zip code (as a string)': {
		topic: function() {
			geocoder.geocode(testData.usZip.address.toString(), this.callback);
		},


		'does not return an error': function (err, coords) {
			assert.isNull(err);
		},
		'returns coords': function (err, coords) {
			assert.instanceOf(coords, Coords);
		},
		'coords are within 0.25 miles of pre-calculated point': function(err, coords) {
			var distance = coords.distanceTo(testData.usZip.point);
			assert(distance < 0.25);
		}
	},
	'A US zip code (as a Number)': {
		topic: function() {
			geocoder.geocode(testData.usZip.address, this.callback);
		},

		'does not return an error': function (err, coords) {
			assert.isNull(err);
		},
		'returns coords': function (err, coords) {
			assert.instanceOf(coords, Coords);
		},
		'coords are within 0.25 miles of pre-calculated point': function(err, coords) {
			var distance = coords.distanceTo(testData.usZip.point);
			assert(distance < 0.25);
		}
	},
	'A Canadian postal code (with space)': {
		topic: function() {
			geocoder.geocode(testData.caProvinceWithSpace.address, this.callback);
		},

		'does not return an error': function (err, coords) {
			assert.isNull(err);
		},
		'returns coords': function (err, coords) {
			assert.instanceOf(coords, Coords);
		},
		'coords are within 0.25 miles of pre-calculated point': function(err, coords) {
			var distance = coords.distanceTo(testData.caProvinceWithSpace.point);
			assert(distance < 0.25);
		}
	},
	'A Canadian postal code (without space)': {
		topic: function() {
			geocoder.geocode(testData.caProvinceNoSpace.address, this.callback);
		},

		'does not return an error': function (err, coords) {
			assert.isNull(err);
		},
		'returns coords': function (err, coords) {
			assert.instanceOf(coords, Coords);
		},
		'coords are within 0.25 miles of pre-calculated point': function(err, coords) {
			var distance = coords.distanceTo(testData.caProvinceNoSpace.point);
			assert(distance < 0.25);
		}
	},
	'An invalid address': {
		topic: function() {
			geocoder.geocode('999999 Market St Philadelphia PA 19147', this.callback);
		},

		'returns an error': function (err, coords) {
			assert.isNotNull(err);
			assert.instanceOf(err, Error);
		}
	},
	'An empty string': {
		topic: function() {
			geocoder.geocode('', this.callback);
		},

		'returns an error': function (err, coords) {
			assert.isNotNull(err);
			assert.instanceOf(err, Error);
		}
	},
	'A non-String/non-Number value': {
		topic: function() {
			geocoder.geocode(false, this.callback);
		},

		'returns an error': function (err, coords) {
			assert.isNotNull(err);
			assert.instanceOf(err, Error);
		}
	}
}).run({
	reporter: specReporter
});