document.addEventListener("DOMContentLoaded", function () {
    const mapContainer = document.getElementById("mapContainer");

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
                if (row.IIIF_Manifest && (row.Institution == "BNF" || row.Institution == "SHD")) {
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
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const v2FilterTargets = {
        Auteur: document.getElementById("author-filters"),
        Siecle: document.getElementById("periode-filters"),
        Type: document.getElementById("type-filters"),
        Emprise: document.getElementById("emprise-filters"),
        Georeferencing: document.getElementById("georef-filters")
    };
    const resetFilterV2Button = document.getElementById("resetFilterV2");

    const hasV2Containers = Object.values(v2FilterTargets).every(Boolean);
    if (!hasV2Containers) {
        return;
    }

    const selectedValuesByField = {
        Auteur: new Set(),
        Siecle: new Set(),
        Type: new Set(),
        Emprise: new Set(),
        Georeferencing: new Set()
    };

    const rowsById = new Map();

    function normalizeValue(value) {
        return (value || "").toString().trim();
    }

    function mapGeoreferencingValue(value) {
        return normalizeValue(value).toLowerCase() === "done" ? "Oui" : "Non";
    }

    function getItemId(mapItem) {
        const link = mapItem.querySelector("a.map-link");
        if (!link) {
            return "";
        }
        const href = link.getAttribute("href") || "";
        const match = href.match(/[?&]id=([^&]+)/);
        return match ? decodeURIComponent(match[1]) : "";
    }

    function applyV2Filters() {
        const mapItems = document.querySelectorAll(".map-item");

        mapItems.forEach((mapItem) => {
            const itemId = getItemId(mapItem);
            const row = rowsById.get(itemId);

            if (!row) {
                mapItem.style.display = "none";
                return;
            }

            const matchesAllFields = Object.entries(selectedValuesByField).every(([field, selectedSet]) => {
                if (selectedSet.size === 0) {
                    return true;
                }
                const itemValue = normalizeValue(row[field]);
                return selectedSet.has(itemValue);
            });

            mapItem.style.display = matchesAllFields ? "block" : "none";
        });
    }

    function createCheckboxOption(field, value) {
        const wrapper = document.createElement("label");
        wrapper.style.display = "block";
        wrapper.style.padding = "3px 0";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "filter-v2-checkbox";
        checkbox.dataset.field = field;
        checkbox.value = value;
        checkbox.style.marginRight = "6px";

        checkbox.addEventListener("change", function () {
            const targetSet = selectedValuesByField[field];
            if (checkbox.checked) {
                targetSet.add(value);
            } else {
                targetSet.delete(value);
            }
            applyV2Filters();
        });

        wrapper.appendChild(checkbox);
        wrapper.appendChild(document.createTextNode(value));
        return wrapper;
    }

    function fillDropdown(field, values) {
        const container = v2FilterTargets[field];
        if (!container) {
            return;
        }

        container.innerHTML = "";
        values.forEach((value) => {
            container.appendChild(createCheckboxOption(field, value));
        });
    }

    function resetV2Filters() {
        Object.values(selectedValuesByField).forEach((selectedSet) => selectedSet.clear());
        document.querySelectorAll(".filter-v2-checkbox:checked").forEach((checkbox) => {
            checkbox.checked = false;
        });
        applyV2Filters();
    }

    if (resetFilterV2Button) {
        resetFilterV2Button.addEventListener("click", resetV2Filters);
    }

    Papa.parse("maps.csv", {
        download: true,
        header: true,
        complete: function (results) {
            const catalogueRows = (results.data || []).filter((row) => row.Display_on_catalogue === "TRUE");

            const uniqueValues = {
                Auteur: new Set(),
                Siecle: new Set(),
                Type: new Set(),
                Emprise: new Set(),
                Georeferencing: new Set()
            };

            catalogueRows.forEach((row) => {
                const id = normalizeValue(row.ID);
                if (!id) {
                    return;
                }

                const normalizedRow = {
                    Auteur: normalizeValue(row.Auteur),
                    Siecle: normalizeValue(row.Siecle),
                    Type: normalizeValue(row.Type),
                    Emprise: normalizeValue(row.Emprise),
                    Georeferencing: mapGeoreferencingValue(row.Georeferencing)
                };

                rowsById.set(id, normalizedRow);

                Object.entries(normalizedRow).forEach(([field, value]) => {
                    if (value) {
                        uniqueValues[field].add(value);
                    }
                });
            });

            Object.entries(uniqueValues).forEach(([field, values]) => {
                const sortedValues = Array.from(values).sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));
                fillDropdown(field, sortedValues);
            });
        }
    });
});
