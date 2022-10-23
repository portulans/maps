//Fond de carte
var bounds = [[0,0], [751,1000]];
var image = L.imageOverlay('img/numenor/numenor.png', bounds, {
    attribution : "Númenor, d'après les cartes J.R.R. Tolkien, Christopher Tolkien et Karen Wynn Fonstad"
});

//////////// Fonctions

function getColor(type) {
    return type == 'route' ? '#923C0E' :
                    'fleuve' ? '#1CBCEB':
                    '#B8DF50';
}

function getDash(type) {
    //Couleur des objets en fonction du type
    return type == 'route' ? '10,15':
        '0.0';
}

function styleLines(feature) {
    //Style des lignes en fonction des types d'objets
    return {
                color: getColor(feature.properties.type),
                weight: 5,
                dashArray: getDash(feature.properties.type),
                lineJoin: 'round'
            };
}

function styleAreas(feature){
	return {
  	fillColor: getColor(feature.properties.type),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.5
  }
};

function iconByName(name) {
    // Accède aux îcones
	return '<i class="icon icon-'+name+'"></i>';
}

function featureToMarker(feature, latlng) {
	return L.marker(latlng, {
		icon: L.divIcon({
			className: 'marker-'+feature.properties.type,
			//html: iconByName(feature.properties.type),
			iconUrl: 'markers/'+feature.properties.type+'.png',
			iconSize: [36, 36]
		})
	}).bindTooltip(feature.properties.nom)
}

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.nom) {
        
           texte = '<h3>'+feature.properties.nom+'</h3>' +
            '<p><b>Type : </b><i>'+ feature.properties.type+'</i><br>'
            if (feature.properties.langue) {
                texte = texte + '<b>Langue : </b><i>'+ feature.properties.langue+'</i><br>'}
            if (feature.properties.trad_fr) {
                texte = texte + '<b>Signification</b> : </b><i>'+ feature.properties.trad_fr+'</i></p>'}
            
            if (feature.properties.hasOwnProperty('tolkiendil') === true || feature.properties.hasOwnProperty('tolkiengat') === true || feature.properties.hasOwnProperty('fandom') === true ) {
                texte = texte + '<b>En savoir plus</b>'+
                '<ul>'
                if (feature.properties.tolkiendil) {
                    texte = texte + '<li><a href="' + feature.properties.tolkiendil + '" target="_blank">Tolkiendil</a></li>'}
                if (feature.properties.tolkiengat) {
                    texte = texte + '<li><a href="' + feature.properties.tolkiengat + '" target="_blank">(en) Tolkien Gatway</a></li>'}
                if (feature.properties.fandom) {
                    texte = texte + '<li><a href="' + feature.properties.fandom + '" target="_blank">Fandom FR</a></li>'}
                texte = texte + '</ul>'};
            layer.bindPopup(texte).bindTooltip(feature.properties.nom);
    }
};

function pointToLayer(feature,latlng) {
    return L.circleMarker(latlng, geojsonMarkerOptions).bindTooltip(feature.properties.nom);
}

///////////// POI
var url = "./data/numenor-convert/poi_out.geojson"

// Feature Groups
var capitale = L.geoJSON(null, {
    onEachFeature: onEachFeature, 
    pointToLayer: featureToMarker,
    filter:function (feature) {
        if (feature.properties.type === "capitale") return true
        }
    });
   
var ville = L.geoJSON(null, {
    onEachFeature: onEachFeature, 
    pointToLayer: featureToMarker,
    filter:function (feature) {
        if (feature.properties.type === "ville") return true
        }
    });

var construction = L.geoJSON(null, {
    onEachFeature: onEachFeature, 
    pointToLayer: featureToMarker,
    filter:function (feature) {
        if (feature.properties.type === "construction") return true
        }
    });

var montagne = L.geoJSON(null, {
    onEachFeature: onEachFeature, 
    pointToLayer: featureToMarker,
    filter:function (feature) {
        if (feature.properties.type === "montagne") return true
        }
    });

var vallee = L.geoJSON(null, {
    onEachFeature: onEachFeature, 
    pointToLayer: featureToMarker,
    filter:function (feature) {
        if (feature.properties.type === "vallée") return true
        }
    });

var ilecap = L.geoJSON(null, {
    onEachFeature: onEachFeature, 
    pointToLayer: featureToMarker,
    filter:function (feature) {
        if (feature.properties.type === "cap" | feature.properties.type === "île") return true
        }
    });
    

   // Get GeoJSON data et création
   $.getJSON(url, function(data) {
           montagne.addData(data);
           capitale.addData(data);
           ville.addData(data);
           construction.addData(data);
           vallee.addData(data);
           ilecap.addData(data);
   });


///////////// Hydro Lignes
var url2 = "./data/numenor-convert/hydrologie-lignes_out.geojson"

