
// Store our API endpoint inside queryUrl
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var platesURL = "static/data/boundaries.json";

var circleMarkers = new L.LayerGroup();

d3.json(queryURL, function(response) {
  var coordinates = response.features;
  //console.log(coordinates);
  for (var i = 0; i < coordinates.length; i++) {
    var lat = coordinates[i].geometry.coordinates[1];
    var lng = coordinates[i].geometry.coordinates[0];
    var latlng = [lat, lng];
    var mag = coordinates[i].properties.mag;
    var place = coordinates[i].properties.place;
    var circle = L.circle(latlng, {
      fillColor: magColor(mag),
      stroke: false,
      fillOpacity: 0.5,
      radius: 50000*mag
  }).addTo(circleMarkers);
  circle.bindPopup("<h1>" + place + "</h1> <hr> Magnitude " + mag + "");
  }
});

var faultLine = new L.LayerGroup();

d3.json(platesURL, function(response) {
  L.geoJSON(response, {
    style: function() {
      return {color: "#FFA500", fillOpacity: 0}
    }
  }).addTo(faultLine)
})

function magColor(mag) {
  return mag >= 5 ? '#FF0000':
        mag >= 4 ? '#FFA500':
        mag >= 3 ? '#FFFF00':
        mag >= 2 ? '#ADFF2F':
        mag >= 1 ? '#00FF00':
                   '#008000';
}

  // Define streetmap and darkmap layers
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-streets-v11",
    accessToken: API_KEY
  });

  var streetsmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "streets-v11",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap,
    "Satellite Map": satellitemap,
    "Streets Map": streetsmap
  };

// Overlays that may be toggled on or off
var overlayMaps = {
  "Earthquakes": circleMarkers,
  "Plates" : faultLine
};

var myMap = L.map("map", {
  center: [29.2996437,1.832259],
  zoom: 2,
  layers: [lightmap, circleMarkers, faultLine]
});

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: true
}).addTo(myMap);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + magColor(grades[i]) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);