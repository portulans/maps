/////////// Tiles

var OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'jpg'
});

/////////// Map
var map = L.map('asterixmap',{
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    },
    maxZoom:9,
    layers:[Stamen_Watercolor]
}).setView([44.703020, 2.381834], 4);

L.control.scale().addTo(map);

var DARE_map = L.tileLayer('https://dh.gu.se/tiles/imperium/{z}/{x}/{y}.png', {
	//minZoom:4,
    maxZoom: 11,
	attribution: '© Johan Åhlfeldt, Centre for Digital Humanities, University of Gothenburg 2019 | <a href="https://dh.gu.se/dare/" target="_blank">DARE Project</a> | CC BY 4.0'
}).addTo(map);

//////////// Style des points

function getColor(type) {
    return type == 'ville' ? '#0F87F1' :
            type == 'région' ? '#FFC300':
            type == 'forêt' ? '#08C70E':
            type == 'hydrographie' ? '#6CD3D1':
            type == 'autre' ? '#A16CD3':
                '#A16CD3';
}

//////////// Function

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.name) {
        texte = '<h4>'+feature.properties.name+'</h4>' +
            '<p><b>Apparitions : </b><i>'+ feature.properties.album + '</i><br/>'
        if (feature.properties.description){
            texte += feature.properties.description + '<br/>'
        }
        texte += '</p><p>'
        if (feature.properties.city) {
            texte += '<b>Nom actuel : </b>' + feature.properties.city+'</br>'
        }
        if (feature.properties.county) {
            texte += '<b>Département : </b>' + feature.properties.county+'</br>'
        }
        if (feature.properties.state) {
            texte += '<b>Région : </b>' + feature.properties.state+'</br>'
        }
        if (feature.properties.country) {
            texte += '<b>Pays : </b>' + feature.properties.country+'</p>';
        }
        texte += '</p>';
        layer.bindPopup(texte).bindTooltip(feature.properties.name);
    }
};

function pointToLayer(feature,latlng) {
    return L.circleMarker(latlng, {
        radius:6,
        fillColor: getColor(feature.properties.type),
        color: "#ffffff",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
    }
    );
}

function zoomOn(zone) {
    if (zone == "Village") {
        var lat = 48.523881;
        var lng = -3.254151;
        var zoom_level = 7
    } else if (zone == "Gaule") {
        var lat = 47.454837
        var lng = 2.307129
        var zoom_level = 6
    }
    map.setView([lat,lng], zoom_level, {animate: true});
}

////////////////////

//Emplacement fictif du village
var loupeIcon = L.icon({
    iconUrl: 'img/loupe.png',
    iconSize:     [45, 45], // size of the icon
});

L.marker([48.8, -3.2], {icon: loupeIcon}).bindTooltip("Village des Irréductibles gaulois", {
        direction: 'right'
        }).addTo(map);


// Villes visités
var url = "data/villes.geojson";	
var villes;

//Initial Setup  with layer Verified No
	villes = L.geoJson(null, {
        pointToLayer: pointToLayer,  
		onEachFeature: onEachFeature,
    }); 
    	
     $.getJSON(url, function(data) {
	   villes.addData(data);
    });

/*Layers*/

//Using a Layer Group to add/ remove data from the map.
//var myData =  L.layerGroup([]);
var myData = L.featureGroup([villes])
	//myData.addLayer(villes);
	myData.addTo(map); 
