// Fonds de carte
const apikey = '9e3cddba6d8644059b222a0067151a95'
var Thunderforest_Pioneer = L.tileLayer('https://{s}.tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey={apikey}', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	apikey: apikey,
	maxZoom: 22
});

var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'jpg'
});

var Esri_WorldPhysical = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
	maxZoom: 8
});

var Esri_NatGeoWorldMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	maxZoom: 16
});

//Fonctions

function getColor(transport) {
    return transport == 'train' ? '#C70039' :
            transport == 'paquebot' ? '#1471BE':
            transport == 'goélette' ? '#1471BE':
            transport == 'éléphant' ? '#6BA553':
            transport == 'Traîneau à voiles' ? '#84DBED':
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
        if (feature.properties.city) {
            texte = texte + '<b>Ville</b> : ' + feature.properties.city + '<br>'
        }
        if (feature.properties.state) {
            texte = texte + '<b>Région</b> : ' + feature.properties.state + '<br>'
        }
        texte = texte + '<b>Pays</b> : ' + feature.properties.country + '<br>'

        if (feature.properties.city != 'Londres'){
            if (feature.properties.date_arrivee){
                texte = texte + '<b>Arrivée</b> : ' + feature.properties.date_arrivee
                if (feature.properties.heure_arrivee){
                        texte = texte + ' (' + feature.properties.heure_arrivee + ') <br>'
                } else {
                    texte = texte + '<br>'
                }
            }
            if (feature.properties.date_depart){
                texte = texte + '<b>Départ</b> : ' + feature.properties.date_depart
                if (feature.properties.heure_depart){
                        texte = texte + ' (' + feature.properties.heure_depart + ') <br>'
                } else {
                    texte = texte + '<br>'
                }
            }
            
        } else {
            if (feature.properties.date_depart){
                texte = texte + '<b>Départ</b> : ' + feature.properties.date_depart
                if (feature.properties.heure_depart){
                        texte = texte + ' (' + feature.properties.heure_depart + ') <br>'
                } else {
                    texte = texte + '<br>'
                }
            }
            if (feature.properties.date_arrivee){
                texte = texte + '<b>Arrivée</b> : ' + feature.properties.date_arrivee
                if (feature.properties.heure_arrivee){
                        texte = texte + ' (' + feature.properties.heure_arrivee + ') <br>'
                } else {
                    texte = texte + '<br>'
                }
        }
    }
        layer.bindPopup(texte).bindTooltip(feature.properties.name);
    }
};

//Layers
var url1 = "data//etapes.geojson"
var etapes = L.geoJSON(null,{
    onEachFeature: onEachPointFeature,
    pointToLayer:pointToLayer
});

   // Get GeoJSON data et création
   $.getJSON(url1, function(data) {
           etapes.addData(data);
   });

var url2 = "data//troncons.geojson"
var troncons = L.geoJSON(null,{
    onEachFeature: onEachLineFeature,
    style:styleLines
});

    // Get GeoJSON data et création
    $.getJSON(url2, function(data) {
            troncons.addData(data);
    });

var map = L.map('map',{
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    },
    layers:[Thunderforest_Pioneer]
}).setView([30.107390, 130.059717 ],2);

L.control.scale().addTo(map);

//////////////////////////////////////////////////////////

var baseLayers = [{
    group:'Cartes',
    collapsed: false,
    layers: [
        {
            active: true,
            name: "Thunderforest Pioneer",
            layer: Thunderforest_Pioneer
        },
        {
            active: false,
            name: "Stamen Watercolor",
            layer: Stamen_Watercolor
        },
        {
            active: false,
            name: "Esri NatGeoWorldMap",
            layer: Esri_NatGeoWorldMap
        },
        {
            active: false,
            name: "Esri WorldPhysical",
            layer: Esri_WorldPhysical
        },
    ]
}
];
var overLayers = [
    {
        active: false,
        name: "Etapes",
        layer: etapes
    },
    {
        active: true,
        name: "Trajet",
        layer: troncons
    }
];

map.addControl( new L.Control.PanelLayers(baseLayers, overLayers
    /*,
    {title:'<h3 id="panel">Le Tour du Monde<br> en 80 jours</h3>'+
    '<p>Jules Verne</p>'+
    '<p><i>Les dates correspondent<br>aux notes de Philéas Fogg<br> dans le roman</i></p>'}*/
    ));

///////////////////////////////////////////////////