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
                displayImage(mapData);
                populateMapTags(mapData)
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
        document.getElementById("map-name").textContent = data.Map_name || "Unknown Map";
        document.getElementById("author").textContent = data.Auteur || "Unknown Author";
        document.getElementById("siecle").textContent = data.Siècle || "Unknown Siècle";
        document.getElementById("type").textContent = data.Type || "Unknown Type";
        document.getElementById("emprise").textContent = data.Emprise || "Unknown Emprise";
    }

    // Function to display the map image
    function displayImage(data) {
        if (data.XYZ_tiles && data.IIIF_Manifest) {
            let radios = document.getElementsByName('radiobuttonsformaps');
            // Add two radios buttons in the div
            let radio1 = document.createElement("input");
            radio1.type = "radio";
            radio1.name = "radiobuttonsformaps";
            radio1.value = "XYZ_tiles";
            radio1.checked = true;
            radio1.id = "XYZ_tiles";
            radio1.onclick = function() {
                loadXYZImage(url,attribution,attribution_url);
            }
            let label1 = document.createElement("label");
            label1.htmlFor = "XYZ";
            label1.appendChild(document.createTextNode("XYZ_tiles"));
            
            let radio2 = document.createElement("input");
            radio2.type = "radio";
            radio2.name = "radiobuttonsformaps";
            radio2.value = "IIIF";
            radio2.id = "IIIF";
            radio2.onclick = function() {
                loadIIIFImage(url,attribution,attribution_url);
            }
            let label2 = document.createElement("label");
            label2.htmlFor = "IIIF";
            label2.appendChild(document.createTextNode("IIIF"));
            let radioDiv = document.getElementById("radiobuttonsformaps");
            radioDiv.appendChild(radio1);
            radioDiv.appendChild(label1);
            radioDiv.appendChild(radio2);
            radioDiv.appendChild(label2);

            loadXYZImage(data.XYZ_tiles,data.Institution,data.Lien);
        } else if (data.IIIF_Manifest) {
            loadIIIFImage(data.IIIF_Manifest,data.Institution,data.IIIF_Item);
        } else if (data.Wiki_Commons_Name) {
            loadWikiImage(data.Wiki_Commons_Name, data.Wiki_Commons_Prefix);
        } else {
            console.error("No image source found for this map.");
        }
    }

    // Function to load IIIF image in Leaflet viewer
    function loadXYZImage(url,attribution,attribution_url) {
        const leafletViewer = document.getElementById("leaflet-viewer");
        leafletViewer.style.display = "block";

        // Initialize Leaflet map with IIIF support
        const map = L.map('leaflet-viewer',{
            center: [48.464271, -5.086464],
            zoom:13
        });

        // Add an osm layer
        var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        
        // Add the georeferenced image
        var layer = L.tileLayer(url, {
            attribution: `&copy; <a href="${attribution_url}">${attribution}</a>`
        });

        // Add a control panel with osm as base layer and layer as overlayer
        var baseLayers = {
            "OpenStreetMap": osm
        };
        var overlays = {
            "Carte ancienne": layer
        };
        L.control.layers(baseLayers,overlays).addTo(map);
        osm.addTo(map);
        layer.addTo(map);

        //Add a scale
        L.control.scale().addTo(map);

        // Add a fullscreen button
        map.addControl(new L.Control.Fullscreen());

        // Add an opacity control for the layer
        var slider = document.createElement("input");
        slider.type = "range";
        slider.min = 0;
        slider.max = 1;
        slider.step = 0.1;
        slider.value = 1;
        slider.oninput = function() {
            layer.setOpacity(this.value);
        }
        map.addControl(slider);
    }

    // Function to load IIIF image in Leaflet viewer
    function loadIIIFImage(manifestUrl,institution,item) {
        const leafletViewer = document.getElementById("leaflet-viewer");
        leafletViewer.style.display = "block";

        // Initialize Leaflet map with IIIF support
        const map = L.map('leaflet-viewer', { 
            center: [0, 0],
            crs: L.CRS.Simple,
            zoom: 1
          });
        console.log(manifestUrl);
        
        if (institution == "BNF" || institution == "SHD" || row.Institution == "ENPC") {
            const iiifBaseUrl = manifestUrl.replace("manifest.json", "");
            imageUrl = `${iiifBaseUrl}f${item}/info.json`;
        } else {
            imageUrl = manifestUrl
        }
        L.tileLayer.iiif(imageUrl).addTo(map);
    }
    
    // Function to load Wiki Commons image in an iframe
    function loadWikiImage(fileName, prefix) {
        const leafletImageViewer = document.getElementById("leaflet-image-viewer");
        leafletImageViewer.style.display = "block";

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
            const map = L.map('leaflet-image-viewer', {
                crs: L.CRS.Simple,
                center: [imageHeight / 2, imageWidth / 2], // Center on the image
                zoom: 0,
                minZoom: -5, // Allow more zooming out
            });

            // Add the image overlay with the calculated bounds
            const imageOverlay = L.imageOverlay(imageUrl, imageBounds).addTo(map);

            // Calculate the default zoom to fit the image
            const containerSize = map.getSize();
            const widthScale = containerSize.x / imageWidth;
            const heightScale = containerSize.y / imageHeight;
            const scale = Math.min(widthScale, heightScale);

            // Calculate the zoom level based on the scale
            const defaultZoom = map.getZoom() + Math.log2(scale);

            // Set the map to the calculated default zoom level and fit the bounds
            map.setZoom(defaultZoom);
            map.fitBounds(imageBounds);
        };
    }
});
