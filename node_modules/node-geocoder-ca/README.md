Geocoder.ca Module
===========================

Node.js module to interface with the Geocoder.ca API.
[![Build Status](https://travis-ci.org/inxilpro/node-geocoder-ca.png)](https://travis-ci.org/inxilpro/node-geocoder-ca)

Usage
---------------------------

Accepts a `location` argument and a `callback`.  `callback` receives
two params: `err` and `coords`.  In the case of an error, `err` will
contain an `Error` object.  Otherwise, `coords` will be populated with
a `Coords` object, with `lat` and `lon` properties.

`location` can be one of the following:

 - a String with location (eg. __"525 Market St, Philadelphia, PA 19106"__)
 - a String with a zip/postal code (eg. __"19106"__ or __"M4A 2L7"__)
 - a Number with a 5-digit zip code (eg. __19106__)
 - an Object containing one of the following:
    - a single `locate` property containing one of the above
    - a single `postal` propery containing a zip or postal code
    - the following four properties: `addresst`, `stno`, `city`, and `prov`

If `location` is an object, it is converted to a query string and passed directly
to the Geocoder.ca API.  See [API docs](http://geocoder.ca/?premium_api=1) for parameters.

Example
---------------------------

```javascript
var Geocoder = require('node-geocoder-ca').Geocoder,
	geocoder = new Geocoder(),
	address = '525 Market St, Philadelphia, PA 19106';

geocoder.geocode(address, function(err, coords) {
	if (err) {
		throw err;
	}

	console.log("%s geocoded to [%d, %d]", address, coords.lat, coords.lon);
});
```

Events
---------------------------
The `Geocoder` object is an event emitter.  It emits the following events:

 - A `result` event happens whenever geocoding succeeds.  It passes a `Coords` object to any listeners.
 - A `error` event happens whenever there is an error.  It passes the `Error` object to any listeners.

You can choose to skip the `callback` on the `geocode()` method and listen for events instead.

**Warning: this usage is currently untested.**

Example:

```javascript
var Geocoder = require('node-geocoder-ca').Geocoder,
	geocoder = new Geocoder(),
	address = '525 Market St, Philadelphia, PA 19106';

geocoder.geocode(address)
	.on('result', function(coords) { /* ... */ })
	.on('error', function(err) { /* ... */ });
```

Todo
---------------------------
- [x] Basic geocoding
- [ ] Suggestions on failed geocoding
- [ ] Reverse geocoding
- [ ] Tests for event-based usage