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

var cassini = L.tileLayer(
    "https://data.geopf.fr/wmts?" +
    "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
    "&STYLE=normal" +
    "&TILEMATRIXSET=PM_6_14" +
    "&FORMAT=image/jpeg"+
    "&LAYER=BNF-IGNF_GEOGRAPHICALGRIDSYSTEMS.CASSINI"+
    "&TILEMATRIX={z}" +
    "&TILEROW={y}" +
    "&TILECOL={x}",
{
    minZoom : 6,
    maxZoom : 14,
    attribution : "IGN/BNF",
    tileSize : 256 // les tuiles du Géooportail font 256x256px
});


var etatmajor = L.tileLayer(
    "https://data.geopf.fr/wmts?" +
    "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
    "&STYLE=normal" +
    "&TILEMATRIXSET=PM" +
    "&FORMAT=image/jpeg"+
    "&LAYER=GEOGRAPHICALGRIDSYSTEMS.ETATMAJOR40"+
"&TILEMATRIX={z}" +
    "&TILEROW={y}" +
    "&TILECOL={x}",
{
    minZoom : 0,
    maxZoom : 18,
            attribution : "IGN-F/Geoportail",
    tileSize : 256 // les tuiles du Géooportail font 256x256px
});

var ign1950 = L.tileLayer(
        "https://data.geopf.fr/wmts?" +
        "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
        "&STYLE=normal" +
        "&TILEMATRIXSET=PM" +
        "&FORMAT=image/jpeg"+
        "&LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN50.1950"+
        "&TILEMATRIX={z}" +
        "&TILEROW={y}" +
        "&TILECOL={x}",
        {
            minZoom : 0,
            maxZoom : 18,
            attribution : "IGN-F/Geoportail",
            tileSize : 256 // les tuiles du Géooportail font 256x256px
        });

var ign2023 = L.tileLayer(
    "https://data.geopf.fr/wmts?" +
    "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
    "&STYLE=normal" +
    "&TILEMATRIXSET=PM_0_19" +
    "&FORMAT=image/png"+
    "&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2"+
    "&TILEMATRIX={z}" +
    "&TILEROW={y}" +
    "&TILECOL={x}",
    {
        minZoom : 0,
        maxZoom : 19,
        attribution : "IGN",
        tileSize : 256 // les tuiles du Géooportail font 256x256px
    });

var ignaerial1950 = L.tileLayer(
    "https://data.geopf.fr/wmts?" +
    "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
    "&STYLE=normal" +
    "&TILEMATRIXSET=PM_0_18" +
    "&FORMAT=image/png"+
    "&LAYER=ORTHOIMAGERY.ORTHOPHOTOS.1950-1965"+
    "&TILEMATRIX={z}" +
    "&TILEROW={y}" +
    "&TILECOL={x}",
    {
        minZoom : 0,
        maxZoom : 18,
        attribution : "IGN",
        tileSize : 256 // les tuiles du Géooportail font 256x256px
    });

var ignaerial2023 = L.tileLayer(
    "https://data.geopf.fr/wmts?" +
    "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
    "&STYLE=normal" +
    "&TILEMATRIXSET=PM" +
    "&FORMAT=image/jpeg"+
    "&LAYER=ORTHOIMAGERY.ORTHOPHOTOS.BDORTHO"+
    "&TILEMATRIX={z}" +
    "&TILEROW={y}" +
    "&TILECOL={x}",
    {
        minZoom : 0,
        attribution : "IGN",
        tileSize : 256 // les tuiles du Géooportail font 256x256px
    });

/********
 * BASE Layers
 */

function sectionStyle(feature,color) {
    return {
    weight: 2,
    opacity: 1,
    color: 'green',
    dashArray: 2,
    fillOpacity: 0
};
}

function feuilleStyle(feature,color) {
    return {
    weight: 2,
    opacity: 0.5,
    color: 'grey',
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

var assemblage = L.tileLayer('https://www.laurentgontier.com/OuessantLayers/PlanAssemblageCadastre/{z}/{x}/{y}.png', {
  minZoom: 9,
  maxZoom: 20,
  tms: false,
  attribution: '&copy; L. Gontier - @AD29'
});

var sections;
var url = "data/sections_v2.geojson";	

	sections = L.geoJson(null, {
        style:sectionStyle('green'),
        onEachFeature:onEachFeature
    }); 
    	
     $.getJSON(url, function(data) {
	   sections.addData(data);
    });

var feuilles;
var url = "data-old/feuilles_nap_ouessant.geojson";	

    feuilles = L.geoJson(null, {
        style:feuilleStyle
    }); 
        
        $.getJSON(url, function(data) {
        feuilles.addData(data);
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
            name: "Photographie aérienne IGN (2024)",
            layer:ignaerial2023
        },
        {
            active: false,
            name: "Plan IGN (2024)",
            layer: ign2023
        },
        {
            active: false,
            name: "Open Street Map (2024)",
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
                name: "Sections",
                layer: sections
            },
            {
                active: false,
                name: "Feuilles",
                layer: feuilles
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