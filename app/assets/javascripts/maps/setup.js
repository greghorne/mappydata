var Map = window.map || {};


// map initialization
Map.init = function () {

	// default location and zoom
	// var latitude = 35.746512259918504
	// var longitude = -96.9873046875
	// var zoom = 4

	// set map location and zoom
	// var map = L.map('Map').setView([latitude, longitude], zoom);

	////////////////////////////////////////////
	//osm map layer attribution
	// var attributionOSM = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> //contributors';
	////////////////////////////////////////////

	////////////////////////////////////////////
	//init osm map layer and add to map
	// var osm = Map.L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	//    attribution: attributionOSM,
	//    subdomains: ['a', 'b', 'c']
	// }).addTo(map)
	////////////////////////////////////////////

	// var osmMap = Maps.createOSM;

	// function getLocation() {

	// 	var options = {
	// 		timeout: 8000
	// 	};
	
	// 	navigator.geolcation.getCurrentPostion(function (location) {
	// 		alert(position.longitude, position.latitude)
			
	// 		var map = L.map('map', {
	// 		    center: [positon.latitude, position.longitude],
	// 			zoom: position.zoom,
	// 			layers: [osmMap]
	// 			//loadingControl: true
	// 			// maxZoom: 18,
	// 			// minZoom: 2
	// 		});
	// 	}, options)
	// }



};

