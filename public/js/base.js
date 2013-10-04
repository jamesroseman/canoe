/* jshint node: true */

var makeMarker = function (result, color) {
	if (result) {
		if (result.coords) {
			var image = './img/markers/'+color+'.png';

			var retMarker = new google.maps.Marker({
				position: new google.maps.LatLng(result.lat,result.lon),
				title: result.name,
				icon: image
			});

			return retMarker;
		}
	}
	return;
};

function initialize() {

	// Create the map and set center location
	var myLatlng = new google.maps.LatLng(42.3631,-71.0064);

	var mapOptions = {
		zoom: 14,
		center: myLatlng,
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
	};

	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);


	// Adding the points to the map
/*
	redMarker.setMap(map);
	greenMarker.setMap(map);
	purpleMarker.setMap(map);


	// Create info windows

	var contentPreviewString = '<div id="content">'+
		'<div id="siteNotice">'+
		'</div>'+
		'<h1 id="firstHeading" class="firstHeading"><i class="icon-btc"></i></h1>';

	var contentString = '<div id="content">'+
		'<div id="siteNotice">'+
		'</div>'+
		'<h1 id="firstHeading" class="firstHeading"><i class="icon-btc"></i></h1>'+
		'<div id="bodyContent">'+
		'<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
		'sandstone rock formation in the southern part of the '+
		'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
		'south west of the nearest large town, Alice Springs; 450&#160;km '+
		'(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
		'features of the Uluru - Kata Tjuta National Park. Uluru is '+
		'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
		'Aboriginal people of the area. It has many springs, waterholes, '+
		'rock caves and ancient paintings. Uluru is listed as a World '+
		'Heritage Site.</p>'+
		'<p>Attribution: Uluru, <a href="http://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
		'http://en.wikipedia.org/w/index.php?title=Uluru</a> '+
		'(last visited June 22, 2009).</p>'+
		'</div>'+
		'</div>';

	var infowindow = new google.maps.InfoWindow({
		content: contentString
	});

	var infowindowPreview = new google.maps.InfoWindow({
		content: contentPreviewString
	});


	google.maps.event.addListener(redMarker, 'mouseover', function() {
		infowindowPreview.open(map,redMarker);
	});

	google.maps.event.addListener(redMarker, 'mouseout', function() {
		infowindowPreview.close(map, redMarker);
	});

	google.maps.event.addListener(redMarker, 'click', function() {
		infowindowPreview.close(map, redMarker);
		infowindow.open(map, redMarker);
	});*/

	var socket = io.connect('http://'+$('.ip_addr').text());
	$('.ip_addr').remove();

	// Takes in a term and location and generates markers from the Yelp API
	var makeYelpMarkers = function (socket, location, term, color) {
		socket.emit('yelpReq', location, term);
		socket.on('yelpRes', function (JSON) {
			console.log(JSON);
			addMarkers(JSON, color);
		});
	};

	// Takes in the Yelp API JSON and makes markers, given the JSON and color
	var addMarkers = function (JSON, color) {
		var results = JSON.results;
		var markersToSet = results.map(function (result) {
			return makeMarker(result, color);
		});

		markersToSet.map(function (marker) {
			if (marker) {
				marker.setMap(map);
			}
		});
	};

	google.maps.event.addListener(map, 'idle', function() {
		var lat = map.getCenter().lat();
		var lng = map.getCenter().lng();

		for (var l=0; l < 0.01; l+=0.1) {
			makeYelpMarkers(socket, (lat)+','+(lng), 'food', 'red');
			makeYelpMarkers(socket, (lat)+','+(lng+l), 'food', 'red');
			makeYelpMarkers(socket, (lat+l)+','+(lng), 'food', 'red');
			makeYelpMarkers(socket, (lat+l)+','+(lng+l), 'food', 'red');

			makeYelpMarkers(socket, (lat)+','+(lng), 'hotel', 'blue');
			makeYelpMarkers(socket, (lat)+','+(lng+l), 'hotel', 'blue');
			makeYelpMarkers(socket, (lat+l)+','+(lng), 'hotel', 'blue');
			makeYelpMarkers(socket, (lat+l)+','+(lng+l), 'hotel', 'blue');
		}
	});

}

google.maps.event.addDomListener(window, 'load', initialize);