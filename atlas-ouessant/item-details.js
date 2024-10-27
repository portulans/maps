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
            } else {
                console.error("Map data not found for ID:", mapId);
            }
        }
    });

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
        if (data.IIIF_Manifest) {
            loadIIIFImage(data.IIIF_Manifest,data.Institution,data.IIIF_Item);
        } else if (data.Wiki_Commons_Name) {
            loadWikiImage(data.Wiki_Commons_Name, data.Wiki_Commons_Prefix);
        } else {
            console.error("No image source found for this map.");
        }
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
        
        if (institution == "BNF" || institution == "SHD") {
            const iiifBaseUrl = manifestUrl.replace("manifest.json", "");
            imageUrl = `${iiifBaseUrl}f${item}/info.json`;
        } else if (institution == "Université d'Utretch" ) {
            imageUrl = manifestUrl
        }
        L.tileLayer.iiif(imageUrl).addTo(map);
    }
    
    // Function to load Wiki Commons image in an iframe
    function loadWikiImage(fileName, prefix) {
        const leafletImageViewer = document.getElementById("leaflet-image-viewer");
        leafletImageViewer.style.display = "block";

        // Encode special characters in the file name;
        fileName = fileName.replace(/[,() ]/g, match => ({',': '%2C', '(': '%28', ')': '%29', ' ': '_'}[match]));
        imageUrl = `https://upload.wikimedia.org/wikipedia/commons/${prefix}/${fileName}`;

        // Create a new Image object to get its dimensions
        const img = new Image();
        img.src = imageUrl;

        img.onload = function() {
            const imageWidth = img.width;
            const imageHeight = img.height;

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
