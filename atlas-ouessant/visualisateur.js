var map = L.map('mapviz',{
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    },
}).setView([48.46, -5.08], 13);

/******** VECTOR LAYERS **********/

var url_moulins = 'data/moulins.geojson';
var url_lavoirs = 'data/lavoirs_fontaines.geojson';

function moulinsStyle(feature) {
    // Create a custom icon
    var icon = ''
    if (feature.properties.type === 'grand'){
        icon = 'img/grand-moulin.svg'
        iconSize = [20, 20]
    } else {
        icon = 'img/petit-moulin.svg'
        iconSize = [12, 12]
    }
    const customIcon = L.icon({
        iconUrl: icon,
        iconSize: iconSize, // size of the icon
    });

    // Return the style object
    return {
        icon: customIcon // Use the custom icon in the style object
    };
}

function onEachFeatureMoulins(feature,layer){
    if (feature.properties.nom == null){
        var tooltip = feature.properties.type + ' moulin'
    } else {
        var tooltip = feature.properties.nom
    }
    var popupContent = "<h4>"+tooltip+"</h4>";
    popupContent += "<ul><li>Type : "+feature.properties.type+"</li>";
    if (feature.properties.date_const){
        popupContent += "<li>Date de construction : " + feature.properties.date_const +"</li>";
    }
    if (feature.properties.date_arret){
        popupContent += "<li>Date de mise à l'arrêt : " + feature.properties.date_arret +"</li>";
    }
    if (feature.properties.date_dem){
        popupContent += "<li>Date de démolition : " + feature.properties.date_dem +"</li>";
    }
    if (feature.properties.existe == 0) {
        popupContent += "<li>Existant : Non</li>";
    } else if (feature.properties.existe == 1){
        popupContent += "<li>Existant: Oui";
        if (feature.properties.renove == 1){
            popupContent += " (rénové)</li>";
        } else {
            popupContent += " (en ruines)</li>";
        }
    } else {
        popupContent += "<li>Existant : Vérification terrain nécessaire</li>";
    }
    popupContent += "</ul>";
    layer.bindPopup(popupContent, {
        minWidth: 200,
        maxWidth: 300,
        className: 'popup-moulins'
    });
    layer.bindTooltip(tooltip,{
         permanent: false,
         direction: "center",
    })
 }

var moulins = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, moulinsStyle(feature));
    },
    onEachFeature:onEachFeatureMoulins,
    filter: function (feature, layer) {
        return feature.properties.cad1842 == 1 || feature.properties.ign1910 == 1;
    }
}); 
    
 $.getJSON(url_moulins, function(data) {
    moulins.addData(data);
});

function createCircleMarker(feature, latlng) {
    let markerOptions = {
        radius: 8, // Default radius
        fillOpacity: 0.8,
        color: 'black',
        fillColor: 'blue', // Default fill color
        weight: 1,
    };

    // Check the type of the feature and set options accordingly
    if (feature.properties.type === 'fontaine') {
        markerOptions.fillColor = '#325780'; // Color for fontaines
        markerOptions.radius = 5; // Radius for fontaines
    } else if (feature.properties.type === 'lavoir') {
        markerOptions.fillColor = '#62abf9'; // Color for lavoirs
        markerOptions.radius = 5; // Radius for lavoirs
    } else if (feature.properties.type === 'lavoir_fontaine') {
        markerOptions.fillColor = '#62abf9'; // Color for lavoirs
        markerOptions.radius = 4; // Radius for lavoirs
        markerOptions.color = '#325780'; // Color for lavoirs and fontaines
        markerOptions.weight = 3; // Weight for lavoirs and fontaines
    } else {
        markerOptions.radius = 5; // Default radius for other types
    }

    // Create and return the circle marker
    return L.circleMarker(latlng, markerOptions);
}

function onEachFeatureLavoirs(feature,layer){
    if (feature.properties.nom == null){
        var tooltip = feature.properties.type
    } else {
        var tooltip = feature.properties.nom
    }
    layer.bindTooltip(tooltip,{
         permanent: false,
         direction: "center",
    })
 }

var lavoirs_fontaines = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        return createCircleMarker(feature, latlng);
    },
    onEachFeature:onEachFeatureLavoirs,
    filter: function (feature, layer) {
        return feature.properties.modif_geom != null;
    }
}); 
    
 $.getJSON(url_lavoirs, function(data) {
    lavoirs_fontaines.addData(data);
});


