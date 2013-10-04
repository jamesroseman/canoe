/**
 * Basic coordinates object
 *
 * @param {Number} lat
 * @param {Number} lon
 * @constructor
 */
function Coords(longitude, latitude) {
	this.longitude = longitude;
	this.latitude = latitude;
}

Coords.distanceFactors = {
	'kilometers': 1,
	'miles': 1.609344,
	'nautical_miles': 1.852
};
Coords.distanceFactors.km = Coords.distanceFactors.kilometers;
Coords.distanceFactors.mi = Coords.distanceFactors.miles;

Coords.prototype.distanceFactor = 'miles';

Coords._isGeoJSON = function(point) {
	if ('object' !== typeof point) return false;
	if (!point.type) return false;
	if ('Point' != point.type) return false;
	if (!point.coordinates) return false;
	if (!Array.isArray(point.coordinates)) return false;
	if (2 != point.coordinates.length) return false;

	return true;
};

Coords._isPointObject = function(point) {
	if ('object' == typeof point) return false;
	if (!point.longitude || !point.latitude) return false;
	if ('number' != typeof point.longitude) return false;
	if ('number' != typeof point.latitude) return false;

	return true;
};

Coords._isPointArray = function(point) {
	if (!Array.isArray(point)) return false;
	if (2 != point.length) return false;
	if ('number' != typeof point[0]) return false;
	if ('number' != typeof point[1]) return false;

	return true;
}

Coords._toRadians = function(degree) {
	return degree * (Math.PI / 180);
}

Coords.prototype.distanceTo = function (point) {
	var longitude, latitude;

	if (point instanceof Coords) {
		longitude = point.longitude;
		latitude = point.latitude;
	} else if (Coords._isGeoJSON(point)) {
		longitude = point.coordinates[0];
		latitude = point.coordinates[1];
	} else if (Coords._isPointObject(point)) {
		longitude = point.longitude;
		latitude = point.latitude;
	} else if (Coords._isPointArray(point)) {
		longitude = point[0];
		latitude = point[1];
	} else {
		var err = new Error('Provided point is neither a Coords object nor a GeoJSON Point object.');
		throw err;
	}

	var earthRadiusInKm = 6371,
		longitudeDelta = Coords._toRadians(longitude - this.longitude),
		latitudeDelta = Coords._toRadians(latitude - this.latitude),
		a = Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) + Math.cos(Coords._toRadians(this.latitude)) *
			Math.cos(Coords._toRadians(latitude)) * Math.sin(longitudeDelta / 2) * Math.sin(longitudeDelta / 2),
		c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
		distance = (earthRadiusInKm * c) / Coords.distanceFactors[this.distanceFactor];

	// console.log('Distances from [%d, %d] to [%d, %d] is %d %s', this.longitude, this.latitude, longitude, latitude, distance, this.distanceFactor);
	return distance;
}

/**
 * Implement GeoJSON "Point" spec
 *
 * @returns {{type: string, coordinates: Array}}
 */
Coords.prototype.toJSON = function() {
	return {
		"type": "Point",
		"coordinates": [this.longitude, this.latitude]
	};
}

module.exports = Coords;
