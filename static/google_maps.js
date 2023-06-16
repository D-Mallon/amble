<<<<<<< Updated upstream

$.getScript( "https://maps.googleapis.com/maps/api/js?key=" + google_api_key + "&libraries=places") 
.done(function( script, textStatus ) {
    google.maps.event.addDomListener(window, "load", initMap)
})

function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsRenderer = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map-route'), {
        zoom: 10,
        center: {lat: lat_a, lng: long_a}
    });
    directionsRenderer.setMap(map);
    calculateAndDisplayRoute(directionsService, directionsRenderer);
}

const waypts = [
    {location:{lat: lat_wp1 , lng: long_wp1},
     stopover:true},
    {location:{lat: lat_wp2 , lng: long_wp2},
     stopover:true},
    {location:{lat: lat_wp3 , lng: long_wp3},
     stopover:true},
]

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    directionsService.route({
        origin: origin,
        destination: destination,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.DirectionsTravelMode.WALKING,
    }, function(response, status) {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);

      } else {
        alert('Directions request failed due to ' + status);
        window.location.assign("/route")
      }
    });
=======

$.getScript( "https://maps.googleapis.com/maps/api/js?key=" + google_api_key + "&libraries=places") 
.done(function( script, textStatus ) {
    google.maps.event.addDomListener(window, "load", initMap)
})

function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsRenderer = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map-route'), {
        zoom: 10,
        center: {lat: lat_a, lng: long_a}
    });
    directionsRenderer.setMap(map);
    calculateAndDisplayRoute(directionsService, directionsRenderer);
}

const waypts = [
    {location:{lat: lat_wp1 , lng: long_wp1},
     stopover:true},
    {location:{lat: lat_wp2 , lng: long_wp2},
     stopover:true},
    {location:{lat: lat_wp3 , lng: long_wp3},
     stopover:true},
]

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    directionsService.route({
        origin: origin,
        destination: destination,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.DirectionsTravelMode.WALKING,
    }, function(response, status) {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);

      } else {
        alert('Directions request failed due to ' + status);
        window.location.assign("/route")
      }
    });
>>>>>>> Stashed changes
}