var fleuves = L.geoJSON(null, {
    onEachFeature: onEachFeature, 
    style:styleLines
    });
   
    $.getJSON(url2, function(data) {
        fleuves.addData(data);
});

///////////// Régions
var url3 = "./data/numenor-convert/regions_out.geojson"

var regions = L.geoJSON(null, {
    onEachFeature: onEachFeature, 
    style:styleAreas
    });
   
    $.getJSON(url3, function(data) {
        regions.addData(data);
});

///////////// Hydrographie
var url4 = "./data/numenor-convert/hydrologie-polygones_out.geojson"

var lacbaies = L.geoJSON(null, {
    onEachFeature: onEachFeature, 
    });
   
    $.getJSON(url4, function(data) {
        lacbaies.addData(data);
});

///////////// Hydrographie
var url5 = "./data/numenor-convert/fond_out.geojson"

var mer = L.geoJSON(null, {
    onEachFeature: onEachFeature,
    filter:function (feature) {
        if (feature.properties.type === "mer") return true
        }
    });
   
    $.getJSON(url5, function(data) {
        mer.addData(data);
});

var numenor = L.geoJSON(null, {
    onEachFeature: onEachFeature,
    filter:function (feature) {
        if (feature.properties.type === "royaume") return true
        }
    });
   
    $.getJSON(url5, function(data) {
        numenor.addData(data);
});

///////////// Routes
var url6 = "./data/numenor-convert/routes_out.geojson"

var routes = L.geoJSON(null, {
    onEachFeature: onEachFeature,
    style:styleLines
    });
   
    $.getJSON(url6, function(data) {
        routes.addData(data);
});
/////////////////////////////////////////////////

var map = L.map('map', {
    crs: L.CRS.Simple,
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    },
    layers: [image]
});
map.fitBounds(bounds);

//Control panel out of map div
//https://gis.stackexchange.com/questions/186131/placing-controls-outside-map-container-with-leaflet
$(document).ready(function () {

    var newParent = document.getElementById('controls');
        var oldParent = document.getElementsByClassName("leaflet-panel-layers expanded leaflet-control leaflet-control-layers-expanded")
    
        while (oldParent[0].childNodes.length > 0) {
            newParent.appendChild(oldParent[0].childNodes[0]);
        }
     });

//Search layer
var searchLayer = L.layerGroup([ville,capitale,regions,construction,vallee,fleuves,numenor,ilecap]);
//... adding data in searchLayer ...
map.addControl( new L.Control.Search({
    layer: searchLayer,
    propertyName: 'nom',
    initial:false,
    textPlaceholder:"Chercher un lieu..."
}) );

map.removeLayer(regions)
map.removeLayer(fleuves)
map.removeLayer(construction)
map.removeLayer(vallee)
map.removeLayer(numenor)
map.removeLayer(ilecap)
//////////////////////////////////////////////////////////

var baseLayers = [{
    group:'Cartes',
    collapsed: true,
    layers: [
        {
            active: true,
            name: "Numénor | Portulans",
            layer: image
        }
    ]
}
];
var overLayers = [
    {
        active: false,
        name: "Numénor",
        icon: iconByName('royaume'),
        layer: numenor
    },
    {
        active: false,
        name: "Régions",
        icon: iconByName('region'),
        layer: regions
    },
	{
		group: "Villes et constructions",
		layers: [
			{
                active: true,
                name: "Capitale",
                icon: iconByName('capitale'),
                layer: capitale
            },
			{
                active: true,
                name: "Villes",
                icon: iconByName('ville'),
                layer: ville
            },
            {
                active: true,
                name: "Bâtiments",
                icon: iconByName('construction'),
                layer: construction
            },
            ,
            {
                active: false,
                name: "Route principale",
                icon: iconByName('route'),
                layer: routes
            },
		]
	},
    {
		group: "Autres lieux",
		layers: [
			{
				active: false,
				name: "Vallée",
                icon: iconByName('vallée'),
				layer: vallee
			}
		]
	},
	{
		group: "Hydrographie et reliefs",
		layers: [
			{
				active: false,
				name: "Montagnes",
                icon: iconByName('montagne'),
				layer: montagne
			},
            {
				active: false,
				name: "Fleuves",
                icon: iconByName('fleuve'),
				layer: fleuves
			},
            {
                active:false,
                name:"Lacs et baies",
                icon: iconByName('lacbaie'),
                layer:lacbaies
            },
            {
                active:false,
                name:"Îles et caps",
                icon:iconByName('ilecap'),
                layer:ilecap
            }
            ,
            {
                active:false,
                name:"Océan",
                icon:iconByName('mer'),
                layer:mer
            }
		]
	}
];

map.addControl( new L.Control.PanelLayers(baseLayers, overLayers,
    {title:'<h3 id="panel">Numénor</h3>'}));

///////////////////////////////////////////////////

//... adding data in searchLayer ...

map.on('click', function(event) {
    console.log(event.latlng);
});