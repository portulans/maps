// Function to create a custom rotated icon based on azimuth
function createRotatedIcon(orientation, type) {
    var angle = orientation;  // Orientation angle from GeoJSON (in degrees)
    var t = type
    // Create a custom divIcon using the arrow image (JPEG of an arrow)
    var iconUrl = ''
    if (t === 'mer') {
        iconUrl = './img/fleche-mer.png';  // Replace with the path to your arrow image
    } else if (t === 'oblique') {
        iconUrl = './img/fleche-oblique.png';
    } else {
        iconUrl = './img/fleche-sol2.png';  // Default icon for other types
    }

    // Create a custom divIcon and apply the rotation
    var icon = L.divIcon({
        className: 'rotated-icon',
        /*html: '<img src="' + iconUrl + '" style="transform: rotate(' + angle + 'deg); width: 32px; height: 32px;" />',*/
        html: `<div style="width: 15px; height: 15px; 
                            background-color: white; 
                            border-radius: 50%; 
                            display: flex; 
                            justify-content: center; 
                            align-items: center; 
                            transform: rotate(${angle}deg);">
                    <img src="${iconUrl}" style="width: 12px; height: 12px;" />
                </div>`,
        iconSize: [12, 12],  // Adjust the size as necessary
    });

    return icon;
}

var map = L.map('map', {
    minZoom: 0,
}
).setView([48.46, -5.08], 13);

/*************** CONTROLS ***************/
// Add scale
L.control.scale().addTo(map);
//Locate control
L.control.locate({
    setView:true,
    strings: {
    title: "Me situer sur la carte !"
}}).addTo(map);

// Layers
const layers = [
    {
        name: 'Cartes actuelles',
        collapsed: true,
        layers: [
            { name: "Plan IGN", layer: ign2023, active: false},
            { name: "OpenStreetMap", layer: osm, active: true},
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
            { name: "Carte touristique (1929)", layer: cartetouristique1929, active: false, opacityControl: true},
            { name: "Scan historique IGN (1950)", layer: ign1950, active: false, opacityControl: true},
        ],
    }

];
L.control.advancedLayers(layers, {
    position:'topright',
    collapsed: true
}).addTo(map);
/******************* FUNCTIONS *************/
var featurePanelContent = document.getElementById('feature-panel-content');

// Function to handle image modal from images rendered in the feature panel
function setupImageModal() {
    var contentDiv = document.getElementById('feature-panel-content');
    if (!contentDiv) {
        return;
    }

    var images = contentDiv.getElementsByTagName('img');
    for (var j = 0; j < images.length; j++) {
        images[j].style.cursor = 'pointer';
        images[j].addEventListener('click', function () {
            var modal = document.getElementById('imageModal');
            var modalImg = document.getElementById('modalImg');

            if (!modal || !modalImg) {
                return;
            }

            modal.style.display = 'flex';
            modalImg.src = this.src;
            modalImg.alt = this.alt || 'Image';
        });
    }
}

// Function to close modal
document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById('imageModal');
    var closeBtn = document.querySelector('.close');

    if (!modal || !closeBtn) {
        return;
    }

    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

function displayFeaturePanel(data) {
    if (!featurePanelContent) {
        return;
    }

    var content = '';

    if (data.Auteur) {
        content += `<p><strong>Auteur:</strong> ${data.Auteur}</p>`;
    }
    if (data.Type && data.Nature) {
        content += `<p><strong>Type de document:</strong> ${data.Type}, ${data.Nature}</p>`;
    } else if (data.Type) {
        content += `<p><strong>Type de document:</strong> ${data.Type}</p>`;
    } else if (data.Nature) {
        content += `<p><strong>Type de document:</strong> ${data.Nature}</p>`;
    }

    if (data.Image) {
        content += `<img src="img/library/${data.Institution}/${data.Image}" alt="${data.Cote || ''}" style="max-width: 100%; height: auto; margin-top: 10px; border-radius: 10px;">`;
    }

    if (data.Description) {
        content += `<p><strong>Description:</strong> ${data.Description}</p>`;
    }
    if (data.Legende) {
        content += `<p><strong>Légende:</strong> ${data.Legende}</p>`;
    }
    if (data.Date && data.Siecle) {
        content += `<p><strong>Date:</strong> ${data.Date}, ${data.Siecle}</p>`;
    } else if (data.Date) {
        content += `<p><strong>Date:</strong> ${data.Date}</p>`;
    } else if (data.Siecle) {
        content += `<p><strong>Date:</strong> ${data.Siecle}</p>`;
    }
    if (data.Ouvrage) {
        content += `<p><strong>Issu de :</strong> ${data.Ouvrage}</p>`;
    }
    if (data.Cote && data.Collection && data.Detail_institution) {
        content += `<p><strong>Source: </strong> ${data.Cote} - ${data.Collection} - ${data.Detail_institution}</p>`;
    } else if (data.Cote && data.Detail_institution) {
        content += `<p><strong>Source: </strong> ${data.Cote} - ${data.Detail_institution}</p>`;
    } else if (data.Detail_institution) {
        content += `<p><strong>Source: </strong> ${data.Detail_institution}</p>`;
    }
    if (data.Licence) {
        content += `<p><strong>Licence:</strong> ${data.Licence}</p>`;
    }

    if (data.Lien_fiche) {
        content += `<p><a href='${data.Lien_fiche}' target='_blank' rel='noopener noreferrer'>Voir sur le site source</a></p>`;
    }

    if (data.Commentaire) {
        content += `<p><strong>Remarques:</strong> ${data.Commentaire}</p>`;
    }

    if (!content) {
        content = '<p>Aucune information disponible pour ce point.</p>';
    }

    featurePanelContent.innerHTML = content;
    setupImageModal();
}

