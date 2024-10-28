document.addEventListener("DOMContentLoaded", function () {
    let allTags = { Type: new Set(), Emprise: new Set(), Siècle: new Set() };
    const mapContainer = document.getElementById("mapContainer");
    const filterTagsContainer = document.getElementById("filterTagsContainer");
    const resetFilterButton = document.getElementById("resetFilter");
    let currentFilter = null; // Track current active filter

    Papa.parse("maps.csv", {
        download: true,
        header: true,
        complete: function(results) {

            const data = results.data.filter(row => row.Display_on_catalogue == 'TRUE');

            //Count the number of item and display it in a div nae "count-item"
            const countItem = document.getElementById("count-items");
            countItem.textContent = data.length + " cartes sont listées sur cette page.";

            // Display maps and collect all unique tags
            data.forEach(row => {
                const mapItem = document.createElement("div");
                mapItem.className = "map-item";
                mapItem.dataset.type = row.Type;
                mapItem.dataset.emprise = row.Emprise;
                mapItem.dataset.siecle = row.Siècle;
                
                // Create a link for the image and title that redirects to item.html
                const mapLink = document.createElement("a");
                mapLink.href = `item.html?id=${row.ID}`; // Pass the map ID as a query parameter
                mapLink.className = "map-link";

                // Create image element
                const mapImageContainer = document.createElement("div");
                mapImageContainer.className = "map-image-container";
                let imageUrl;
                if (row.IIIF_Manifest && (row.Institution == "BNF" || row.Institution == "SHD" || row.Institution == "ENPC")) {
                    const iiifBaseUrl = row.IIIF_Manifest.replace("manifest.json", "");
                    if (row.IIIF_region || row.IIIF_size) {
                        imageUrl = `${iiifBaseUrl}f${row.IIIF_Item}/${row.IIIF_region}/!400,/${row.IIIF_rotation}/native.jpg`;
                    } else {
                        imageUrl = `${iiifBaseUrl}f${row.IIIF_Item}/full/!400,/0/native.jpg`;
                    }
                } else if (row.IIIF_Manifest) {
                    const iiifBaseUrl = row.IIIF_Manifest.replace("info.json", "");
                    if (row.IIIF_region || row.IIIF_size) {
                        imageUrl = `${iiifBaseUrl}${row.IIIF_region}/${row.IIIF_size}/${row.IIIF_rotation}/default.jpg`;
                    } else {
                        imageUrl = `${iiifBaseUrl}full/!400,/0/default.jpg`;
                    }
                } else if (row.Wiki_Commons_Name) {
                    let wikiImage = row.Wiki_Commons_Name;
                    wikiImage = wikiImage.replace(/[,() ]/g, match => ({',': '%2C', '(': '%28', ')': '%29', ' ': '_',"'":"%27"}[match]));
                    imageUrl = `https://upload.wikimedia.org/wikipedia/commons/thumb/${row.Wiki_Commons_Prefix}/${wikiImage}/400px-${wikiImage}`;
                } else {
                    imageUrl = ""; // Placeholder or no image
                }

                if (imageUrl) {
                    const img = document.createElement("img");
                    img.src = imageUrl;
                    img.alt = row.Map_name;
                    img.className = "map-image";
                    mapImageContainer.appendChild(img);
                } else {
                    mapImageContainer.textContent = "Image non disponible";
                }

                // Create map details
                const mapDetails = document.createElement("div");
                mapDetails.className = "map-details";
                
                const mapTitle = document.createElement("div");
                mapTitle.className = "map-title";
                mapTitle.textContent = row.Map_name;

                const mapAuthor = document.createElement("div");
                mapAuthor.className = "map-author";
                mapAuthor.textContent = `${row.Auteur || ""}`;

                mapDetails.appendChild(mapTitle);
                mapDetails.appendChild(mapAuthor);

                // Add tags and populate allTags
                const tagsContainer = document.createElement("div");
                tagsContainer.className = "tags";

                const tags = { Type: row.Type, Emprise: row.Emprise, Siècle: row.Siècle };
                for (const [key, value] of Object.entries(tags)) {
                    if (value) {
                        const tagElement = document.createElement("span");
                        tagElement.className = `tag tag-${key.toLowerCase()}`;
                        tagElement.textContent = value;
                        tagElement.addEventListener("click", () => filterByTag(value));
                        tagsContainer.appendChild(tagElement);
                        allTags[key].add(value); // Add to allTags
                    }
                }

                // Add special tag if Georeferencing is done
                if (row.Georeferencing === "done") {
                    const geoTag = document.createElement("span");
                    geoTag.className = "tag tag-georef"; // Custom class for styling
                    geoTag.textContent = "Carte géoréférencée";
                    tagsContainer.appendChild(geoTag);
                }

                mapDetails.appendChild(tagsContainer);

                // Append image and title link
                mapLink.appendChild(mapImageContainer);
                mapLink.appendChild(mapTitle);
                
                mapItem.appendChild(mapLink);
                mapItem.appendChild(mapDetails);
                mapContainer.appendChild(mapItem);
            });

            // Populate the global filter section
            populateFilterTags();
        }
    });

    function populateFilterTags() {
        for (const [key, tagsSet] of Object.entries(allTags)) {
            const tagColumn = document.createElement("div");
            tagColumn.className = "tag-column";
            tagColumn.innerHTML = `<strong>${key}</strong>`; // Column title

            tagsSet.forEach(tag => {
                const filterTag = document.createElement("span");
                filterTag.className = "filter-tag";
                filterTag.textContent = tag;
                filterTag.addEventListener("click", () => filterByTag(tag));
                tagColumn.appendChild(filterTag);
            });

            filterTagsContainer.appendChild(tagColumn);
        }
    }

    function filterByTag(tag) {
        currentFilter = tag;
        document.querySelectorAll(".map-item").forEach(item => {
            const matchesTag = item.dataset.type === tag || item.dataset.emprise === tag || item.dataset.siecle === tag;
            item.style.display = matchesTag ? "block" : "none";
        });
    }

    // Reset filter function
    function resetFilter() {
        currentFilter = null;
        document.querySelectorAll(".map-item").forEach(item => {
            item.style.display = "block"; // Show all items
        });
    }

    // Add click event listener for the reset button
    resetFilterButton.addEventListener("click", resetFilter);
});
