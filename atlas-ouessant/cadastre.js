var map = L.map('map',{
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    },
}).setView([48.46, -5.08], 13);

/**
 * BASELAYERS
 */
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var etatmajor = L.tileLayer.wms('https://wxs.ign.fr/cartes/geoportail/r/wms?', {
    layers: 'GEOGRAPHICALGRIDSYSTEMS.ETATMAJOR40',
    attribution:'&copy; IGN',
    version: '1.3.0',
    crs: L.CRS.EPSG3857
});

var ign1950 = L.tileLayer.wms('https://wxs.ign.fr/cartes/geoportail/r/wms?', {
    layers: 'GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN50.1950',
    attribution:'&copy; IGN',
    version: '1.3.0',
    crs: L.CRS.EPSG3857
});

var ign2023 = L.tileLayer.wms('https://wxs.ign.fr/cartes/geoportail/r/wms?', {
    layers: 'GEOGRAPHICALGRIDSYSTEMS.MAPS.BDUNI.J1',
    attribution:'&copy; IGN',
    version: '1.3.0',
    crs: L.CRS.EPSG3857
});

var ignaerial1950 = L.tileLayer.wms('https://wxs.ign.fr/orthohisto/geoportail/r/wms?', {
    layers: 'ORTHOIMAGERY.ORTHOPHOTOS.1950-1965',
    attribution:'&copy; IGN',
    version: '1.3.0',
    crs: L.CRS.EPSG3857
});

var ignaerial2023 = L.tileLayer.wms('https://wxs.ign.fr/ortho/geoportail/r/wms?', {
    layers: 'ORTHOIMAGERY.ORTHOPHOTOS.BDORTHO',
    attribution:'&copy; IGN',
    version: '1.3.0',
    crs: L.CRS.EPSG3857
});

/********
 * BASE Layers
 */

var assemblage = L.tileLayer('https://www.laurentgontier.com/OuessantLayers/PlanAssemblageCadastre/{z}/{x}/{y}.png', {
  minZoom: 9,
  maxZoom: 20,
  tms: false,
  attribution: '&copy; L. Gontier - @AD29'
});

var sections;
var url = "data/sections_v2.geojson";	

function sectionStyle(feature) {
    return {
    weight: 2,
    opacity: 0.7,
    color: 'green',
    dashArray: 2,
    fillOpacity: 0
};
}

function onEachFeature(feature,layer){
   var tooltip = feature.properties.section
   layer.bindTooltip(tooltip,{
        permanent: true,
        direction: "center",
        className:"leaflet-tooltip-custom"
   })
}

//Initial Setup  with layer Verified No
	sections = L.geoJson(null, {
        style:sectionStyle,
        onEachFeature:onEachFeature
    }); 
    	
     $.getJSON(url, function(data) {
	   sections.addData(data);
    });

var planparcellaire = L.tileLayer('https://www.laurentgontier.com/CadasOuessant/{z}/{x}/{y}.png', {
  minZoom: 9,
  maxZoom: 20,
  tms: false,
  attribution: '&copy; L. Gontier - @AD29'
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
var baseLayers = [
	{
        group: "Fond de carte",
        layers: [
        {
            active: true,
            name: "Etat-Major (1866)",
            layer: etatmajor
        },
        {
            active: false,
            name: "Scan historique IGN (1950)",
            layer: ign1950
        },
        {
            active:false,
            name: "Photographie aérienne IGN (1950)",
            layer:ignaerial1950
        },
        {
            active:false,
            name: "Photographie aérienne IGN (2023)",
            layer:ignaerial2023
        },
        {
            active: false,
            name: "Plan IGN (2023)",
            layer: ign2023
        },
        {
            active: false,
            name: "Open Street Map (2023)",
            layer: osm
        }
        ]
    }
];

var overLayers = [
    {
        group:"Cadastre ancien (1842)",
        layers:[
            {
                active: false,
                name: "Tableau d'assemblage",
                layer: assemblage
            },
            {
                active: true,
                name: "Sections (approximatives)",
                layer: sections
            },
            {
                active: true,
                name: "Plan parcellaire",
                layer: planparcellaire
            }
        ]
    },
    {
    group: "Cadastre moderne",
    layers: [
        {
            active: false,
            name: "Parcellaire (IGN)",
            layer: parcellaireExpress
        },
        {
            active: false,
            name: "Parcellaire (DGFiP)",
            layer:parcellaireDGFIP
        }
    ]
    }
]

/**
 * ADD TO MAP
 */
map.addControl(
    new L.Control.PanelLayers(baseLayers,overLayers)
    );