////////////////////////////////
var lieux_dits;
var lastClickedElement;
function highlightFeature(e) {
    if(lastClickedElement){
        lieux_dits.resetStyle(lastClickedElement)
    }

    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: 'blue',
        fillColor: 'blue',
        fillOpacity: 0.7
    });
    lastClickedElement= layer;
}


var url_lieux_dits = './data/lieux_dits.geojson';
lieux_dits = L.geoJson(null, {
    style: {
        color: 'grey',
        weight: 0.2,
        fillOpacity: 0.1,
        fillColor: '#fff',
    },
    onEachFeature:function(feature,layer){
        var tooltip = feature.properties["lieu-dit"]
        layer.bindTooltip(tooltip,{
             permanent: false,
             direction: "center",
        })

        layer.on({
            click: highlightFeature
        });

        var popupcontent = "<h4>"+feature.properties["lieu-dit"]+"</h4>";
        if (feature.properties["commentaire"]){
            popupcontent += "<p>Commentaire : "+feature.properties["commentaire"]+"</p>";
        }
        layer.bindPopup(popupcontent)
    }
});
    
 $.getJSON(url_lieux_dits, function(data) {
    lieux_dits.addData(data);
});

map.on('click', function(e) {
    // If a polygon was previously highlighted, reset its style
    if (lastClickedElement) {
        lieux_dits.resetStyle(lastClickedElement);
        lastClickedElement = null;
    }
});

/**
 * CONTROLS
 */

const layers = [
    {
        name: 'Cartes actuelles',
        collapsed: false,
        layers: [
            { name: "Plan IGN", layer: ign2023, active: true},
            { name: "OpenStreetMap", layer: osm, active: false},
            { name: "OpenSeaMap", layer: seamarks, active: false},
        ],
    },
    {
        name: 'Images aériennes',
        collapsed: true,
        layers: [
            { name: "1952", layer: ignaerial1950, active: false},
            { name: "1975", layer: ignaerial1965, active: false},
            { name: "2000", layer: ignaerial2000, active: false},
            { name: "2005", layer: ignaerial2005, active: false},
            { name: "2009", layer: ignaerial2009, active: false},
            { name: "2015", layer: ignaerial2015, active: false},
            { name: "2018", layer: ignaerial2018, active: false},
            { name: "2021", layer: ignaerial2023, active: false},
        ],
    },
    {
        name: 'Cartes anciennes',
        collapsed: true,
        layers: [
            { name: "Dépôt de la Marine (v. 1780)", layer: depotmarine1780, active: false, opacityControl: true},
            { name:"Carte de Cassini (1786)", layer: cassini, active: false, opacityControl: true},
            { name: "Minute hydrographique (1816)", layer:minuteouessantshom, active: false, opacityControl: true},
            { name: "Pilote français (1822)", layer: pilotefrancais, active: false, opacityControl: true},
            { name: "Etat-Major (1866)", layer: etatmajor, active: false, opacityControl: true},
            { name: "Carte touristique (1929)", layer: cartetouristique1929, active: false, opacityControl: true},
            { name: "Scan historique IGN (1950)", layer: ign1950, active: false, opacityControl: true},
        ],
    },
    {
        name: 'Cadastre ancien (1842)',
        collapsed: true,
        layers: [
            { name: "Tableau d'assemblage (Atlas)", layer: assemblage, active: false, opacityControl: true},
            { name: "Tableau d'assemblage (Minute)", layer: assemblageAD29, active: false, opacityControl: true},
            { name: "Plan parcellaire", layer: planparcellaire, active: false, opacityControl: true},
        ],
    },
    {
        name:"Toponymie <i>(en cours)</i>",
        collapsed: true,
        layers: [
            { name: "Lieux-dits (Cadastre 1842)", layer: lieux_dits, active: false, opacityControl: false},
        ],
    },
    {
        name: 'Patrimoine culturel <i>(en cours)</i>',
        collapsed: true,
        layers: [
            { name: "Lavoirs et fontaines", layer: lavoirs_fontaines, active: false, opacityControl: false},
            { name: "Moulins", layer: moulins, active: false, opacityControl: false}
        ],
    }

];

L.control.advancedLayers(layers, {
    collapsible: true}).addTo(map);

L.control.scale().addTo(map);

L.control.locate({
    setViw:true,
    strings: {
    title: "Me situer sur la carte !"
  }}).addTo(map);
