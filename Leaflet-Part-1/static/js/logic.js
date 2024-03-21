//tile layer for background
let basemap = L.tileLayer(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


//creat map object with zoom/center options
let map = L.map("map", {
  center: [
    38, -110.5
  ],
  zoom: 5
});

//add tile layer to map object
basemap.addTo(map);

// d3 call for earthquake json info
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  //function for returning info for each earthquake (calls color and radius function)
  function style(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: color(feature.geometry.coordinates[2]),
      radius: radius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // determine color of earthquake based on depth
  function color(depth) {
    switch (true) {
      case depth > 75:
        return "#ea2c2c";
      case depth > 60:
        return "#ea822c";
      case depth > 45:
        return "#ee9c00";
      case depth > 30:
        return "#eecc00";
      case depth > 15:
        return "#d4ee00";
      default:
        return "#98ee00";
    }
  }

  //return radius of plot based on magnitude 
  function radius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  //add geoJSON map to layer
  L.geoJson(data, {
    //circlemarker
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // use style function
    style: style,
    // create pop up
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: "
        + feature.properties.mag
        + "<br>Depth: "
        + feature.geometry.coordinates[2]
        + "<br>Location: "
        + feature.properties.place
      );
    }
  }).addTo(map);

  // Here we create a legend control object.
  let legend = L.control({
    position: "bottomleft"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    // use same metrics as style/radius functions
    let grades = [-15, 15, 30, 45, 60, 75];
    let colors = [
      "#70fa7e",
      "#99d72c",
      "#b8b000",
      "#d08200",
      "#de4600",
      "#e10505"
    ];


    //create actual legend (recieved help from Scott for this)
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
        + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };
  
  // add legend to map
  legend.addTo(map);
});