/* jshint node: true */

var socket;
var map;
var lastOpened;
var markInfos = {};

$(document).ready(function () {
	socket = io.connect('http://'+$('.ip_addr').text());
	$('.ip_addr').remove();
});

// Holds all markers
var markers = {};

// Translate number into rating stars
var getRatingHTML = function (rating) {
	var rat = parseInt(rating, 10);

	var emptyStar = '<i class="icon-star-empty"></i>';
	var halfStar = '<i class="icon-star-half-empty"></i>';
	var fullStar = '<i class="icon-star"></i>';

	var stars = [
		emptyStar,
		emptyStar,
		emptyStar,
		emptyStar,
		emptyStar,
	];

	for (var i = 0; i < rat; i+=0.5) {
		var index = Math.floor(i);

		if (stars[index] == emptyStar) {
			stars[index] = halfStar;
		}

		else if (stars[index] == halfStar) {
			stars[index] = fullStar;
		}
	}

	return stars.join('');
};

// Create and format a new Google Maps marker for the map
var makeMarker = function (result, color) {
	if (result) {
		if (result.coords) {
			var image = './img/markers/'+result.color+'.png';

			var retMarker = new google.maps.Marker({
				position: new google.maps.LatLng(result.lat,result.lon),
				title: result.name,
				icon: image
			});

			if (!markers[result.lat+','+result.lon]) {
				markers[result.lat+','+result.lon] = retMarker;

				if (!markers[result.term]) {
					markers[result.term] = [];
				}

				markers[result.term].push(retMarker);
			}

			return retMarker;
		}
	}
	return;
};

// Create and format a new Google Maps marker info window for the map's marker
var makeInfoWindow = function (map, preContent, content, singleMarkerJSON) {
	var marker = makeMarker(singleMarkerJSON);
	marker.setMap(map);

	// Preview (on mouseover)
	var preInfoWindow = new google.maps.InfoWindow({
		content: preContent,
		width: 225
	});

	google.maps.event.addListener(marker, 'mouseover', function() {
		if (lastOpened) {
			lastOpened.close();
		}
		lastOpened = preInfoWindow;
		preInfoWindow.open(map, marker);
	});

	google.maps.event.addListener(marker, 'mouseout', function() {
		preInfoWindow.close(map, marker);
	});

	google.maps.event.addListener(marker, 'click', function() {
		preInfoWindow.close(map, marker);
	});

	// Real content (on click)
	var infoWindow = new google.maps.InfoWindow({
		content: content,
		width: 275
	});

	google.maps.event.addListener(marker, 'click', function() {
		if (lastOpened) {
			lastOpened.close();
		}
		lastOpened = infoWindow;
		infoWindow.open(map, marker);
		// Map re-centers on click of marker
		map.panTo(marker.position);
	});

	return infoWindow;
};

// Display and hide groups of markers on the map
var filterChange = function (map, term, isActive) {
	var markersList = markers[term];
	if (!isActive && markersList) {
		markersList.map(function (marker) {
			marker.setMap(null);
		});
	}
	else if (isActive && markersList) {
		markersList.map(function (marker) {
			marker.setMap(map);
		});
	}
};

// Move center of map to new location
function moveToLocation (map, lat, lng){
    var center = new google.maps.LatLng(lat, lng);
    // using global variable:
    map.panTo(center);
}

// Takes in a term and location and generates markers from the Yelp API
var loadRedisMarkers = function (map, location, term, color) {
	socket.emit('redisLoadReq', location, term);
	socket.on('redisLoadRes', function (singleMarkerJSON) {
		var name = singleMarkerJSON.name,
			rat = getRatingHTML(singleMarkerJSON.rating),
			icon = singleMarkerJSON.icon,
			url = singleMarkerJSON.url,
			img = singleMarkerJSON.img,
			text = singleMarkerJSON.text;

		// Preview info window
		var preInfoHTML = [
			'<div class="info-window">',
			'<h1 class="info info-name">'+name+'</h1>',
			'<p class="info info-rating">'+rat+'</p>',
			'<i class="'+icon+'"></i>',
			'</div>'
		].join('');

		// Error checking
		var imgHTML = '';
		if (img != 'undefined') {
			imgHTML = '<img class="img" src="'+img+'"></img>';
		}

		// Full info window
		var infoHTML = [
			'<div class="full info-window">',
			'<a href="'+url+'" target="_blank">',
			'<div class="info info-url">',
			'<h1 class="info info-name">'+name+'</h1>',
			'</div>',
			'</a>',
			'<i class="'+icon+'"></i>',
			'<p class="info info-rating">'+rat+'</p>',
			imgHTML,
			'<p class="info info-text">"'+text+'"</p>',
			'</div>'
		].join('');

		makeInfoWindow(map, preInfoHTML, infoHTML, singleMarkerJSON);
	});
};

// Takes in a location, queries the API for markers, and stores markers in Redis
var storeRedisMarkers = function (location, term, icon, color) {
	console.log(location, term, icon, color);
	socket.emit('redisStoreReq', location, term, icon, color);
	socket.on('redisStoreRes', function () {
		console.log('stored');
	});
};

// Main function, initializes the map and sets socket listeners
var initialize = function () {
	// Create the map and set center location
	var myLatlng = new google.maps.LatLng(42.3631,-71.0064);

	var mapOptions = {
		zoom: 14,
		center: myLatlng,
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
	};

	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	// Loading from a cache, only have to load markers once.
	var lat = map.getCenter().lat();
	var lng = map.getCenter().lng();
	loadRedisMarkers(map, lat+','+lng, 'food', 'red');

	// ATTN: This section is to query Yelp and cache markers. Limited to 100 geo-locs
	var storeMarks = true;

	if (storeMarks) {
		storeRedisMarkers('33.6367,-84.4281', 'food', 'icon-food', 'red');
		storeRedisMarkers('33.6367,-84.4281', 'hotel', 'icon-home', 'blue');

		storeRedisMarkers('40.6397,-73.7789', 'food', 'icon-food', 'red');
		storeRedisMarkers('40.6397,-73.7789', 'hotel', 'icon-home', 'blue');

		storeRedisMarkers('42.3631,-71.0064', 'food', 'icon-food', 'red');
		storeRedisMarkers('42.3631,-71.0064', 'hotel', 'icon-home', 'blue');

		storeRedisMarkers('33.9425,-118.4081', 'food', 'icon-food', 'red');
		storeRedisMarkers('33.9425,-118.4081', 'hotel', 'icon-home', 'blue');
	}

	// Filter responses
	socket.on('filterRes', function (term, isActive) {
		filterChange(map, term, isActive);
	});

	// City change responses
	socket.on('cityChangeRes', function (coords) {
		latLng = coords.split(',');
		moveToLocation(map, latLng[0], latLng[1]);
	});
};

google.maps.event.addDomListener(window, 'load', initialize);
