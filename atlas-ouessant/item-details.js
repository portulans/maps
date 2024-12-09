const leafletViewer1 = document.getElementById("leaflet-viewer1");
const leafletViewer2 = document.getElementById("leaflet-viewer2");
const leafletViewer3 = document.getElementById("leaflet-viewer3");

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

        const tags = { Type: data.Type, Emprise: data.Emprise, Siecle: data.Siecle };
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
        if (data.Titre_de_l_ouvrage) {
            document.getElementById("ouvrage").innerHTML = "Issu de l'ouvrage <i>" + data.Titre_de_l_ouvrage + "</i>";
        }
        // Crédits
        
        //If data.Auteur is a list (separated by commas), split it and display each author on a new list item
        if (data.Auteur && data.Auteur.includes(",")) {
            const author_item = document.getElementById("author").innerHTML = 'Auteurs : <ul id="authors"></ul>';
            let authors = data.Auteur.split(",");

            let authorList = document.getElementById("authors");
            authors.forEach(author => {
                let authorItem = document.createElement("li");
                authorItem.textContent = author;
                authorList.appendChild(authorItem);
            });
        } else if (data.Auteur && data.d_apres) {
            document.getElementById("author").textContent = "Auteur : " + data.Auteur + " d'après " + data.d_apres;
        } else if (data.Auteur) {
            document.getElementById("author").textContent = "Auteur : " + data.Auteur;
        }
        if (data.Graveur) {
            document.getElementById("graveur").textContent = "Gravure : " + data.Graveur;
        }
        if (data.Imprimeur) {
            document.getElementById("imprimeur").textContent = "Impression : " + data.Imprimeur
        }
        if (data.Editeur) {
            document.getElementById("editeur").textContent = "Editeur : " + data.Editeur 
        }
        if (data.Commanditaire) {
            document.getElementById("commanditaire").textContent =  "Commanditaire : " + data.Commanditaire
        }

        // Numérotation
        if (data.Numérotation && data.Edition) {
            let ed = ""
            //check last digit of the edition number
            if (data.Edition.slice(-1) == 1) {
                ed = "ère"
            } else {
                ed = "ème"
            }
            document.getElementById("numerotation").innerHTML = "Numéro de la carte : " + data.Numérotation + " (" + data.Edition + ed + " édition)";
        } else if (data.Numérotation) {
            document.getElementById("numerotation").textContent = "Numéro de la carte : " + data.Numérotation;
        }

        //Dates
        if (data.Date_Création && data.Date_Levés && data.Date_Publication && data.Date_MAJ && data.Date_Révision) {
            document.getElementById("date").innerHTML = "Dates :<ul><li>Publication : " + data.Date_Publication + "</li><li>Première publication : " + data.Date_Création + "</li><li>Levés : " + data.Date_Levés + "</li><li>Mise à jour : " + data.Date_MAJ + "</li><li>Révision : " + data.Date_Révision + "</ul>";
        } else if (data.Date_Création && data.Date_Levés && data.Date_Publication) {
            document.getElementById("date").innerHTML = "Dates :<ul><li>Publication : " + data.Date_Publication + "</li><li>Première publication : " + data.Date_Création + "</li><li>Levés : " + data.Date_Levés + "</li></ul>";
        } else if (data.Date_Création && data.Date_Levés) {
            document.getElementById("date").innerHTML = "Dates :<ul><li>Publication : " + data.Date_Création + "</li><li>Levés : " + data.Date_Levés + "</li></ul>";
        } else if (data.Date_Création) {
            document.getElementById("date").textContent = "Date : " + data.Date_Création;
        }

        // Sources
        if (data.Lien && data.Détail_institution && data.Cote) {
            document.getElementById("institution").innerHTML = `Source : <a href="${data.Lien}" target="_blank">${data.Détail_institution} (${data.Cote})</a>`;
        } else if (data.Lien && data.Détail_institution) {
            //append child into the institution paragraph
            document.getElementById("institution").innerHTML += `Source : <a href="${data.Lien}" target="_blank">${data.Détail_institution}</a>`;
        } else if (data.Détail_institution && data.Cote) {
            document.getElementById("institution").innerHTML = `Source : ${data.Détail_institution} (${data.Cote})`;
        }
        else if (data.Détail_institution) {
            document.getElementById("institution").textContent = `Source : ${data.Détail_institution}`;
        }
        if (data.Collection) {
            document.getElementById("collection").textContent = "Collection : " + data.Collection;
        }

        if (data.Description) {
            document.getElementById("description").innerHTML = data.Description;
        }
        if (data.Commentaire) {
            document.getElementById("commentaire").innerHTML = data.Commentaire;
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
            zoom:13,
            fullscreenControl: true,
	        fullscreenControlOptions: {
		    position: 'topleft'}
        });
        L.control.locate({
            setViw:true,
            strings: {
            title: "Me situer sur la carte !"
          }}).addTo(map1);

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
            zoom: 2,
            fullscreenControl: true,
	        fullscreenControlOptions: {
		    position: 'topleft'}
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
                fullscreenControl: true,
                fullscreenControlOptions: {
                position: 'topleft'}
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