// Load CSV using PapaParse
var csvData = {}; // Object to store the parsed CSV data
Papa.parse('data/iconographie.csv', {
    download: true,
    header: true, // Treat the first row as header
    dynamicTyping: true,
    complete: function(results) {
        // Populate csvData with parsed data using the ID as the key
        results.data.forEach(function(row) {
            var id = row.ID;  // Assuming your CSV has a column 'id'
            if (id) {
                csvData[id] = row;  // Store each row in the object by ID
            }
        });
        //console.log("CSV Data Loaded: ", csvData);  // Log the loaded data for debugging
    },
    error: function(error) {
        console.error("Error loading CSV: ", error);
    }
});

// Load GeoJSON data
var url = 'data/loc-images.geojson';	

var solMarkers = new L.FeatureGroup();
var merMarkers = new L.FeatureGroup();
var obliqueMarkers = new L.FeatureGroup();

var points = L.geoJSON(null, {
onEachFeature: function (feature, layer) {
    var orientation = feature.properties.orientatio;
    
    var latlng = layer.getLatLng();
    // Create and add a marker using the rotated icon
    var marker = L.marker(latlng, { icon: createRotatedIcon(orientation,feature.properties.type) })
    // Add the marker to the appropriate feature group based on type

    if (feature.properties.type === 'sol') {
        solMarkers.addLayer(marker);
    } else if (feature.properties.type === 'mer') {
        merMarkers.addLayer(marker);
    } else if (feature.properties.type === 'oblique') {
        obliqueMarkers.addLayer(marker);
    }

    // Add a click event to the marker
    marker.on('click', function () {
    var featureId = feature.properties.ID;  // Assuming 'id' is the ID field in GeoJSON
    if (csvData && csvData[featureId]) {  // Check if csvData has the featureId
        var additionalData = csvData[featureId]; // Retrieve the corresponding row from the CSV
        displayFeaturePanel(additionalData);  // Display the data in the feature panel
    } else {
        console.error("No additional data found for feature ID: " + featureId);
    }
});
}
});

var clustersOptions = {showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        spiderfyOnMaxZoom: true,
        //disableClusteringAtZoom: 16,
        maxClusterRadius:10}
var markersClusterSol = L.markerClusterGroup(clustersOptions);
var markersClusterMer = L.markerClusterGroup(clustersOptions);
var markersClusterOblique = L.markerClusterGroup(clustersOptions);
// Create a marker cluster group
$.getJSON(url, function(data) {
    points.addData(data);
    markersClusterSol.addLayer(solMarkers);
    markersClusterMer.addLayer(merMarkers);
    markersClusterOblique.addLayer(obliqueMarkers);
    map.addLayer(markersClusterSol);  // Add the cluster group to the map
    map.addLayer(markersClusterMer);  // Add the cluster group to the map
    map.addLayer(markersClusterOblique);  // Add the cluster group to the map
});



function renderLegendPanel() {
    var legendContainer = document.getElementById('icono-map-legend');
    if (!legendContainer) {
        return;
    }

    legendContainer.classList.add('is-collapsed');
    legendContainer.innerHTML =
        '<button type="button" id="icono-legend-toggle" class="legend-toggle" aria-expanded="false">' +
        '<span>Type de prise de vue</span><span class="legend-toggle__icon" aria-hidden="true">▾</span>' +
        '</button>' +
        '<div id="icono-legend-content" class="legend-content">' +
        '<label class="legend-row"><input type="checkbox" id="solCheckbox" checked> <img src="./img/fleche-sol2.png" alt=""> <span>Sol</span></label>' +
        '<label class="legend-row"><input type="checkbox" id="merCheckbox" checked> <img src="./img/fleche-mer.png" alt=""> <span>Vu de la mer</span></label>' +
        '<label class="legend-row"><input type="checkbox" id="obliqueCheckbox" checked> <img src="./img/fleche-oblique.png" alt=""> <span>Oblique aérienne</span></label>' +
        '</div>';

    var legendToggle = document.getElementById('icono-legend-toggle');
    if (legendToggle) {
        legendToggle.addEventListener('click', function () {
            var isCollapsed = legendContainer.classList.toggle('is-collapsed');
            legendToggle.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
        });
    }

    var solCheckbox = document.getElementById('solCheckbox');
    var merCheckbox = document.getElementById('merCheckbox');
    var obliqueCheckbox = document.getElementById('obliqueCheckbox');

    if (solCheckbox) {
        solCheckbox.addEventListener('change', function(e) {
            if (e.target.checked) {
                map.addLayer(markersClusterSol);
            } else {
                map.removeLayer(markersClusterSol);
            }
        });
    }

    if (merCheckbox) {
        merCheckbox.addEventListener('change', function(e) {
            if (e.target.checked) {
                map.addLayer(markersClusterMer);
            } else {
                map.removeLayer(markersClusterMer);
            }
        });
    }

    if (obliqueCheckbox) {
        obliqueCheckbox.addEventListener('change', function(e) {
            if (e.target.checked) {
                map.addLayer(markersClusterOblique);
            } else {
                map.removeLayer(markersClusterOblique);
            }
        });
    }
}

renderLegendPanel();