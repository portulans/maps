//Gestion du fond de carte

var map = L.map('map', {
    center: [48.461676, -5.087357],
    zoom: 13,
    layers: [OpenStreetMap_BZH]//Default
});
/*
function getColor(layer) {
	if (layer.name == "Et ta soeur") {
		return '#88E51D'
	}
}
*/
function popUp(feature,layer) {
	var message = '<h1>'+ feature.properties.name+'</h1><p>' + feature.properties.description + '</p><img class="img_info" src="' + feature.properties.image1 + '">' + '</p><img class="img_info" src="' + feature.properties.image2 + '">' + '</p><img class="img_info" src="' + feature.properties.image3 + '">' + '</p><img class="img_info" src="' + feature.properties.image4 + '">' + '<img class="img_info" src="' + feature.properties.image5 + '"></p>';
	layer.bindPopup(message, {
		maxWidth: "auto",
	});	
}

var et_ta_soeur_layer = L.geoJSON(et_ta_soeur, {
	onEachFeature:popUp
});
var amour_dune_femme_layer = L.geoJSON(amour_dune_femme, {
	onEachFeature:popUp
});
var equipier_layer = L.geoJSON(equipier, {
	onEachFeature:popUp
}).addTo(map);//Default;
var ile_aux_30_cercueils_layer = L.geoJSON(ile_aux_30_cercueils, {
	onEachFeature:popUp
});
var ile_aux_femmes_layer = L.geoJSON(ile_aux_femmes, {
	onEachFeature:popUp
});

var baseMaps = {
    "OSM France": OpenStreetMap_France,
	"OSM BZH": OpenStreetMap_BZH,
	"OSM Stamen": Stamen_Watercolor,
	"Plan IGN":GeoportailFrance_plan,
	"Images aeriennes IGN":GeoportailFrance_orthos
};

var overlayMaps = {
	"L'île aux 30 cercueils (2021)":ile_aux_30_cercueils_layer,
	"L'île aux femmes (2016)":ile_aux_femmes_layer,
    "Et ta soeur (2016)": et_ta_soeur_layer,
	"L'équipier (2003)":equipier_layer,
	//"Voleur de vie",
	//"Les Îles",
	"L'amour d'une femme (1953)":amour_dune_femme_layer//,
	//"La Femme du bout du monde (1938)"
	//"Finis Terrae (1929)"
};

L.control.layers(baseMaps, overlayMaps, {
	collapsed:false,
	//sortLayers:false
	}).addTo(map);

//L.control.scale().addTo(map);

/*Aide Goserver : https://www.sigterritoires.fr/index.php/debuter-avec-geoserver/*/

/*Version 1 : https://medium.com/@teksondada/wfs-request-in-geoserver-using-leafletjs-79a072660cac

//Geoserver Web Feature Service
$.ajax('http://localhost:8080/geoserver/wfs',{
  type: 'GET',
  data: {
    service: 'WFS',
    version: '1.1.0',
    request: 'GetFeature',
    typename: 'Ouessant_en_films:l_ile_aux_femmes',
    srsname: 'EPSG:4326',
    outputFormat: 'text/javascript',
    },
  dataType: 'jsonp',
  jsonpCallback:'callback:handleJson',
  jsonp:'format_options'
 });

// the ajax callback function
function handleJson(data) {
    var selectedArea = L.geoJson(data).addTo(map);
  map.fitBounds(selectedArea.getBounds());
}

*/
/*
//Racine de l'url
var rootUrl = 'http://localhost:8080/geoserver/wfs';

//Paramètres du flux
var defaultParameters = {
    service: 'WFS',
    version: '1.0.0',
    request: 'GetFeature',
    typeName: 'Ouessant_en_films:l_ile_aux_femmes',
    outputFormat: 'application/json',
    srsName:'EPSG:4326'
};


var parameters = L.Util.extend(defaultParameters);
var URL = rootUrl + L.Util.getParamString(parameters);

var WFSLayer = null;
var ajax = $.ajax({
    url : URL,
    dataType : 'json',
    jsonpCallback : 'getJson',
    success : function (response) {
        WFSLayer = L.geoJson(response, {
            style: function (feature) {
                return {
                    stroke: false,
                    fillColor: 'FFFFFF',
                    fillOpacity: 1
                };
            }, onEachFeature: function (feature, layer) {
				layer.bindPopup('<h2>' + feature.properties.name + '</h2><p>' + feature.properties.description + '</p>');
			}
        }).addTo(map);

    }
});

*/