var map = L.map('asterixmap',{
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    }
}).setView([44.703020, 11.707032], 4);

L.control.scale().addTo(map);

var OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var DARE_map = L.tileLayer('https://dh.gu.se/tiles/imperium/{z}/{x}/{y}.png', {
	minZoom:4,
    maxZoom: 11,
	attribution: '© Johan Åhlfeldt, Centre for Digital Humanities, University of Gothenburg 2019 | <a href="https://dh.gu.se/dare/" target="_blank">DARE Project</a> | CC BY 4.0'
}).addTo(map);

//////////// Style des points
var geojsonMarkerOptions = {
    radius:5,
    fillColor: "#0FB7D9",
    color: "#ffffff",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};

//////////// Function

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.name) {
        texte = '<h2>'+feature.properties.name+'</h2>' +
            '<p><b>Apparitions : </b><i>'+ feature.properties.album +
            '</i></p>'+'<p class="center">-------------</p>'+
            '<p><b>Nom actuel : </b>' + feature.properties.city+'</br>'+
            '<b>Département : </b>' + feature.properties.county+'</br>'+
            '<b>Région : </b>' + feature.properties.state+'</br>'+
            '<b>Pays : </b>' + feature.properties.country+'</p>';
            layer.bindPopup(texte).bindTooltip(feature.properties.name);
    }
};

function pointToLayer(feature,latlng) {
    return L.circleMarker(latlng, geojsonMarkerOptions);
}

////////////////////

//Emplacement fictif du village
var loupeIcon = L.icon({
    iconUrl: 'img/loupe.png',
    iconSize:     [50, 50], // size of the icon
});
L.marker([48.8, -3.2], {icon: loupeIcon}).addTo(map);

var url = "data/villes.geojson";	
var villes;

//Initial Setup  with layer Verified No
	villes = L.geoJson(null, {
        pointToLayer: pointToLayer,  
		onEachFeature: onEachFeature,
    }); 
    	
     $.getJSON(url, function(data) {
	   villes.addData(data);
    });
/*Layers*/

//Using a Layer Group to add/ remove data from the map.
var myData =  L.layerGroup([]);
	myData.addLayer(villes);
	myData.addTo(map); 
    
    document.getElementById("tous").addEventListener('click', function(event) {
        theExpression = 'feature.properties.num_album != "10000"' ;	
        console.log(theExpression);
            map.removeLayer(myData);
            myData.clearLayers();
            
            villes = L.geoJson(null, {
                pointToLayer: pointToLayer,
                onEachFeature: onEachFeature
            });
            
            $.getJSON(url, function(data) {
                   villes.addData(data);
            });
    
            myData.addLayer(villes);
            myData.addTo(map);
        }
    );

    document.getElementById("01").addEventListener('click', function (event) {
        theExpression = 'feature.properties.num_album.indexOf("01") !== -1;' ;	
        console.log(theExpression);
            map.removeLayer(myData);
            myData.clearLayers();
            
            villes = L.geoJson(null, {
                pointToLayer: pointToLayer,
                onEachFeature: onEachFeature,
                filter: function(feature, layer) {   
                    return (feature.properties.num_album.indexOf("01") !== -1);
                },
            });
            
            $.getJSON(url, function(data) {
                villes.addData(data);
            });
    
            myData.addLayer(villes);
            myData.addTo(map);
        }
    );

        document.getElementById("02").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("02") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("02") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("03").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("03") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("03") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("04").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("04") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("04") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("05").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("05") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("05") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("06").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("06") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("06") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("07").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("07") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("07") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("08").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("08") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("08") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("09").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("09") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("09") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("10").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("10") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("10") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("11").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("11") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("11") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("12").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("12") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("12") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("13").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("13") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("13") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("14").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("14") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("14") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("15").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("15") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("15") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("16").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("16") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("16") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("16").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("16") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("16") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("17").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("17") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("17") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("18").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("18") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("18") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("19").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("19") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("19") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("20").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("20") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("20") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("21").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("21") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("21") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("22").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("22") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("22") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("23").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("23") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("23") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("24").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("24") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("24") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("25").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("25") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("25") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("26").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("26") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("26") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("27").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("27") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("27") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("28").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("28") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("28") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("29").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("29") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("29") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("30").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("30") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("30") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("31").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("31") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("31") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("32").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("32") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("32") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );

        document.getElementById("33").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("33") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("33") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );
document.getElementById("34").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("34") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("34") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );
document.getElementById("35").addEventListener('click', function (event) {
            theExpression = 'feature.properties.num_album.indexOf("35") !== -1;' ;	
            console.log(theExpression);
                map.removeLayer(myData);
                myData.clearLayers();
                
                villes = L.geoJson(null, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature,
                    filter: function(feature, layer) {   
                        return (feature.properties.num_album.indexOf("35") !== -1);
                    },
                });
                
                $.getJSON(url, function(data) {
                    villes.addData(data);
                });
        
                myData.addLayer(villes);
                myData.addTo(map);
            }
        );
    document.getElementById("36").addEventListener('click', function (event) {
                theExpression = 'feature.properties.num_album.indexOf("36") !== -1;' ;	
                console.log(theExpression);
                    map.removeLayer(myData);
                    myData.clearLayers();
                    
                    villes = L.geoJson(null, {
                        pointToLayer: pointToLayer,
                        onEachFeature: onEachFeature,
                        filter: function(feature, layer) {   
                            return (feature.properties.num_album.indexOf("36") !== -1);
                        },
                    });
                    
                    $.getJSON(url, function(data) {
                        villes.addData(data);
                    });
            
                    myData.addLayer(villes);
                    myData.addTo(map);
                }
            );
    document.getElementById("37").addEventListener('click', function (event) {
                theExpression = 'feature.properties.num_album.indexOf("37") !== -1;' ;	
                console.log(theExpression);
                    map.removeLayer(myData);
                    myData.clearLayers();
                    
                    villes = L.geoJson(null, {
                        pointToLayer: pointToLayer,
                        onEachFeature: onEachFeature,
                        filter: function(feature, layer) {   
                            return (feature.properties.num_album.indexOf("37") !== -1);
                        },
                    });
                    
                    $.getJSON(url, function(data) {
                        villes.addData(data);
                    });
            
                    myData.addLayer(villes);
                    myData.addTo(map);
                }
            );

            document.getElementById("38").addEventListener('click', function (event) {
                theExpression = 'feature.properties.num_album.indexOf("38") !== -1;' ;	
                console.log(theExpression);
                    map.removeLayer(myData);
                    myData.clearLayers();
                    
                    villes = L.geoJson(null, {
                        pointToLayer: pointToLayer,
                        onEachFeature: onEachFeature,
                        filter: function(feature, layer) {   
                            return (feature.properties.num_album.indexOf("38") !== -1);
                        },
                    });
                    
                    $.getJSON(url, function(data) {
                        villes.addData(data);
                    });
            
                    myData.addLayer(villes);
                    myData.addTo(map);
                }
            );

            document.getElementById("39").addEventListener('click', function (event) {
                theExpression = 'feature.properties.num_album.indexOf("39") !== -1;' ;	
                console.log(theExpression);
                    map.removeLayer(myData);
                    myData.clearLayers();
                    
                    villes = L.geoJson(null, {
                        pointToLayer: pointToLayer,
                        onEachFeature: onEachFeature,
                        filter: function(feature, layer) {   
                            return (feature.properties.num_album.indexOf("39") !== -1);
                        },
                    });
                    
                    $.getJSON(url, function(data) {
                        villes.addData(data);
                    });
            
                    myData.addLayer(villes);
                    myData.addTo(map);
                }
            );