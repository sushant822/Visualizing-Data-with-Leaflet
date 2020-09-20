// Store our API endpoint inside queryUrl
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryURL, function(response) {
  var coordinates = response.features;
  //console.log(coordinates);
  for (var i = 0; i < coordinates.length; i++) {
    var lat = coordinates[i].geometry.coordinates[1];
    var lng = coordinates[i].geometry.coordinates[0];
    var temp = [lat, lng];
    var mag = coordinates[i].properties.mag;
    var place = coordinates[i].properties.place;
    var circle = L.circle(temp, {
      color: "red",
      fillColor: magColor(mag),
      stroke: false,
      fillOpacity: 0.75,
      radius: 50000*mag
  }).addTo(myMap);
  circle.bindPopup("<h1>" + place + "</h1> <hr> <h3>Magnitude " + mag + "</h3>");
  }

});

function magColor(mag) {
  return mag >= 5 ? '#D73027':
        mag >= 4 ? '#FC8D59':
        mag >= 3 ? '#FEE08B':
        mag >= 2 ? '#D9EF8B':
        mag >= 1 ? '#91CF60':
                   '#1A9850';
}

//var myMap = L.map("map").setView([29.2996437,1.832259],2);
var myMap = L.map("map", {
  center: [
      29.2996437,1.832259
  ],
  zoom: 2,
  //layers: [streetmap, earthquakes]
});


L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }).addTo(myMap);