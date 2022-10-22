/* Fonds de carte */
var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'jpg'
});

const apikey = '9e3cddba6d8644059b222a0067151a95'
var Thunderforest_Pioneer = L.tileLayer('https://{s}.tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey={apikey}', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	apikey: apikey,
	maxZoom: 22
});

/* Overlays */
//Carte de Cassini
var wmsCassiniOverlay = L.WMS.overlay('https://ws.sogefi-web.com/wms?', {
    'layers': 'Carte_Cassini',
    'srs': 'EPSG:4326',
    'format': 'image/png',
    'transparent': true,
});

var RadeBrest1724 = L.tileLayer('https://warper.wmflabs.org/maps/tile/5362/{z}/{x}/{y}.png', {
	attribution: '© Bibliothèque Nationale de France',
});

var Brest1724 = L.tileLayer('https://warper.wmflabs.org/maps/tile/2909/{z}/{x}/{y}.png', {
	attribution: '© Bibliothèque Nationale de France',
});

var LaRochelle = L.tileLayer('https://warper.wmflabs.org/maps/tile/2909/{z}/{x}/{y}.png', {
	attribution: '© Bibliothèque Nationale de France',
});

/* Fonctions */

function getColor(personnage) {
    return personnage == 'Yann' ? '#C70039' :
            personnage == 'Agnès' ? '#1471BE':
            personnage == 'Marquis de la Motte' ? '#1471BE':
                    '#D60FCA';
}

var geojsonMarkerOptions = {
    radius:5,
    fillColor: "#0FB7D9",
    color: "#ffffff",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};

function pointToLayer(feature,latlng) {
    return L.circleMarker(latlng, geojsonMarkerOptions);
}

function styleLines(feature) {
    //Style des lignes en fonction des types d'objets
    return {
                color: getColor(feature.properties.transport),
                weight: 3,
                lineJoin: 'round'
            };
}

function onEachLineFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.name) {
        texte = '<h4>'+feature.properties.name+'</h4>'+
        '<p><b>Départ</b> : ' + feature.properties.depart + '<br>' + 
        '<b>Arrivée</b> : ' + feature.properties.arrivee + '<br>'+ 
        '<b>Moyen de transport</b> : ' + feature.properties.transport

        if (feature.properties.details_transports | feature.properties.compagnie){
            if (feature.properties.transport === 'paquebot') { 
                texte = texte + ' (<i>' + feature.properties.details_transports + '</i>)<br>'};

            if (feature.properties.compagnie){
                texte = texte + '<b>Armement : </b>' + feature.properties.compagnie + '<br>'};
        } else {
            texte = texte + '<br>'}

        if (feature.properties.distance){
            texte = texte + '<b>Distance parcourue</b> : ' + feature.properties.distance
        }
        texte = texte + '</p>'
        if (feature.properties.description){
            texte = texte + '<p>' + feature.properties.description + '<br></p>';
        }
        
        layer.bindPopup(texte);
    }
};

function onEachPointFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.name) {
        texte = '<h4>'+feature.properties.name+'</h4><p>'
        if (feature.properties.description) {
            texte = texte + feature.properties.description + '</p>'
        }
    }
    layer.bindPopup(texte).bindTooltip(feature.properties.name);
};

/* Layers */
var url2 = "data//trajets.geojson"
var trajets = L.geoJSON(null,{
    onEachFeature: onEachLineFeature,
    style:styleLines
});

    // Get GeoJSON data et création
    $.getJSON(url2, function(data) {
            trajets.addData(data);
    });

var url1 = "data//lieux.geojson"
var lieux = L.geoJSON(null,{
    onEachFeature: onEachPointFeature,
    pointToLayer:pointToLayer
});

    // Get GeoJSON data et création
    $.getJSON(url1, function(data) {
            lieux.addData(data);
    });
//////////////////////////////////////////////////////////

/* Map */

var map = L.map('map',{
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    },
    layers:[Thunderforest_Pioneer]
}).setView([30, -5],3);

/* Controls */

L.control.scale().addTo(map);

var baseLayers = [{
    group:'Cartes modernes',
    collapsed: false,
    layers: [
        {
            active: true,
            name: "Thunderforest Pioneer",
            layer: Thunderforest_Pioneer
        }
        ,
        {
            active: false,
            name: "Stamen Watercolor",
            layer: Stamen_Watercolor
        }
    ]
}
];
var overLayers = [
    {group:'Cartes anciennes',
    collapsed: true,
    layers: [
    {
        active:true,
        name:"Rade de Brest, 1724",
        layer:RadeBrest1724
    },
    {
        active:false,
        name:"Brest, 1723",
        layer:Brest1724
    }
    ]
    },
    {
        active: true,
        name: "Lieux",
        layer: lieux
    },
    {
        active: true,
        name: "Trajets",
        layer: trajets
    }
];

map.addControl( new L.Control.PanelLayers(baseLayers, overLayers,
    {title:"<h3 id='panel'>L'Epervier</h3>"+
    '<p>Patrice Pellerin</p>'}));

///////////////////////////////////////////////////

function zoomOn(zone) {
    if (zone == "Atlantique") {
        var lat = 30;
        var lng = -5;
        var zoom_level = 3
    } else if (zone == 'Brest') {
        var lat = 48.387517
        var lng = -4.497356
        var zoom_level = 14
    } else if (zone == "Rade") {
        var lat = 48.350226
        var lng = -4.491898
        var zoom_level = 11
    } else if (zone == "Finistere") {
        var lat = 48.350226
        var lng = -4.491898
        var zoom_level = 9
    } else if (zone == "Canaries") {
        var lat = 28.261328
        var lng = -16.171875
        var zoom_level = 9
    } else if (zone == "Guyane") {
        var lat = 4.741711
        var lng = -52.211498
        var zoom_level = 9
    } else if (zone == "Cayenne") {
        var lat = 4.920350
        var lng = -52.305203 
        var zoom_level = 13
    } else if (zone == "Saint-Laurent") {
        var lat = 46.510492
        var lng = -69.323730
        var zoom_level = 6
    }
    map.setView([lat,lng], zoom_level, {animate: true});
}

document.getElementById("Brest").addEventListener("click", e => zoomOn("Brest"));
document.getElementById("Rade").addEventListener("click", e => zoomOn("Rade"));
document.getElementById("Finistere").addEventListener("click", e => zoomOn("Finistere"));
document.getElementById("Atlantique").addEventListener("click", e => zoomOn("Atlantique"));
document.getElementById("Canaries").addEventListener("click", e => zoomOn("Canaries"));
document.getElementById("Cayenne").addEventListener("click", e => zoomOn("Cayenne"));
document.getElementById("Guyane").addEventListener("click", e => zoomOn("Guyane"));
document.getElementById("Saint-Laurent").addEventListener("click", e => zoomOn("Saint-Laurent"));