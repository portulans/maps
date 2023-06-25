/********** Functions *************/

function getColor(districtid) {
    return districtid == '1' ? '#434547' :
    districtid == '2' ? '#4f3328':
    districtid == '3' ? '#303a39':
    districtid == '4' ? '#4a5258':
    districtid == '5' ? '#615d41':
    districtid == '6' ? '#3d3c41' :
    districtid == '7' ? '#434547':
    districtid == '8' ? '#434547':
    districtid == '9' ? '#4d3b2b':
    districtid == '10' ? '#40231f':
    districtid == '11' ? '#3e3831' :
    districtid == '12' ? '#423e3b':
    districtid == '13' ? '#4f4f4f':
    districtid == 'C' ? '#4f4f4f':
    districtid == 'I' ? '#black':
                '#000000';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.num),
        color: getColor(feature.properties.num),
        fillOpacity: 1
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 4,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();
    limits.bringToFront();
}

function resetHighlight(e) {
    districts.resetStyle(e.target);
}

function printTributs(trib) {
    texte = '';
    if (trib == null) {
        texte = '<i>Inconnu</i>' 
    } else {
        texte = trib
    }
    return texte
}

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties) {
        texte = '<h3 style="text-align:center;"> <img src="./img/logos/' + feature.properties.logo + '" width="70" style="padding-right:10px;"/>'+feature.properties.name+'</h3>'
        
        if (feature.properties.num == '13') {
            texte += '<p><b>Activité : </b>'+ feature.properties.activity + '<br/>'
            texte += '<i>Les Hunger Games ont été créés après la destruction du 13.</i>'
        } else if (feature.properties.num == 'C') {
            texte += '<p><b>Activité : </b>Centre du pouvoir<br/>'
        } else {
            texte += '<p><b>Activité : </b>'+ feature.properties.activity + '<br/>'
            texte += '<b>Tributs :</b><br/>'
            texte += '<b>- 10èmes Hunger Games</b> : ' + printTributs(feature.properties.M_HG10) + ' et ' + printTributs(feature.properties.W_HG10) + ' (mentors : ' + printTributs(feature.properties.Men_M_HG10) + ' et ' + printTributs(feature.properties.Men_W_HG10) + ')<br/>'
            texte += '<b>- 74èmes Hunger Games</b> : ' + printTributs(feature.properties.M_HG74) + ' et ' + printTributs(feature.properties.W_HG74) + '<br/>'
            texte += '<b>- 75èmes Hunger Games</b> : ' + printTributs(feature.properties.M_HG75) + ' et ' + printTributs(feature.properties.W_HG75)
        }
        texte += '</p>'
        texte += '<p><i>Logo : © Lionsgate</i></p>'
    }
    if (feature.properties.num != 'I'){
        layer.bindPopup(texte);
        layer.bindTooltip(feature.properties.num,{permanent: true, direction:"center"});
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
        })
    }
};

/************ Data ***********/

function styleOldCoastline(feature) {
    return {
        fillColor: '#0C5176',
        color: '#9f9f9f',
        fillOpacity: 1,
        dashArray: '3',
        weight: 1
    };
}

var url = "./data/20thcentury.geojson";	
var formercoastline;
//Initial Setup  with layer Verified No
    formercoastline = L.geoJson(null, {
        style:styleOldCoastline
    }); 
    	
     $.getJSON(url, function(data) {
        formercoastline.addData(data);
    });



var url = "./data/panem.geojson";	
var districts;
//Initial Setup  with layer Verified No
    districts = L.geoJson(null, {
        style:style,
		onEachFeature: onEachFeature
        /*,
        filter:function(feature, layer) {
            return feature.properties.name != "Interstice";
        }*/
    }); 
    	
     $.getJSON(url, function(data) {
	   districts.addData(data);
    });

function styleLimits(feature) {
    return {
        color: '#9f9f9f',
        fillOpacity: 1,
        dashArray: '9',
        weight: 1
    };
}

var url = "./data/districts-limits.geojson";	
var limits;
//Initial Setup  with layer Verified No
    limits = L.geoJson(null, {
        style:styleLimits
    }); 
        
        $.getJSON(url, function(data) {
        limits.addData(data);
    });

var url = "./data/us-states.geojson";	
var usstates;
//Initial Setup  with layer Verified No
    usstates = L.geoJson(null, {

    }); 
        
        $.getJSON(url, function(data) {
        usstates.addData(data);
    });

/////////////

var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'jpg'
});

var map = L.map('map',{
    crs:L.CRS.EPSG3857,
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    },
    minZoom:4,
    maxZoom:5
}).setView([37.244322,-99.580078], 4);

var baseMaps = {
    
};

var overlayMaps = {
    "Monde réel": Stamen_Watercolor,
    "Panem":districts,
    "Ancien trait de côte":limits,
    "Anciens états américains":usstates,
};
L.control.scale().addTo(map);
map.attributionControl.addAttribution('Map of Panem (Hunger Games world, created by Suzanne Collins) produced using Lionsgate map from The Hunger Games Exhibition (Las Vegas)');

L.control.layers(baseMaps, overlayMaps, {
	collapsed:false,
	//sortLayers:false
	}).addTo(map);


districts.addTo(map)
limits.addTo(map).bringToFront();
formercoastline.addTo(map)