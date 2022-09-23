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

var Rade1816 = L.tileLayer('https://warper.wmflabs.org/maps/tile/4044/{z}/{x}/{y}.png', {
	attribution: 'Admiralty Chart No 65 Brest and the Ushant Islands RMG B8780, 1816',
});

var Brest1700 = L.tileLayer('https://warper.wmflabs.org/maps/tile/2905/{z}/{x}/{y}.png', {
	attribution: '© Bibliothèque Nationale de France',
});

var Brest1724 = L.tileLayer('https://warper.wmflabs.org/maps/tile/2909/{z}/{x}/{y}.png', {
	attribution: '© Bibliothèque Nationale de France',
});

var Brest1762 = L.tileLayer('https://warper.wmflabs.org/maps/tile/2907/{z}/{x}/{y}.png', {
	attribution: '© Bibliothèque Nationale de France',
});

var Recouvrance1682 = L.tileLayer('https://warper.wmflabs.org/maps/tile/2908/{z}/{x}/{y}.png', {
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
    group:'Cartes',
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
        active:false,
        name:"Recouvrance, 1682",
        layer:Recouvrance1682
    },
        {
            active:false,
            name:"Brest, 1700",
            layer:Brest1700
        },
        {
            active:false,
            name:"Brest, 1724",
            layer:Brest1724
        },
        {
            active:false,
            name:"Brest, 1762",
            layer:Brest1762
        },
    {
        active:false,
        name:"Rade de Brest, 1816",
        layer:Rade1816
    },
    {
        active:false,
        name:"Cassini",
        layer:wmsCassiniOverlay
    }]
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