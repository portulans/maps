const CSV_PATH = './data/iconographie.csv'; // Replace with actual CSV file path

let allData = [];
let selectedGroups = new Set();

Papa.parse(CSV_PATH, {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: function(results) {
    allData = results.data;
    renderGroupSelector();
    selectFirstGroup();
    renderGallery();
  }
});

function renderGroupSelector() {
  const groupSelector = document.getElementById('groupSelector');
  groupSelector.innerHTML = '';
  const groups = [...new Set(allData.map(row => row.Groupe))].sort();

  groups.forEach((group, index) => {
    const label = document.createElement('label');
    const checkedAttr = index === 0 ? 'checked' : '';
    label.innerHTML = `<input type="checkbox" value="${group}" onchange="toggleGroup(this)" ${checkedAttr}> ${group}<br>`;
    groupSelector.appendChild(label);
    if (index === 0) {
      selectedGroups.add(group);
    }
  });
}

function selectFirstGroup() {
  const firstCheckbox = document.querySelector('#groupSelector input[type="checkbox"]');
  if (firstCheckbox) {
    firstCheckbox.checked = true;
    selectedGroups.add(firstCheckbox.value);
  }
}

function toggleGroup(checkbox) {
  if (checkbox.checked) {
    selectedGroups.add(checkbox.value);
  } else {
    selectedGroups.delete(checkbox.value);
  }
  renderGallery();
}

function renderGallery() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  const filtered = allData.filter(row => selectedGroups.size === 0 || selectedGroups.has(row.Groupe));

  filtered.forEach(item => {
    if (item.Image) {
    const img = document.createElement('img');
    img.src = './img/library/' + item.Institution + '/' + item.Image;
    img.alt = item.Legende;
    img.onclick = () => showModal(item);
    gallery.appendChild(img);
   } else if (!item.Image && item.Num == 'OUI') {
    // If no image is available, use a default image
      const img = document.createElement('img');
      img.src = './img/default.jpg';
      img.alt = item.Legende;
      img.onclick = () => showModal(item);
      gallery.appendChild(img);
    }
  });
}

function showModal(item) {
  document.getElementById('modalImage').src = './img/library/' + item.Institution + '/' + item.Image;
  var contentDiv = document.getElementsByClassName('modal-info')[0];
    contentDiv.innerHTML = ''; // Clear previous content
    if (item.ID) {
        contentDiv.innerHTML += `<p><strong>Identifiant dans l'atlas:</strong> ${item.ID}</p>`;
    }
    if (item.Auteur) {
        contentDiv.innerHTML += `<p><strong>Auteur:</strong> ${item.Auteur}</p>`;
    }
    if (item.Type && item.Nature) {
        contentDiv.innerHTML += `<p><strong>Type de document:</strong> ${item.Type}, ${item.Nature}</p>`;
    } else if (item.Type) {
        contentDiv.innerHTML += `<p><strong>Type de document:</strong> ${item.Type}</p>`;
    } else if (item.Nature) {
        contentDiv.innerHTML += `<p><strong>Type de document:</strong> ${item.Nature}</p>`;
    }

    if (item.Description) {
        contentDiv.innerHTML += `<p><strong>Description:</strong> ${item.Description}</p>`;
    }
    if (item.Legende) {
        contentDiv.innerHTML += `<p><strong>Légende:</strong> ${item.Legende}</p>`;
    }
    if (item.Date && item.Siecle) {
        contentDiv.innerHTML += `<p><strong>Date:</strong> ${item.Date}, ${item.Siecle}</p>`;
    } else if (item.Date) {
        contentDiv.innerHTML += `<p><strong>Date:</strong> ${item.Date}</p>`;
    } else if (item.Siecle) {
        contentDiv.innerHTML += `<p><strong>Date:</strong> ${item.Siecle}</p>`;
    }
    if (item.Ouvrage) {
        contentDiv.innerHTML += `<p><strong>Issu de :</strong> ${item.Ouvrage}</p>`;
    }
    if (item.Cote && item.Collection && item.Detail_institution) {
        contentDiv.innerHTML += `<p><strong>Source: </strong> ${item.Cote} - ${item.Collection} - ${item.Detail_institution}</p>`;
    } else if (item.Cote && item.Detail_institution) {
        contentDiv.innerHTML += `<p><strong>Source: </strong> ${item.Cote} - ${item.Detail_institution}</p>`;
    } else if (item.Detail_institution) {
        contentDiv.innerHTML += `<p><strong>Source: </strong> ${item.Detail_institution}</p>`;
    }

    if (item.Lien_fiche) {
        contentDiv.innerHTML += `<a href='${item.Lien_fiche}' target='_blank'>Voir sur le site source</a>`;
    }

    if (item.Commentaire) {
        contentDiv.innerHTML += `<p><strong>Remarques:</strong> ${item.Commentaire}</p>`;
    }

  //Serach in geojson if item.ID exists
  const geojsonPath = './data/loc-images.geojson';
  fetch(geojsonPath)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      console.log(item.ID);
      // Find the feature with the matching ID cast them as integers
      let feature = data.features.find(feature => parseInt(feature.properties.ID) === parseInt(item.ID));
      if (feature) {
        let coordinates = feature.geometry.coordinates;
        let lat = coordinates[1];
        let lon = coordinates[0];
        contentDiv.innerHTML += `<p><strong>Localisation:</strong></p>`;
        let mapDiv = document.createElement('div');
        mapDiv.id = 'image-map';
        mapDiv.style.width = '100%';
        mapDiv.style.height = '200px';
        contentDiv.appendChild(mapDiv);
        let map = L.map('image-map').setView([lat, lon], 14);
        // Add createDivIcon
        var icon = createRotatedIcon(feature.properties.orientatio, feature.properties.type);
        L.marker([lat, lon], { icon: icon }).addTo(map);
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(map);
      } else {
        contentDiv.innerHTML += `<p><strong>Localisation:</strong> Non renseignée</p>`;
      }
    });

  document.getElementById('imageModal').style.display = 'block';
}

window.onclick = function(event) {
  const modal = document.getElementById('imageModal');
  if (event.target == modal) {
    modal.style.display = "none";
  }
}