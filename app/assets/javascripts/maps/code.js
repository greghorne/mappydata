	////////////////////////////////////////	
	// Initializes search box
	// ////////////////////////////////////////
	// function initSearchBoxControl() {

	// 	var input = document.getElementById('pac-input');
	// 	var searchBox = new google.maps.places.SearchBox(input);
	// 	map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

	// 	map.addListener('bounds_changed', function() {
	// 		searchBox.setBounds(map.getBounds());
	// 	});

	// 	searchBox.addListener('places_changed', function() {
	// 		var places = searchBox.getPlaces();
	// 		if (places.length == 0) { return; }
	// 		clearMap();

	// 		// For each place, get the icon, name and location.
	// 		var bounds = new google.maps.LatLngBounds();
	// 		places.forEach(function(place) {
	// 			var icon = {
	// 				url: place.icon,
	// 				size: new google.maps.Size(71, 71),
	// 				origin: new google.maps.Point(0, 0),
	// 				anchor: new google.maps.Point(17, 34),
	// 				scaledSize: new google.maps.Size(25, 25)
	// 			};

	// 			// Create a marker for each place.
	// 			markers.push(new google.maps.Marker({
	// 				map: map,
	// 				icon: icon,
	// 				title: place.name,
	// 				position: place.geometry.location
	// 			}));

	// 		});

	// 		doIsochrone(places[0].geometry.location.lat(), places[0].geometry.location.lng())
	// 	})
	// };
	////////////////////////////////////////	

		//////////////////////////////
		// Custom button controls set up
		//////////////////////////////
		// function initCustomControls(controlDiv, map) {

		// 	// We set up a variable for this since we're adding event listeners later.
		// 	var control = this;

		// 	// Set CSS for the control border
		// 	var geolocateUI = document.createElement('div');
		// 	geolocateUI.id = 'geolocateUI';
		// 	geolocateUI.title = 'Click to geolocate on map';
		// 	controlDiv.appendChild(geolocateUI);

		// 	// Set CSS for the control interior
		// 	var geolocateText = document.createElement('div');
		// 	geolocateText.id = 'geolocateText';
		// 	geolocateText.innerHTML = 'Geolocate';
		// 	geolocateUI.appendChild(geolocateText);

		// 	// Click event for Geolocate
		// 	geolocateUI.addEventListener('click', function() {
		// 		var options = { timeout: 5000, enableHighAccuracy: true }
		// 		navigator.geolocation.getCurrentPosition(success, error, options)
		// 	});
		// 	//////////////////////////////


		// 	//////////////////////////////
		// 	// Clear Map
		// 	//////////////////////////////
		// 	var clearMapUI = document.createElement('div');
		// 	clearMapUI.id = 'clearMapUI';
		// 	clearMapUI.title = 'Click to clear map';
		// 	controlDiv.appendChild(clearMapUI);

		// 	// Set CSS for the control interior
		// 	var clearMapText = document.createElement('div');
		// 	clearMapText.id = 'clearMapText';
		// 	clearMapText.innerHTML = 'Clear Map';
		// 	clearMapUI.appendChild(clearMapText);

		// 	// Set up the click event listener for 'Set Center': Set the center of the
		// 	// control to the current center of the map.
		// 	clearMapUI.addEventListener('click', function() {
		// 		clearMap();
		// 	});
		// 	//////////////////////////////

		// };
		//////////////////////////////

	////////////////////////////////////////	
	// Geolocation 'success' function
	////////////////////////////////////////
	function success(location) {
		doIsochrone(position.lat, position.lng);
	};
	////////////////////////////////////////
  	

	////////////////////////////////////////
	// Geolocation 'error' function
	////////////////////////////////////////
	function error(error) {
		alert("Error: getCurrentPosition: " + error)
	}
	////////////////////////////////////////


	//////////////////////////////////////	
	// Generates isochrone
	//////////////////////////////////////	
 //    function doIsochrone(lat, lng) {
		 
	// 	 // remove any marker in markers[]
	// 	if (markers.length > 0) {
	// 		for (var counter = 0; counter < markers.length; counter++) {
	// 			markers[counter].setMap(null);
	// 			markers.pop();
	// 		}
	// 	}

	// 	// create a new marker
	// 	var latlng = { lat: lat, lng: lng };
	// 	var marker = new google.maps.Marker({
	// 		position: latlng,
	// 		map: map
	// 	})
		
	// 	// add marker to markers[] and set/create it on the map
	// 	markers.push(marker);
	// 	markers[0].setMap(map);

	// 	$.ajax({
	// 		url:  "/create_isochrone.json",
	// 		type: "POST",
	// 		data: {latitude: lat,
	// 			   longitude: lng,
	// 			   time: 300}
	// 	}).done(function (result) {

	// 		var numberIndicies = result.data.coordinates[0][0].length
	// 		var coords = []

	// 		for (n = 0; n < numberIndicies; n++) {
	// 			lat = result.data.coordinates[0][0][n][1]
	// 			lng = result.data.coordinates[0][0][n][0]
	// 			coords.push({lat: lat, lng: lng})
	// 		}

	// 		// clear map of previous map features
	// 		map.data.forEach(function(feature) {
	// 			map.data.remove(feature);
	// 		})

	// 		// define new polygon and add to map
	// 		var polygon = new google.maps.Data.Polygon([coords]);
	// 		map.data.setStyle({
	// 			strokeColor: '#c43844',
	// 			strokeOpacity: 0.8,
	// 			strokeWeight: 2,
	// 			fillColor: '#f4d442',
	// 			fillOpacity: .3
	// 		});

	// 		map.data.add({
	// 			geometry: polygon
	// 		});

	// 		// fit map to isochrone polygon
	// 		var bounds = new google.maps.LatLngBounds();
	// 		polygon.forEachLatLng(function (point) { 
	// 			bounds.extend(new google.maps.LatLng(point.lat(), point.lng()));
	// 		});
 //            map.fitBounds(bounds); 
	// 	});
	// 	alertify.success("Polygon created")
	// };
	//////////////////////////////////////	