// logic.js

// API endpoint URL of earthquake data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(url).then(function (data) {
    
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});

// Marker size
function markerSize(magnitude) {
    return magnitude * 5;
}

// Function for marker color based on the depth of the earthquake
function chooseColor(depth) {
    if (depth < 10) return "lawngreen";
    else if (depth < 30) return "yellow";
    else if (depth < 50) return "gold";
    else if (depth < 70) return "orange";
    else if (depth < 90) return "darkorange";
    else if (depth >= 90) return "red";
}

// Function to create earthquake map from data
function createFeatures(earthquakeData) {
    // Create popup for each earthquake event
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}
        </p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }

    // Point to layer used to alter markers
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            // Determine the style of markers based on properties
            var markers = {
                radius: markerSize(feature.properties.mag),
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                fillOpacity: 1,
                color: "black",
                stroke: true,
                weight: 0.5
            };
            return L.circleMarker(latlng, markers);
        },
        onEachFeature: onEachFeature
    });

    // Send our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {
  // Create the base layers
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Define a map object
  let myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [street, earthquakes]  // Include the earthquakes layer
  });

  // Add legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend"),
        depth = [-10, 10, 30, 50, 70, 90],
        colors = ["lawngreen", "yellow", "gold", "orange", "darkorange", "red"];

    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>";

    for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
            '<div><i style="background:' + colors[i] + '"></i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] : '+') + '</div>';
    }

    // Set height and width for the colored boxes in the legend
    var legendColors = div.querySelectorAll("i");
    legendColors.forEach(function (color) {
        color.style.width = "20px";
        color.style.height = "20px";
        color.style.display = "inline-block";
        color.style.marginRight = "5px"; 
    });

    return div;
};

  legend.addTo(myMap);


}




  