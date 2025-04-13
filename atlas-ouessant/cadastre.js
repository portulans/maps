var map = L.map('map',{
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    },
}).setView([48.46, -5.08], 13);

/********
 * BASE Layers
 */

function miresStyle(feature, color) {
    // Create a custom icon
    const customIcon = L.icon({
        iconUrl: 'img/flag.png',
        iconSize: [20, 20], // size of the icon
    });

    // Return the style object
    return {
        icon: customIcon // Use the custom icon in the style object
    };
}

function sectionStyle(feature,color) {
    return {
    weight: 2,
    opacity: 1,
    color: 'red',
    dashArray: 2,
    fillOpacity: 0
};
}

function getFeuilleColor(geometre) {
    switch (geometre) {
        case 'Auguste Jobbé-Duval': return '#e8e34f'; // Yellow
        case 'Peynet-Fontenelle': return '#82d992'; // Green
        case 'Ridel': return '#e55574'; // Pink
        case 'Touzés': return '#a365cf'; // Yellow
    }
    return '#FFFFFF'; // Default color (white) if no match
}

function feuilleStyle(feature) {
    return {
    weight: 2,
    opacity: 0.5,
    color: 'green',
    fillColor: getFeuilleColor(feature.properties.Géomètre),
    fillOpacity: 0.25,
    dashArray: 2,
};
}

function onEachFeatureFeuille(feature,layer){
    var popupContent = "<h4>Feuille "+feature.properties.code_feuil+"</h4>";
    popupContent += "<ul><li>Section : "+feature.properties.section+"</li>";
    popupContent += "<li>Géomètre : "+feature.properties.Géomètre+"</li>";
    popupContent += "<li>Premier numéro : "+feature.properties.Premier+"</li>";
    popupContent += "<li>Dernier numéro : "+feature.properties.Dernier+"</li></ul>";

    var tooltip = feature.properties.code_feuil

    layer.bindTooltip(tooltip,{
        permanent: false,
        direction: "center",
        className:"leaflet-tooltip-custom"
    })
    layer.bindPopup(popupContent, {
        maxWidth: 400,
        minWidth: 200,
        maxHeight: 400,
        minHeight: 200,
        className: "leaflet-popup-custom"
    });
}
    

function onEachFeature(feature,layer){
   var tooltip = feature.properties.section
   layer.bindTooltip(tooltip,{
        permanent: true,
        direction: "center",
        className:"leaflet-tooltip-custom"
   })
}

var sections;
var url = "data/sections_1842.geojson";	

	sections = L.geoJson(null, {
        style:sectionStyle('green'),
        onEachFeature:onEachFeature
    }); 
    	
     $.getJSON(url, function(data) {
	   sections.addData(data);
    });

var feuilles;
var url = "data/feuilles_1842.geojson";	

    feuilles = L.geoJson(null, {
        style:feuilleStyle,
        onEachFeature:onEachFeatureFeuille
    }); 
        
        $.getJSON(url, function(data) {
        feuilles.addData(data);
    });

var mires;
var url = "data/mires_1842.geojson";	

    mires = L.geoJson(null, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, miresStyle(feature));
        }
    }); 
        
        $.getJSON(url, function(data) {
        mires.addData(data);
    });

var parcellaireExpress = L.tileLayer.wms('https://wxs.ign.fr/parcellaire/geoportail/r/wms?', {
    layers: 'CADASTRALPARCELS.PARCELLAIRE_EXPRESS',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    crs: L.CRS.EPSG3857,
    attribution:'&copy; IGN'
});

var parcellaireDGFIP = L.tileLayer.wms('https://kartenn.region-bretagne.fr/ws/cadastre/france.wms?', {
    layers: 'AMORCES_CAD,LIEUDIT,CP.CadastralParcel,SUBFISCAL,CLOTURE,DETAIL_TOPO,HYDRO,VOIE_COMMUNICATION,BU.Building,BORNE_REPERE',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    crs: L.CRS.EPSG3857,
    attribution:'&copy; DGFiP'
});

/**
 * CONTROLS
 */
/**
 * CONTROLS
 */

const layers = [
    {
        name: 'Cartes actuelles',
        collapsed: true,
        layers: [
            { name: "Plan IGN", layer: ign2023, active: true},
            { name: "OpenStreetMap", layer: osm, active: false},
        ],
    },
    {
        name: 'Cartes anciennes',
        collapsed: true,
        layers: [
            { name: "Minute hydrographique (1816)", layer:minuteouessantshom, active: false, opacityControl: true},
            { name: "Etat-Major (1866)", layer: etatmajor, active: true, opacityControl: true},
        ],
    },
    {
        name: 'Cadastre ancien (1842)',
        collapsed: false,
        layers: [
            { name: "Tableau d'assemblage (Atlas)", layer: assemblage, active: false, opacityControl: true},
            { name: "Tableau d'assemblage (Minute)", layer: assemblageAD29, active: false, opacityControl: true},
            { name: "Plan parcellaire", layer: planparcellaire, active: true, opacityControl: true},
            { name: "Sections", layer: sections, active: false, opacityControl: false},
            { name: "Feuilles", layer: feuilles, active: false, opacityControl: false},
            { name: "Repères de triangulation", layer: mires, active: false, opacityControl: false}
        ],
    }
];

L.control.advancedLayers(layers, {
    collapsible: true}).addTo(map);