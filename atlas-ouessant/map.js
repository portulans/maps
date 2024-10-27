/**
 * MAP
 */
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

var etatmajor = L.tileLayer.wms('https://data.geopf.fr/wmts?', {
    layers: 'GEOGRAPHICALGRIDSYSTEMS.ETATMAJOR40',
    attribution:'&copy; IGN',
    version: '1.3.0',
    crs: L.CRS.EPSG3857
});

var ign1950 = L.tileLayer.wms('https://data.geopf.fr/wmts?', {
    layers: 'GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN50.1950',
    attribution:'&copy; IGN',
    version: '1.3.0',
    crs: L.CRS.EPSG3857
});

var ign2023 = L.tileLayer.wms('https://data.geopf.fr/wmts?', {
    layers: 'GEOGRAPHICALGRIDSYSTEMS.MAPS.BDUNI.J1',
    attribution:'&copy; IGN',
    version: '1.3.0',
    crs: L.CRS.EPSG3857
});

var ignaerial1950 = L.tileLayer.wms('https://data.geopf.fr/wmts?', {
    layers: 'ORTHOIMAGERY.ORTHOPHOTOS.1950-1965',
    attribution:'&copy; IGN',
    version: '1.3.0',
    crs: L.CRS.EPSG3857
});

var ignaerial2023 = L.tileLayer.wms('https://data.geopf.fr/wmts?', {
    layers: 'ORTHOIMAGERY.ORTHOPHOTOS.BDORTHO',
    attribution:'&copy; IGN',
    version: '1.3.0',
    crs: L.CRS.EPSG3857
});

/**
 * OVERLAYERS
 */
var laisne = L.tileLayer('https://warper.wmflabs.org/maps/tile/5368/{z}/{x}/{y}.png',{
    attribution:"&copy; BNF"
})

var bellin = L.tileLayer('https://maps.georeferencer.com/georeferences/1ec89b00-77d4-5394-a8f0-2b416a3a1c01/2020-08-05T21:35:35.823272Z/map/{z}/{x}/{y}.png?key=GLnkxmp4XuB03JLUbbxv',{
    attribution:'&copy; David Rumsey'
});

var cassini = L.tileLayer('https://maps.georeferencer.com/georeferences/3d83b7ca-25fa-5427-bb16-4fd49d9993e2/2020-10-28T21:25:04.823902Z/map/{z}/{x}/{y}.png?key=GLnkxmp4XuB03JLUbbxv',{
    attribution:'&copy; David Rumsey'
});

var beautempsbeauprès = L.tileLayer('https://www.laurentgontier.com/OuessantSHOM1816/{z}/{x}/{y}.png', {
  tms: false,
  attribution: '&copy; L. Gontier - @ Shom'
});

var pilotefrancais = L.tileLayer('https://allmaps.xyz/maps/6acb1e0c67682a55/{z}/{x}/{y}.png', {
  tms: false,
  attribution: '&copy; Gallica BNF'
});


var assemblage = L.tileLayer('https://www.laurentgontier.com/OuessantLayers/PlanAssemblageCadastre/{z}/{x}/{y}.png', {
  minZoom: 9,
  maxZoom: 20,
  tms: false,
  attribution: '&copy; L. Gontier - @AD29'
});

var sections = L.tileLayer('https://www.laurentgontier.com/CadasOuessant/{z}/{x}/{y}.png', {
  minZoom: 9,
  maxZoom: 20,
  tms: false,
  attribution: '&copy; L. Gontier - @AD29'
});

var parcellaireExpress = L.tileLayer.wms('https://data.geopf.fr/wmts?', {
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
 * VECTEURS
 */

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties) {
        texte = '<p>'
        if (feature.properties.name) {
            texte += '<b>Nom : </b>' + feature.properties.name+'</br>'
        }
        if (feature.properties.lieudit) {
            texte += '<b>Lieu-dit : </b>' + feature.properties.lieu_dit+'</br>'
        }
        if (feature.properties.date_const) {
            texte += '<b>Date de construction : </b>' + feature.properties.date_const +'</br>'
        }
        if (feature.properties.date_arret) {
            texte += "<b>Date de fin d'activité : </b>" + feature.properties.date_arret +'</br>'
        }
        if (feature.properties.source) {
            texte += '<b>Sources : </b>' + feature.properties.source+'</p>';
        }
        texte += '</p>';

        if (feature.properties.name) {
            layer.bindPopup(texte).bindTooltip(feature.properties.name);
        } else {
            layer.bindPopup(texte).bindTooltip(feature.properties.lieu_dit);
        }
    }
};

function onEachFeatureCroix(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties) {
        if (feature.properties.nom) {
            texte = '<p><b>Nom : </b>' + feature.properties.nom+'</p>'
            layer.bindPopup(texte).bindTooltip(feature.properties.name);
        }
    }
};

function getColor(type) {
    return type == 'grand' ? '#0F87F1' :
            "#D433FF";
}

var croixIcon = L.icon({
    iconUrl: './data/croix.png',
    iconSize:[8, 8], // size of the icon
});

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

function pointToLayer2(feature,latlng) {
    return croixIcon;
}

var url = "data/moulins.geojson";	
var moulins;

//Initial Setup  with layer Verified No
	moulins = L.geoJson(null, {
        pointToLayer: pointToLayer,  
		onEachFeature: onEachFeature,
    }); 
    	
     $.getJSON(url, function(data) {
	   moulins.addData(data);
    });

var url = "data/calvaires.geojson";	
var calvaires;

//Initial Setup  with layer Verified No
    calvaires = L.geoJson(null, {
        pointToLayer: pointToLayer2,  
        onEachFeature: onEachFeatureCroix,
    }); 
        
        $.getJSON(url, function(data) {
        calvaires.addData(data);
    });

/**
 * CONTROLS
 */
var baseLayers = [
	{
        group: "France entière",
        layers: [
        {
            active: true,
            name: "Etat-Major (1866)",
            layer: etatmajor
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
        group: "XVIIIème siècle",
        layers: [
            {
                active: false,
                name: "Carte marine - J.N. Bellin (1764)",
                layer: bellin
            },
            {
                active: false,
                name: "Carte de Cassini - Feuille N°174 (1786)",
                layer: cassini
            }
        ]
    },
    {
        group:"XIXème siècle",
        layers:[
            {
                active:false,
                name:"Minute hydrographique (1816)",
                layer:beautempsbeauprès
            },
            {
                active:false,
                name:"Pilote français (1822)",
                layer:pilotefrancais
            },
            {
                active: false,
                name: "Tableau d'assemblage (1842)",
                layer: assemblage
            },
            {
                active: false,
                name: "Plan parcellaire (1842)",
                layer: sections
            },
            {
                active: false,
                name: "Scan historique IGN (1950)",
                layer: ign1950
            },
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
    },
    {
        group:"Patrimoine",
        layers:[
            {
                active:false,
                name:"Moulins",
                layer:moulins
            },
            {
                active:false,
                name:"Calvaires",
                layer:calvaires
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