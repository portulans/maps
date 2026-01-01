var map = L.map('map',{
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    },
    minZoom:12,
    maxZoom:16
}).setView([48.859633,2.344208], 12);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var Stadia_StamenWatercolor = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}', {
	minZoom: 12,
	maxZoom: 18,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'jpg'
});

var imageUrl = './data/paper.jpg';
var altText = '<a href="https://www.flickr.com/photos/94857613@N00/167285658">Flickr</a>';
var latLngBounds = L.latLngBounds([[48.7900556895464277,2.1850332481542578], [48.9056920108368729,2.4816404122642477]]);

var imageOverlay = L.imageOverlay(imageUrl, latLngBounds, {
    opacity: 1,
    alt: altText,
    interactive: true
}).addTo(map);

map.setMaxBounds(latLngBounds.pad(0.01));
map.options.maxBoundsViscosity = 1.0;

/************ Functions *************/

function colorStatiopee(statiope) {
    if (statiope == 'Montparnasse / Elévation') {
        return '#a980b8';
    }  else if (statiope == 'Versailles') {
        return '#ea4b50';
    }   else if (statiope == '4 P') {
        return '#8cbe53';
    }   else if (statiope == 'Ivry') {
        return '#eab0c9';
    }  else if (statiope == 'Villejuif') {
        return '#a5703a';
    }  else if (statiope == 'Italie / Petite Chine') {
        return '#f1853c';
    }   else if (statiope == 'Odéon') {
        return '#e6b11eff';
    }   else if (statiope == 'Bac') {
        return '#51b3a6';
    }  else if (statiope == 'Maubourg') {
        return '#7074a5';
    } else if (statiope == 'Baloubouffe') {
        return '#7fccea';
    } else {
        return '#ffffff';
    }
}

function circleRadius(taille) {
    if (taille == 5) {
        return 10;
    } else if (taille == 3) {
        return 6;
    } else if (taille == 4) {
        return 8;
    } else {
        return 3;
    }
}

function onEachFeaturePOI(feature, layer) {
    if (feature.properties) {
        var texte = '<p style="text-align:center;font-weight:bold;">';
        if (feature.properties["nom-metro"]) {
            texte += feature.properties["nom-metro"];
        } else {
            texte += feature.properties.label || '';
        }
        texte += '</p>';
    }
    if (layer && typeof layer.bindPopup === 'function') {
        layer.bindPopup(texte);
    }
    //tooltip
    /*layer.bindTooltip(feature.properties["nom-metro"] || feature.properties.label || '', {
        permanent: false,
        direction: 'top',
        className: 'my-labels'
    });*/
};


/************ Data ***********/

map.createPane("water");
map.getPane("water").style.zIndex = "596";

map.createPane("lines");
map.getPane("lines").style.zIndex = "598";

map.createPane("poi");
map.getPane("poi").style.zIndex = "600";

var url = "./data/poi.geojson";	
var poi;
    poi = L.geoJson(null, {
        pane:"poi",
        onEachFeature:onEachFeaturePOI,
        pointToLayer: function (feature, latlng) {
                if (feature.properties.zone == "rive-gauche") {
                        return L.circleMarker(latlng, {
                            pane: 'poi',
                            radius: circleRadius(feature.properties["taille-statiopee"]),                     
                            color:'#000000',
                            fillColor: colorStatiopee(feature.properties.statiope),
                            fillOpacity: 1,
                            weight: 0.5
                        });
                } else if (feature.properties.zone == "rive-droite") {
                        var size = circleRadius(feature.properties["taille-statiopee"]) * 2;
                        var squareDiv = L.divIcon({
                            className: 'square-marker',
                            html: '<div style="width: ' + size + 'px; height: ' + size + 'px; background-color: #fff; border: 0.5px solid; border-color: #000;"></div>',
                            iconSize: [size, size],
                            iconAnchor: [Math.round(size/2), Math.round(size/2)]
                        });
                        return L.marker(latlng, { icon: squareDiv, pane: 'poi' });
                } else if (feature.properties.zone == "cité" || feature.properties.zone == "inconnu") {
                    // I would like to draw a div Icon with a ?
                        var size = circleRadius(feature.properties["taille-statiopee"]);
                        var questionDiv = L.divIcon({
                            className: 'question-marker',
                            html: '<div style="width: '+size +'; height: '+size +'; background-color: #ffffff; border: 0.5px solid #000000; text-align: center; line-height: 10px; font-weight: bold;">?</div>',
                            iconSize: [10, 10],
                            iconAnchor: [10, 10]
                        });
                        return L.marker(latlng, { icon: questionDiv, pane: 'poi' });
                } 
        },
        filter : function(feature, layer) {
            return feature.properties.zone != null;
        }
    }) ; 
    	
     $.getJSON(url, function(data) {
        poi.addData(data);
    });