var number='00';
    
    document.getElementById("tous").addEventListener('click', function(event) {
        theExpression = 'feature.properties.num_album != "10000"' ;	
        console.log(theExpression);
            map.removeLayer(myData);
            myData.clearLayers();
            
            villes = L.geoJson(null, {
                pointToLayer: pointToLayer,
                onEachFeature: onEachFeature
            });
            
            $.getJSON(url, function(data) {
                   villes.addData(data);
                   myData = L.featureGroup([villes])
                   myData.addTo(map)
                   console.log(myData.getBounds())
                   map.fitBounds(myData.getBounds());
            });
        }
    );

    
    function filterData(number) {
        theExpression = 'feature.properties.num_album.indexOf("' + number + '") !== -1;' ;	
        console.log(theExpression);
            map.removeLayer(myData);
            myData.clearLayers();
            
            villes = L.geoJson(null, {
                pointToLayer: pointToLayer,
                onEachFeature: onEachFeature,
                filter: function(feature, layer) {   
                    return (feature.properties.num_album.indexOf(number) !== -1);
                },
            });
            
            $.getJSON(url, function(data) {
                villes.addData(data);
                myData = L.featureGroup([villes])
                myData.addTo(map)
                console.log(myData.getBounds())
                map.fitBounds(myData.getBounds());
         });
        }
    
    //Event listeners Albums
    document.getElementById("01").addEventListener("click", function () {filterData("01")});
    document.getElementById("02").addEventListener("click", function () {filterData("02")});
    document.getElementById("03").addEventListener("click", function () {filterData("03")});
    document.getElementById("04").addEventListener("click", function () {filterData("04")});
    document.getElementById("05").addEventListener("click", function () {filterData("05")});
    document.getElementById("06").addEventListener("click", function () {filterData("06")});
    document.getElementById("07").addEventListener("click", function () {filterData("07")});
    document.getElementById("08").addEventListener("click", function () {filterData("08")});
    document.getElementById("09").addEventListener("click", function () {filterData("09")});
    document.getElementById("10").addEventListener("click", function () {filterData("10")});
    document.getElementById("11").addEventListener("click", function () {filterData("11")});
    document.getElementById("12").addEventListener("click", function () {filterData("12")});
    document.getElementById("13").addEventListener("click", function () {filterData("13")});
    document.getElementById("14").addEventListener("click", function () {filterData("14")});
    document.getElementById("15").addEventListener("click", function () {filterData("15")});
    document.getElementById("16").addEventListener("click", function () {filterData("16")});
    document.getElementById("17").addEventListener("click", function () {filterData("17")});
    document.getElementById("18").addEventListener("click", function () {filterData("18")});
    document.getElementById("19").addEventListener("click", function () {filterData("19")});
    document.getElementById("20").addEventListener("click", function () {filterData("20")});
    document.getElementById("21").addEventListener("click", function () {filterData("21")});
    document.getElementById("22").addEventListener("click", function () {filterData("22")});
    document.getElementById("23").addEventListener("click", function () {filterData("23")});
    document.getElementById("24").addEventListener("click", function () {filterData("24")});
    document.getElementById("25").addEventListener("click", function () {filterData("25")});
    document.getElementById("26").addEventListener("click", function () {filterData("26")});
    document.getElementById("27").addEventListener("click", function () {filterData("27")});
    document.getElementById("28").addEventListener("click", function () {filterData("28")});
    document.getElementById("29").addEventListener("click", function () {filterData("29")});
    document.getElementById("30").addEventListener("click", function () {filterData("30")});
    document.getElementById("31").addEventListener("click", function () {filterData("31")});
    document.getElementById("32").addEventListener("click", function () {filterData("32")});
    document.getElementById("33").addEventListener("click", function () {filterData("33")});
    document.getElementById("34").addEventListener("click", function () {filterData("34")});
    document.getElementById("35").addEventListener("click", function () {filterData("35")});
    document.getElementById("36").addEventListener("click", function () {filterData("36")});
    document.getElementById("37").addEventListener("click", function () {filterData("37")});
    document.getElementById("38").addEventListener("click", function () {filterData("38")});
    document.getElementById("39").addEventListener("click", function () {filterData("39")});
     
var searchLayer = L.layerGroup([villes]);
//... adding data in searchLayer ...
map.addControl( new L.Control.Search({
    layer: searchLayer,
    propertyName: 'name',
    initial:false,
    textPlaceholder:"Chercher un lieu..."
}) );
