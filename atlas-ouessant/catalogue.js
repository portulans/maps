document.addEventListener("DOMContentLoaded", function () {
    let allTags = { Type: new Set(), Emprise: new Set(), Siecle: new Set() };
    const mapContainer = document.getElementById("mapContainer");
    const filterTagsContainer = document.getElementById("filterTagsContainer");
    const resetFilterButton = document.getElementById("resetFilter");
    let currentFilter = null; // Track current active filter

    Papa.parse("maps.csv", {
        download: true,
        header: true,
        complete: function(results) {

            const data = results.data.filter(row => row.Display_on_catalogue == 'TRUE');
            const waiting = results.data.filter(row => row.Display_on_catalogue == 'FALSE');
            const ignore = results.data.filter(row => row.Display_on_catalogue == 'IGNORE');

            //Count the number of item and display it in a div nae "count-item"
            const countItem = document.getElementById("count-items");
            //add class "paragraph" to element "count-items"
            countItem.className = "paragraph";
            if (waiting.length == 0) {
                countItem.innerHTML = '<b>' + data.length + '</b> images sont listées sur cette page.';
            } else if (waiting.length == 1) {
                countItem.innerHTML = '<b>' + data.length + '</b> images sont listées sur cette page. <span style="color:#2e7a99;">' + waiting.length + " image appaîtra prochainement.</span>";
            } else {
                countItem.innerHTML = '<b>' + data.length + '</b> images sont listées sur cette page. <span style="color:#2e7a99;">' + waiting.length + " images appaîtront prochainement.</span>";
            }
            //

            // Display maps and collect all unique tags
            data.forEach(row => {
                const mapItem = document.createElement("div");
                mapItem.className = "map-item";
                mapItem.dataset.type = row.Type;
                mapItem.dataset.emprise = row.Emprise;
                mapItem.dataset.siecle = row.Siecle;
                
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
                if (row.Auteur && row.Date_Publication) {
                    mapAuthor.textContent = `${row.Date_Publication} | ${row.Auteur}`;
                } else if (row.Auteur && row.Date_Création) {
                    mapAuthor.textContent = `${row.Date_Création} | ${row.Auteur}`;
                } else if (row.Auteur && !row.Date_Création && !row.Date_Publication) {
                    mapAuthor.textContent = `${row.Auteur}`;
                } else if (!row.Auteur && row.Date_Publication) {
                    mapAuthor.textContent = `${row.Date_Création}`;
                } else if (!row.Auteur && row.Date_Création) {
                    mapAuthor.textContent = `${row.Date_Création}`;
                }

                mapDetails.appendChild(mapTitle);
                mapDetails.appendChild(mapAuthor);

                // Add tags and populate allTags
                const tagsContainer = document.createElement("div");
                tagsContainer.className = "tags";

                const tags = { Type: row.Type, Emprise: row.Emprise, Siecle: row.Siecle };
                for (const [key, value] of Object.entries(tags)) {
                    if (value) {
                        const tagElement = document.createElement("span");
                        tagElement.className = `tag tag-${key.toLowerCase()}`;
                        tagElement.textContent = value;
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

        /*Create a drop down list for each tag type. Each elem of the list has to have a checkbox to allow multicriteria filtering*/
        for (const [key, values] of Object.entries(allTags)) {
            const filterTag = document.createElement("div");
            filterTag.className = "filter-tag";

            const filterTagTitle = document.createElement("div");
            filterTagTitle.className = "filter-tag-title";
            if (key === "Siecle") {
                filterTagTitle.textContent = "Siècle";
            } else {
                filterTagTitle.textContent = key;
            }

            const filterTagList = document.createElement("div");
            filterTagList.className = "filter-tag-list";

            values.forEach(value => {
                const filterTagItem = document.createElement("div");
                filterTagItem.className = "filter-tag-item";

                const filterTagCheckbox = document.createElement("input");
                filterTagCheckbox.type = "checkbox";
                filterTagCheckbox.className = "filter-tag-checkbox";
                filterTagCheckbox.id = `${key}-${value}`;
                filterTagCheckbox.value = value;
                /*if (key == "Type" && value != "Plan") {
                    filterTagCheckbox.checked = true;
                }*/
                filterTagCheckbox.addEventListener("change", () => filterByTag(key, value));

                const filterTagLabel = document.createElement("label");
                filterTagLabel.htmlFor = `${key}-${value}`;
                filterTagLabel.textContent = value;

                filterTagItem.appendChild(filterTagCheckbox);
                filterTagItem.appendChild(filterTagLabel);
                filterTagList.appendChild(filterTagItem);
            });

            filterTag.appendChild(filterTagTitle);
            filterTag.appendChild(filterTagList);
            filterTagsContainer.appendChild(filterTag);
        }
            
    }

    
    function filterByTag(key, value) {
        // Filter function : on check or unchecked, hide or show the map-item that match the filters. 
        // Items ckecked in the same category are combined with OR, items checked in different categories are combined with AND
        // If no item match the filter, display a message
        const filterItems = document.querySelectorAll(".filter-tag-checkbox:checked");
        const filterValues = Array.from(filterItems).map(item => item.value);
        const filterKeys = Array.from(filterItems).map(item => item.id.split("-")[0]);

        // Filter items
        document.querySelectorAll(".map-item").forEach(item => {
            const itemTags = {
                Type: item.dataset.type,
                Emprise: item.dataset.emprise,
                Siecle: item.dataset.siecle
            };

            const match = filterKeys.every(key => filterValues.includes(itemTags[key]));
            if (match) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });

        // Update the current filter
        currentFilter = { key, value };
    }

    // Reset filter function
    function resetFilter() {
        currentFilter = null;
        document.querySelectorAll(".map-item").forEach(item => {
            item.style.display = "block"; // Show all items
        });
        //Uncheck all checkboxes
        document.querySelectorAll(".filter-tag-checkbox:checked").forEach(checkbox => {
            checkbox.checked = false;
        });
    }

    // Add click event listener for the reset button
    resetFilterButton.addEventListener("click", resetFilter);

});