var url = "./data/lines.geojson";	
var lines;
//Initial Setup  with layer Verified No
    lines = L.geoJson(null, {
        pane:"lines",
        style: function(feature) {
            if (feature.properties["route-des-animaux"] === true) {
                // I want to return a double line style (like having to parallel lines, one red, one black)
                return {
                    dashColor: '#000000',
                    dashWeight: 2,
                    dashOffset: 30,
                    dashArray: [10, 10],
                    color: '#ff0000',
                    opacity: 1,
                    weight: 2
                };
            } else if (feature.properties.type == "passage") {
                return {
                    dashColor: '#000000',
                    dashWeight: 2,
                    dashOffset: 30,
                    dashArray: [10, 10],
                    color: '#000000',
                    opacity: 1,
                    weight: 2
                };
            } else {
                return {
                    color: '#000000',
                    opacity: 1,
                    weight: 2
                };
            }
        }
    }); 
    	
     $.getJSON(url, function(data) {
        lines.addData(data);
    });

var url = "./data/water.geojson";	
var water;
//Initial Setup  with layer Verified No
    water = L.geoJson(null, {
        pane:"water",
        style: {
            color: '#4a86e8',
            opacity: 0.65,
            fillColor: '#4a86e8',   
            fillOpacity: 0.65,
            weight:0.5
        }
    });
     $.getJSON(url, function(data) {
        water.addData(data);
    });

L.control.scale().addTo(map);
//map.attributionControl.addAttribution('Map of Panem (Hunger Games world, created by Suzanne Collins) produced using Lionsgate map from The Hunger Games Exhibition (Las Vegas)');


// Légende
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    div.style.background = 'white';
    div.style.padding = '8px';
    div.style.boxShadow = '0 0 12px rgba(0,0,0,0.15)';
    div.style.borderRadius = '4px';
    div.style.fontSize = '13px';
    //div.innerHTML += '<strong>Légende</strong>';

    // Markers section
    //div.innerHTML += '<div style="margin-top:8px"><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:#fff; border:2px solid #000;margin-right:8px;vertical-align:middle;"></span> Rive gauche</div>';
    //div.innerHTML += '<div style="margin-top:6px"><span style="display:inline-block;width:14px;height:14px;background:#fff;border:2px solid #000;margin-right:8px;vertical-align:middle;display:inline-block;"></span> Rive droite</div>';

    div.innerHTML += '<div style="font-weight:600;margin-bottom:6px">Statiopées</div>';

    var aff = [
        'Montparnasse / Elévation',
        'Versailles',
        '4 P',
        'Ivry',
        'Villejuif',
        'Italie / Petite Chine',
        'Odéon',
        'Bac',
        'Maubourg',
        'Baloubouffe'
    ];

    aff.forEach(function(a){
        var c = colorStatiopee(a) || '#ffffff';
        div.innerHTML += '<div style="margin-bottom:5px"><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:' + c + ';margin-right:8px;vertical-align:middle;"></span>' + a + '</div>';
    });

    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);
    div.innerHTML += '<div style="margin-top:8px"><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:#fff; border:1px solid #000;margin-right:8px;vertical-align:middle;"></span>Statiopée indépendante</div>';
    
    div.innerHTML += '<hr style="margin:8px 0;border:none;border-top:1px solid #ddd">';

    // Lines section
    div.innerHTML += '<div style="font-weight:600;margin-bottom:6px">Voies</div>';
    div.innerHTML += '<div><span style="display:inline-block;width:30px;height:4px;border-top:4px solid #000000;margin-right:8px;vertical-align:middle;"></span> Galerie impruntable</div>';
    div.innerHTML += '<div><span style="display:inline-block;width:30px;height:4px;border-top:4px dashed #ff0000;margin-right:8px;vertical-align:middle;"></span> Route des animaux</div>';
    div.innerHTML += '<div><span style="display:inline-block;width:30px;height:4px;border-top:4px dashed #000000;margin-right:8px;vertical-align:middle;"></span> Autre passage</div>';
    return div;
};
legend.addTo(map);

 /**
 * CONTROLS
 */

const layers = [
            { name: "Statiopées et autres lieux", layer: poi, active: true},
            { name:"Voies de communications", layer: lines, active: true},
            { name: "Hydrographie", layer: water, active: true},
            { name: "Carte", layer: imageOverlay, active: true, opacityControl: true },
            {
            name: 'Paris avant 2033',
            collapsed: true,
            layers: [
                //{ name: "Plan IGN", layer: ign2023, active: false},
                { name: "OpenStreetMap", layer: osm, active: false},
                { name: "Stamen Watercolor", layer: Stadia_StamenWatercolor, active: false},
            ],
        },
];

L.control.advancedLayers(layers, {
    position: 'topleft',
    collapsible: true,
    collapsed: true,
}).addTo(map);