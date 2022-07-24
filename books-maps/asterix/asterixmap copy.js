var map = L.map('asterixmap').setView([44.703020, 11.707032], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//////////// Style des points
var geojsonMarkerOptions = {
    radius:4,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

//////////// Function

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.name) {
        layer.bindPopup(
            '<h2>'+feature.properties.name+'</h2>' +
            '<p><b>Apparitions : </b><i>'+ feature.properties.album +
            '</i></p>'+'<p class="center">-------------</p>'+
            '<p><b>Nom actuel : </b>' + feature.properties.city+'</br>'+
            '<b>Département : </b>' + feature.properties.county+'</br>'+
            '<b>Région : </b>' + feature.properties.state+'</br>'+
            '<b>Pays : </b>' + feature.properties.country+'</p>');
    }
};

function pointToLayer(feature,latlng) {
    return L.circleMarker(latlng, geojsonMarkerOptions);
}

/*Layers*/

fetch("data/villes.geojson")
  .then(function (response) { return response.json() })
  .then(function (data) {
      
      var t01 = L.geoJson(data, {
          filter: function(feature) { return feature.properties.num_album === "01"},
          /* etc */
      });
      var t02 = L.geoJson(data, {
          filter: function(feature) { return feature.properties.num_album === "02"},
          /* etc */
      });
      var t03 = L.geoJson(data, {
          filter: function(feature) { return feature.properties.num_album === "03"},
          /* etc */
      });
});
