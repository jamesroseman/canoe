function deg2rad(deg) {
	return deg * (Math.PI/180)
}

function simple_distance(pointA, pointB) {
	var R = 6371, // Radius of the earth in km
		dLat = deg2rad(pointB.lat - pointA.lat),
		dLon = deg2rad(pointB.lon - pointA.lon),
		a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(pointA.lat)) *
			Math.cos(deg2rad(pointB.lat)) * Math.sin(dLon/2) * Math.sin(dLon/2),
		c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
		d = R * c; // Distance in km

	return d;
}

module.exports = simple_distance;