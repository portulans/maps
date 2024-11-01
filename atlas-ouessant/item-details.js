const leafletViewer1 = document.getElementById("leaflet-viewer1");
const leafletViewer2 = document.getElementById("leaflet-viewer2");
const leafletViewer3 = document.getElementById("leaflet-viewer3");

function openTab(evt, name) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(name).style.display = "block";
    evt.currentTarget.className += " active";
  }

document.addEventListener("DOMContentLoaded", function () {

    // Function to get URL query parameters
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Get the map ID from the URL
    const mapId = getQueryParam("id");

    // Fetch and parse the CSV data
    Papa.parse("maps.csv", {
        download: true,
        header: true,
        complete: function (results) {
            const mapData = results.data.find(row => row.ID === mapId);
            if (mapData) {
                populateMapDetails(mapData);
                populateMapTags(mapData);
                displayImage(mapData);
            } else {
                console.error("Map data not found for ID:", mapId);
            }
        }
    });

    function populateMapTags(data) {
        // Add tags and populate allTags
        const tagsContainer = document.getElementById("map-item-tags")

        const tags = { Type: data.Type, Emprise: data.Emprise, Siècle: data.Siècle };
        for (const [key, value] of Object.entries(tags)) {
            if (value) {
                const tagElement = document.createElement("span");
                tagElement.className = `tag-item tag-${key.toLowerCase()}`;
                tagElement.textContent = value;
                tagElement.addEventListener("click", () => filterByTag(value));
                tagsContainer.appendChild(tagElement);
            }
        }

        // Add special tag if Georeferencing is done
        if (data.Georeferencing === "done") {
            const geoTag = document.createElement("span");
            geoTag.className = "tag tag-georef"; // Custom class for styling
            geoTag.textContent = "Carte géoréférencée";
            tagsContainer.appendChild(geoTag);
        }
    } 

    // Function to populate map details
    function populateMapDetails(data) {
        document.getElementById("map-name").textContent = data.Map_name || "Carte sans titre";
        document.getElementById("author").textContent = data.Auteur || "Auteur inconnu";
        document.getElementById("date").textContent = data.Date_Création || "Date inconnue";
        document.getElementById("type").textContent = data.Type || "Unknown Type";

        if (data.Lien && data.Détail_institution) {
            //append child into the institution paragraph
            document.getElementById("institution").innerHTML += `<a href="${data.Lien}" target="_blank">${data.Détail_institution}</a>`;
        } else {
            document.getElementById("institution").textContent = data.Détail_institution || "Source à préciser";
        }
    }

    // Function to display the image based on the selected option
    function displayImage(data) {
        if (data.XYZ_tiles && data.IIIF_Manifest) {
            document.getElementById("leaflet-viewer1-title").innerText = "Carte géoréférencée";
            document.getElementById("leaflet-viewer1-comment").innerText = "Chaque pixel de l'image a été associé à des coordonnées géographiques afin de superposer l'image à une carte moderne.";
            loadXYZImage(data.XYZ_tiles, data.Attribution, data.Lien);
            loadIIIFImage(data.IIIF_Manifest, data.Institution, data.IIIF_Item);
        } else if (data.XYZ_tiles && data.Wiki_Commons_Name) {
            loadXYZImage(data.XYZ_tiles, data.Attribution, data.Lien);
            loadIIIFImage(data.IIIF_Manifest, data.Institution, data.IIIF_Item);
        } else if (data.IIIF_Manifest) {
            loadIIIFImage(data.IIIF_Manifest, data.Institution, data.IIIF_Item);
        } else if (data.Wiki_Commons_Name) {
            loadWikiImage(data.Wiki_Commons_Name, data.Wiki_Commons_Prefix);
        } else {
            console.error("No image source found for this map.");
        }
    }

    // Function to load IIIF image in Leaflet viewer
    function loadXYZImage(url,attribution,attribution_url) {

        leafletViewer1.style.display = "block";

        // Initialize Leaflet map with IIIF support
        let map1 = new L.map('leaflet-viewer1',{
            center: [48.464271, -5.086464],
            zoom:13
        });

        // Add an osm layer
        var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
                maxZoom : 18,
                attribution : "IGN",
                tileSize : 256 // les tuiles du Géooportail font 256x256px
            });
        
        // Add the georeferenced image
        var layer = L.tileLayer(url, {
            attribution: `&copy; <a href="${attribution_url}">${attribution}</a>`
        });

        // Add a control panel with osm as base layer and layer as overlayer
        var baseLayers = {
            "Photographie aérienne" : ignaerial2023,
            "OpenStreetMap": osm
        };
        var overlays = {
            "Carte ancienne": layer
        };
        L.control.layers(baseLayers,overlays,{collapsed:false}).addTo(map1);
        L.control.opacity(overlays, {label: 'Transparence',}).addTo(map1);
        osm.addTo(map1);
        layer.addTo(map1);

        //Add a scale
        L.control.scale().addTo(map1);
    }

    // Function to load IIIF image in Leaflet viewer
    function loadIIIFImage(manifestUrl,institution,item) {

        leafletViewer2.style.display = "block";

        // Initialize Leaflet map with IIIF support

        let map2 = new L.map('leaflet-viewer2', { 
            center: [0, 0],
            crs: L.CRS.Simple,
            zoom: 2
          });
        console.log(manifestUrl);
        
        if (institution == "BNF" || institution == "SHD" || institution == "ENPC") {
            const iiifBaseUrl = manifestUrl.replace("manifest.json", "");
            imageUrl = `${iiifBaseUrl}f${item}/info.json`;
        } else {
            imageUrl = manifestUrl
        }
        L.tileLayer.iiif(imageUrl).addTo(map2);
    }
    
    // Function to load Wiki Commons image in an iframe
    function loadWikiImage(fileName, prefix) {

        leafletViewer3.style.display = "block";

        // Encode special characters in the file name;
        fileName = fileName.replace(/[,() ]/g, match => ({',': '%2C', '(': '%28', ')': '%29', ' ': '_',"'":"%27"}[match]));
        imageUrl = `https://upload.wikimedia.org/wikipedia/commons/${prefix}/${fileName}`;

        // Create a new Image object to get its dimensions
        const img = new Image();
        img.src = imageUrl;

        img.onload = function() {
            let imageWidth = img.width;
            let imageHeight = img.height;
            let maxLSize = 5000;
            if (imageWidth > imageHeight && imageWidth > maxLSize) {
                imageUrl = `https://upload.wikimedia.org/wikipedia/commons/thumb/${prefix}/${fileName}/${maxLSize}px-${fileName}`;
                imageWidth = maxLSize;
                imageHeight = imageWidth * img.height / img.width;
            } else if (imageHeight > imageWidth && imageHeight > maxLSize) {
                imageUrl = `https://upload.wikimedia.org/wikipedia/commons/thumb/${prefix}/${fileName}/${maxLSize}px-${fileName}`;
                imageHeight = maxLSize;
                imageWidth = imageHeight * img.width / img.height;
            }

            // Define image bounds based on its dimensions
            const imageBounds = [[0, 0], [imageHeight, imageWidth]];

            // Initialize the Leaflet map with a simple CRS (for non-geographic usage)
            let map3 = new L.map('leaflet-viewer3', {
                crs: L.CRS.Simple,
                center: [imageHeight / 2, imageWidth / 2], // Center on the image
                zoom: 0,
                minZoom: -5, // Allow more zooming out
            });

            // Add the image overlay with the calculated bounds
            const imageOverlay = L.imageOverlay(imageUrl, imageBounds).addTo(map3);

            // Calculate the default zoom to fit the image
            const containerSize = map3.getSize();
            const widthScale = containerSize.x / imageWidth;
            const heightScale = containerSize.y / imageHeight;
            const scale = Math.min(widthScale, heightScale);

            // Calculate the zoom level based on the scale
            const defaultZoom = map3.getZoom() + Math.log2(scale);

            // Set the map to the calculated default zoom level and fit the bounds
            map3.setZoom(defaultZoom);
            map3.fitBounds(imageBounds);
        };
    }

});