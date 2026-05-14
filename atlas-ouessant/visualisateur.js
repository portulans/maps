var map = L.map('mapviz',{
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    },
}).setView([48.46, -5.08], 13);

/******** VECTOR LAYERS **********/

var url_moulins = 'data/moulins.geojson';
var url_lavoirs = 'data/lavoirs_fontaines.geojson';
var featurePanelContent = document.getElementById('feature-panel-content');
var suppressNextMapReset = false;
var lavoirsPanelRequestToken = 0;
var moulinsPanelRequestToken = 0;
var lavoirsImageCreditsByName = new Map();
var lavoirsImageById = new Map();
var lavoirsCreditsPromise = null;
var moulinsImageCreditsByName = new Map();
var moulinsImageById = new Map();
var moulinsCreditsPromise = null;

const LAVOIRS_IMAGES_BASE_PATH = './img/library/Terrain/lavoirs_et_fontaines';
const LAVOIRS_CREDITS_PATH = LAVOIRS_IMAGES_BASE_PATH + '/credits.json';
const MOULINS_IMAGES_BASE_PATH = './img/library/Terrain/moulins';
const MOULINS_CREDITS_PATH = MOULINS_IMAGES_BASE_PATH + '/credits.json';
const LAVOIRS_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const MOULINS_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const MAX_LAVOIRS_NUMBERED_IMAGES = 12;
const MAX_MOULINS_NUMBERED_IMAGES = 12;
var lavoirsStyleMode = 'precision';
var moulinsStyleMode = 'type';
var moulinsSourceData = null;

const MOULINS_GROUPS = {
    petits_xix: 'Petits moulins construits au 19ème siècle',
    grands_1842: 'Grands moulins existants en 1842',
    autres: '18ème siècle, disp. avant 1842'
};

var moulinsGroupVisibility = {
    petits_xix: true,
    grands_1842: true,
    autres: false
};

const LAVOIRS_STYLE_LEGENDS = {
    precision: [
        { label: 'Exacte', color: '#0b7a75' },
        { label: 'Affinée', color: '#3f9d68' },
        { label: 'Approximative', color: '#d8a021' },
        { label: 'Très imprécise', color: '#c95d3a' },
        { label: 'Inconnue', color: '#7b8790' }
    ],
    statut: [
        { label: 'Existant', color: '#007f73' },
        { label: 'À déterminer', color: '#ca6a2a' },
        { label: 'Détruit / traces', color: '#8f3b2c' },
        { label: 'Autre / inconnu', color: '#7b8790' }
    ],
    type: [
        { label: 'Lavoir', color: '#2f6f95' },
        { label: 'Fontaine', color: '#3f9d68' },
        { label: 'Lavoir et fontaine', color: '#7a5a9c' },
        { label: 'Lavoir en bordure de grève', color: '#c95d3a' },
        { label: 'Inconnu', color: '#7b8790' }
    ]
};

function extractFirstYear(value) {
    const text = safeText(value, '');
    const match = text.match(/(1[0-9]{3}|20[0-9]{2})/);
    return match ? Number(match[1]) : null;
}

function moulinGroupKeyFromProperties(props) {
    const type = normalizeText(props.type);
    const year = extractFirstYear(props.date_const);
    const existsIn1842 = props.cad1842 == 1;

    if (type === 'petit' && year !== null && year >= 1800 && year <= 1899) {
        return 'petits_xix';
    }

    if (type === 'grand' && existsIn1842) {
        return 'grands_1842';
    }

    return 'autres';
}

function shouldDisplayMoulinFeature(feature) {
    const props = feature && feature.properties ? feature.properties : {};
    const groupKey = moulinGroupKeyFromProperties(props);
    return Boolean(moulinsGroupVisibility[groupKey]);
}

function safeText(value, fallback) {
    if (value === null || value === undefined) {
        return fallback || '';
    }
    const text = String(value).trim();
    return text || (fallback || '');
}

function escapeHtml(value) {
    return safeText(value, '').replace(/[&<>"']/g, function (char) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char];
    });
}

function toYesNo(value) {
    if (value === true) {
        return 'Oui';
    }
    if (value === false) {
        return 'Non';
    }
    const normalized = safeText(value, '').toLowerCase();
    if (normalized === 'true' || normalized === '1' || normalized === 'oui') {
        return 'Oui';
    }
    if (normalized === 'false' || normalized === '0' || normalized === 'non') {
        return 'Non';
    }
    return safeText(value, 'Non renseigné');
}

function normalizeText(value) {
    return safeText(value, '').toLowerCase();
}

function colorByPrecision(value) {
    const normalized = normalizeText(value);
    if (normalized.indexOf('exact') !== -1) return '#0b7a75';
    if (normalized.indexOf('affin') !== -1) return '#3f9d68';
    if (normalized.indexOf('approx') !== -1) return '#d8a021';
    if (normalized.indexOf('très') !== -1 || normalized.indexOf('tres') !== -1) return '#c95d3a';
    return '#7b8790';
}

function colorByStatut(value) {
    const normalized = normalizeText(value);
    if (normalized.indexOf('detruit') !== -1 || normalized.indexOf('détruit') !== -1 || normalized.indexOf('ruine') !== -1 || normalized.indexOf('traces') !== -1) {
        return '#8f3b2c';
    }
    if (normalized.indexOf('a déterminer') !== -1 || normalized.indexOf('à déterminer') !== -1 || normalized.indexOf('incertain') !== -1) {
        return '#ca6a2a';
    }
    if (normalized.indexOf('existant') !== -1 || normalized.indexOf('entretenu') !== -1 || normalized.indexOf('en état') !== -1 || normalized.indexOf('renové') !== -1 || normalized.indexOf('rénové') !== -1) {
        return '#007f73';
    }
    return '#7b8790';
}

function colorByType(value) {
    const normalized = normalizeText(value);
    if (normalized === 'fontaine') return '#3f9d68';
    if (normalized === 'lavoir') return '#2f6f95';
    if (normalized === 'lavoir_fontaine') return '#7a5a9c';
    if (normalized === 'lavoir en bordure de greve') return '#c95d3a';
    return '#7b8790';
}

function getLavoirsMarkerStyle(feature, mode) {
    const props = feature && feature.properties ? feature.properties : {};
    let color = '#7b8790';

    if (mode === 'type') {
        color = colorByType(props.type);
    } else if (mode === 'statut') {
        color = colorByStatut(props.statut);
    } else {
        color = colorByPrecision(props.modif_geom);
    }

    return {
        radius: 7,
        fillOpacity: 0.85,
        color: '#172328',
        fillColor: color,
        weight: 1.2
    };
}

function applyLavoirsStyleMode(mode) {
    lavoirsStyleMode = mode;
    if (!lavoirs_fontaines) {
        return;
    }

    lavoirs_fontaines.eachLayer(function (layer) {
        if (layer && layer.feature && typeof layer.setStyle === 'function') {
            layer.setStyle(getLavoirsMarkerStyle(layer.feature, lavoirsStyleMode));
        }
    });
}

function isOverlayVisible(layer) {
    const isVisible = Boolean(layer && map && map.hasLayer(layer));
    return isVisible;
}

function getMoulinsOverlayLayer() {
    return moulinsCluster || moulins;
}

function renderLavoirsLegendRow() {
    const entries = LAVOIRS_STYLE_LEGENDS[lavoirsStyleMode] || [];
    let symbolsHtml = '';

    entries.forEach(function (entry) {
        symbolsHtml += '<span class="legend-item">' +
            '<span class="legend-swatch" style="background:' + entry.color + ';"></span>' +
            '<span>' + escapeHtml(entry.label) + '</span>' +
            '</span>';
    });

    return '<div class="legend-layer-row">' +
        '<span class="legend-layer-title">Lavoirs et fontaines</span>' +
        '<span class="legend-layer-symbols">' + symbolsHtml + '</span>' +
        '<label class="legend-style-inline-label" for="lavoirs-style-mode">Coloration :</label>' +
        '<select id="lavoirs-style-mode" class="legend-style-select legend-style-select--inline">' +
            '<option value="type">Type</option>' +
            '<option value="precision">Précision géométrique</option>' +
            '<option value="statut">Statut</option>' +
        '</select>' +
    '</div>';
}

function getMoulinsMarkerIcon(feature, mode) {
    const props = feature && feature.properties ? feature.properties : {};
    const type = normalizeText(props.type);

    if (mode === 'type') {
        let icon = '';
        let iconSize = [10, 10];
        if (type === 'grand') {
            icon = 'img/grand-moulin.svg';
            iconSize = [20, 20];
        } else if (type === 'petit') {
            icon = 'img/petit-moulin.svg';
            iconSize = [12, 12];
        } else {
            icon = 'img/moulin-inconnu.png';
            iconSize = [10, 10];
            options = {
                opacity : 0.7
            }
        }
        return L.icon({
            iconUrl: icon,
            iconSize: iconSize,
            
        });
    }

    const color = mode === 'precision'
        ? colorByPrecision(props.precision_geom || props.modif_geom)
        : colorByStatut(props.statut);

    return L.divIcon({
        className: 'moulin-square-icon-wrapper',
        html: '<span class="moulin-square-icon" style="background:' + color + ';"></span>',
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    });
}

function applyMoulinsStyleMode(mode) {
    moulinsStyleMode = mode;
    if (!moulins) {
        return;
    }

    moulins.eachLayer(function (layer) {
        if (layer && layer.feature && typeof layer.setIcon === 'function') {
            layer.setIcon(getMoulinsMarkerIcon(layer.feature, moulinsStyleMode));
        }
    });

    if (moulinsCluster && typeof moulinsCluster.refreshClusters === 'function') {
        moulinsCluster.refreshClusters();
    }
}

function refreshMoulinsLayer() {
    if (!moulins || !moulinsSourceData) {
        return;
    }

    moulins.clearLayers();
    moulins.addData(moulinsSourceData);
    moulinsCluster.clearLayers();
    moulinsCluster.addLayer(moulins);
    applyMoulinsStyleMode(moulinsStyleMode);
}

function renderMoulinsLegendRow() {
    let symbolsHtml = '';

    if (moulinsStyleMode === 'type') {
        symbolsHtml += '<span class="legend-item"><img src="img/grand-moulin.svg" alt="Grand moulin" class="legend-icon"><span>Grand moulin</span></span>';
        symbolsHtml += '<span class="legend-item"><img src="img/petit-moulin.svg" alt="Petit moulin" class="legend-icon"><span>Petit moulin</span></span>';
    } else {
        const entries = LAVOIRS_STYLE_LEGENDS[moulinsStyleMode] || [];
        entries.forEach(function (entry) {
            symbolsHtml += '<span class="legend-item">' +
                '<span class="legend-swatch legend-swatch--square" style="background:' + entry.color + ';"></span>' +
                '<span>' + escapeHtml(entry.label) + '</span>' +
                '</span>';
        });
    }

    return '<div class="legend-layer-row">' +
        '<span class="legend-layer-title">Moulins</span>' +
        '<span class="legend-layer-symbols">' + symbolsHtml + '</span>' +
        '<label class="legend-style-inline-label" for="moulins-style-mode">Coloration :</label>' +
        '<select id="moulins-style-mode" class="legend-style-select legend-style-select--inline">' +
            '<option value="type">Type</option>' +
            '<option value="precision">Précision géométrique</option>' +
            '<option value="statut">Statut</option>' +
        '</select>' +
        '<details class="legend-group-details">' +
            '<summary>Groupes</summary>' +
            '<label class="legend-group-option"><input type="checkbox" name="moulins-group" value="petits_xix"' + (moulinsGroupVisibility.petits_xix ? ' checked' : '') + '> ' + MOULINS_GROUPS.petits_xix + '</label>' +
            '<label class="legend-group-option"><input type="checkbox" name="moulins-group" value="grands_1842"' + (moulinsGroupVisibility.grands_1842 ? ' checked' : '') + '> ' + MOULINS_GROUPS.grands_1842 + '</label>' +
            '<label class="legend-group-option"><input type="checkbox" name="moulins-group" value="autres"' + (moulinsGroupVisibility.autres ? ' checked' : '') + '> ' + MOULINS_GROUPS.autres + '</label>' +
        '</details>' +
    '</div>';
}

function renderLieuxDitsLegendRow() {
    return '<div class="legend-layer-row">' +
        '<span class="legend-layer-title">Lieux-dits</span>' +
        '<span class="legend-layer-symbols">' +
            '<span class="legend-item"><span class="legend-polygon-swatch"></span><span>Emprise de lieu-dit</span></span>' +
        '</span>' +
    '</div>';
}

function renderMapLegendPanel() {
    const legendContainer = document.getElementById('lavoirs-map-legend');
    if (!legendContainer) {
        console.warn('Legend container not found');
        return;
    }

    const rows = [];
    if (isOverlayVisible(lavoirs_fontaines)) {
        rows.push(renderLavoirsLegendRow());
    }
    if (isOverlayVisible(getMoulinsOverlayLayer())) {
        rows.push(renderMoulinsLegendRow());
    }
    if (isOverlayVisible(lieux_dits)) {
        rows.push(renderLieuxDitsLegendRow());
    }

    if (!rows.length) {
        legendContainer.innerHTML =
            '<h4>Légende des couches visibles</h4>' +
            '<p class="legend-empty">Activez une couche thématique pour afficher sa légende.</p>';
        return;
    }

    legendContainer.innerHTML =
        '<h4>Légende des couches visibles</h4>' +
        '<div class="legend-content">' + rows.join('') + '</div>';

    const select = document.getElementById('lavoirs-style-mode');
    if (select && isOverlayVisible(lavoirs_fontaines)) {
        select.value = lavoirsStyleMode;
        select.addEventListener('change', function (event) {
            applyLavoirsStyleMode(event.target.value);
            renderMapLegendPanel();
        });
    }

    const moulinModeSelect = document.getElementById('moulins-style-mode');
    if (moulinModeSelect && isOverlayVisible(getMoulinsOverlayLayer())) {
        moulinModeSelect.value = moulinsStyleMode;
        moulinModeSelect.addEventListener('change', function (event) {
            applyMoulinsStyleMode(event.target.value);
            renderMapLegendPanel();
        });
    }

    const moulinGroupToggles = legendContainer.querySelectorAll('input[name="moulins-group"]');
    moulinGroupToggles.forEach(function (checkbox) {
        checkbox.addEventListener('change', function (event) {
            const groupKey = safeText(event.target.value, '');
            if (groupKey && Object.prototype.hasOwnProperty.call(moulinsGroupVisibility, groupKey)) {
                moulinsGroupVisibility[groupKey] = Boolean(event.target.checked);
                refreshMoulinsLayer();
                renderMapLegendPanel();
            }
        });
    });
}

function imageNameFromUrl(url) {
    const cleanUrl = safeText(url, '').split('?')[0].split('#')[0];
    const parts = cleanUrl.split('/');
    return decodeURIComponent(parts[parts.length - 1] || '').toLowerCase();
}

function captionTextFromUrl(url) {
    const imageName = imageNameFromUrl(url);
    const credit = lavoirsImageCreditsByName.get(imageName);
    if (!credit) {
        return '';
    }

    const author = safeText(credit.author, '');
    const date = safeText(credit.date, '');
    if (author && date) {
        return author + ' - ' + date;
    }
    return author || date;
}

function captionTextFromMoulinsUrl(url) {
    const imageName = imageNameFromUrl(url);
    const credit = moulinsImageCreditsByName.get(imageName);
    if (!credit) {
        return '';
    }

    const author = safeText(credit.author, '');
    const date = safeText(credit.date, '');
    if (author && date) {
        return author + ' - ' + date;
    }
    return author || date;
}

function probeImage(url) {
    return new Promise(function (resolve) {
        const image = new Image();
        image.onload = function () { resolve(true); };
        image.onerror = function () { resolve(false); };
        image.src = url;
    });
}

function firstExistingImageUrl(basePath) {
    const candidates = LAVOIRS_IMAGE_EXTENSIONS.map(function (extension) {
        return basePath + '.' + extension;
    });

    return Promise.all(candidates.map(function (url) {
        return probeImage(url);
    })).then(function (checks) {
        const foundIndex = checks.findIndex(Boolean);
        return foundIndex >= 0 ? candidates[foundIndex] : null;
    });
}

function resolveLavoirsImageUrls(identifiers) {
    const ids = Array.isArray(identifiers) ? identifiers : [identifiers];
    const uniqueIds = Array.from(new Set(ids.map(function (value) {
        return safeText(value, '');
    }).filter(Boolean)));

    if (!uniqueIds.length) {
        return Promise.resolve([]);
    }

    const urlsFromCredits = [];
    uniqueIds.forEach(function (idValue) {
        const imageName = lavoirsImageById.get(idValue);
        if (imageName) {
            urlsFromCredits.push(LAVOIRS_IMAGES_BASE_PATH + '/' + encodeURIComponent(imageName));
        }
    });

    const basePaths = [];
    uniqueIds.forEach(function (idValue) {
        const encodedId = encodeURIComponent(idValue);
        basePaths.push(LAVOIRS_IMAGES_BASE_PATH + '/' + encodedId);
        for (let index = 1; index <= MAX_LAVOIRS_NUMBERED_IMAGES; index += 1) {
            basePaths.push(LAVOIRS_IMAGES_BASE_PATH + '/' + encodedId + '-' + index);
        }
    });

    return Promise.all(basePaths.map(function (basePath) {
        return firstExistingImageUrl(basePath);
    })).then(function (resolvedUrls) {
        const combinedUrls = urlsFromCredits.concat(resolvedUrls.filter(Boolean));
        return Array.from(new Set(combinedUrls));
    });
}

function resolveMoulinsImageUrls(identifiers) {
    const ids = Array.isArray(identifiers) ? identifiers : [identifiers];
    const uniqueIds = Array.from(new Set(ids.map(function (value) {
        return safeText(value, '');
    }).filter(Boolean)));

    if (!uniqueIds.length) {
        return Promise.resolve([]);
    }

    const urlsFromCredits = [];
    uniqueIds.forEach(function (idValue) {
        const imageName = moulinsImageById.get(idValue);
        if (imageName) {
            urlsFromCredits.push(MOULINS_IMAGES_BASE_PATH + '/' + encodeURIComponent(imageName));
        }
    });

    const basePaths = [];
    uniqueIds.forEach(function (idValue) {
        const encodedId = encodeURIComponent(idValue);
        basePaths.push(MOULINS_IMAGES_BASE_PATH + '/' + encodedId);
        for (let index = 1; index <= MAX_MOULINS_NUMBERED_IMAGES; index += 1) {
            basePaths.push(MOULINS_IMAGES_BASE_PATH + '/' + encodedId + '-' + index);
        }
    });

    return Promise.all(basePaths.map(function (basePath) {
        return firstExistingImageUrl(basePath);
    })).then(function (resolvedUrls) {
        const combinedUrls = urlsFromCredits.concat(resolvedUrls.filter(Boolean));
        return Array.from(new Set(combinedUrls));
    });
}

function loadLavoirsImageCredits() {
    if (lavoirsCreditsPromise) {
        return lavoirsCreditsPromise;
    }

    lavoirsCreditsPromise = fetch(LAVOIRS_CREDITS_PATH)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Erreur HTTP ' + response.status);
            }
            return response.json();
        })
        .then(function (entries) {
            if (!Array.isArray(entries)) {
                return;
            }

            entries.forEach(function (entry) {
                const imageName = safeText(entry && entry.img, '').toLowerCase();
                const imageId = safeText(entry && entry.id, '');
                if (!imageName) {
                    return;
                }
                lavoirsImageCreditsByName.set(imageName, {
                    author: safeText(entry && entry.author, ''),
                    date: safeText(entry && entry.date, '')
                });
                if (imageId) {
                    lavoirsImageById.set(imageId, imageName);
                }
            });
        })
        .catch(function (error) {
            console.warn('Impossible de charger les crédits images des lavoirs et fontaines', error);
        });

    return lavoirsCreditsPromise;
}

function loadMoulinsImageCredits() {
    if (moulinsCreditsPromise) {
        return moulinsCreditsPromise;
    }

    moulinsCreditsPromise = fetch(MOULINS_CREDITS_PATH)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Erreur HTTP ' + response.status);
            }
            return response.json();
        })
        .then(function (entries) {
            if (!Array.isArray(entries)) {
                return;
            }

            entries.forEach(function (entry) {
                const imageName = safeText(entry && entry.img, '').toLowerCase();
                const imageId = safeText(entry && entry.id, '');
                if (!imageName) {
                    return;
                }
                moulinsImageCreditsByName.set(imageName, {
                    author: safeText(entry && entry.author, ''),
                    date: safeText(entry && entry.date, '')
                });
                if (imageId) {
                    moulinsImageById.set(imageId, imageName);
                }
            });
        })
        .catch(function (error) {
            console.warn('Impossible de charger les crédits images des moulins', error);
        });

    return moulinsCreditsPromise;
}

function buildLavoirsPanelContent(properties, imageUrls, loadingImages) {
    const props = properties || {};
    const typeLabel = safeText(props.type, 'inconnu');
    const title = safeText(props.nom, 'Nom non renseigné (' + typeLabel + ')');
    const pointId = safeText(props.Id, 'Non renseigné');
    const altName = safeText(props['alt-name'], 'Aucun nom alternatif');

    let content = '<div class="panel-header">';
    content += '<p class="feature-type">' + escapeHtml(typeLabel) + '</p>';
    content += '</div>';
    content += '<h3 class="feature-title">' + escapeHtml(title) + '</h3>';
    content += '<p class="muted feature-subtitle">' + escapeHtml(altName) + '</p>';
    content += '<dl class="feature-meta">';
    content += '<dt>Identifiant</dt><dd>' + escapeHtml(pointId) + '</dd>';
    content += '<dt>Statut</dt><dd>' + escapeHtml(safeText(props.statut, 'Non renseigné')) + '</dd>';
    content += '<dt>Précision des coordonnées</dt><dd>' + escapeHtml(safeText(props.modif_geom, 'Non renseigné')) + '</dd>';
    content += '<dt>Source</dt><dd>' + escapeHtml(safeText(props.source, 'Non renseigné')) + '</dd>';
    content += '<dt>Trace sur le plan de 1910 ?</dt><dd>' + escapeHtml(toYesNo(props.src_p1910)) + '</dd>';
    content += '<dt>Trace sur le cadastre de 1842 ?</dt><dd>' + escapeHtml(toYesNo(props.src_c1842)) + '</dd>';
    content += '</dl>';

    const description = safeText(props.description, '');
    const comment = safeText(props.commentaire_st, '');

    if (description) {
        content += '<p class="feature-description">Description : ' + escapeHtml(description) + '</p>';
    }
    if (comment) {
        content += '<p class="feature-comment">Commentaire : ' + escapeHtml(comment) + '</p>';
    }

    if (loadingImages) {
        content += '<div class="feature-images is-visible is-loading">';
        content += '<p class="feature-images__title">Images</p>';
        content += '<p class="feature-images__loading" role="status" aria-live="polite">';
        content += '<span class="feature-images__spinner" aria-hidden="true"></span>';
        content += 'Chargement des images...';
        content += '</p>';
        content += '</div>';
        return content;
    }

    if (imageUrls && imageUrls.length) {
        content += '<div class="feature-images is-visible">';
        content += '<p class="feature-images__title">' + (imageUrls.length > 1 ? 'Images' : 'Image') + '</p>';
        imageUrls.forEach(function (url, index) {
            const captionText = captionTextFromUrl(url);
            const imageAlt = imageUrls.length > 1
                ? 'Illustration ' + (index + 1) + ' du point ' + pointId
                : 'Illustration du point ' + pointId;

            content += '<figure class="feature-images__item">';
            content += '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener">';
            content += '<img src="' + escapeHtml(url) + '" alt="' + escapeHtml(imageAlt) + '" loading="lazy">';
            content += '</a>';
            if (captionText) {
                content += '<figcaption class="feature-images__caption">' + escapeHtml(captionText) + '</figcaption>';
            }
            content += '</figure>';
        });
        content += '</div>';
    }

    return content;
}

function buildMoulinsPanelContent(properties, imageUrls, loadingImages) {
    const props = properties || {};
    const typeLabel = safeText(props.type, 'moulin');
    const title = safeText(props.nom, 'Nom non renseigné (' + typeLabel + ')');
    const pointId = safeText(props.fid, 'Non renseigné');

    let content = '<div class="panel-header">';
    content += '<p class="feature-type">' + escapeHtml(typeLabel + ' moulin') + '</p>';
    content += '</div>';
    content += '<h3 class="feature-title">' + escapeHtml(title) + '</h3>';
    content += '<dl class="feature-meta">';
    content += '<dt>Identifiant</dt><dd>' + escapeHtml(pointId) + '</dd>';
    
    if (props.date_const) {
        content += '<dt>Date de construction</dt><dd>' + escapeHtml(safeText(props.date_const, 'Non renseigné')) + '</dd>';
    }
    if (props.date_arret) {
        content += '<dt>Date de mise à l\'arrêt</dt><dd>' + escapeHtml(safeText(props.date_arret, 'Non renseigné')) + '</dd>';
    }
    if (props.date_dem) {
        content += '<dt>Date de démolition</dt><dd>' + escapeHtml(safeText(props.date_dem, 'Non renseigné')) + '</dd>';
    }
    
    let statutLabel = 'Non renseigné';
    if (props.statut === 'existant') {
        statutLabel = 'Non';
    } else if (props.statut === 'détruit') {
        statutLabel = 'Oui' + (props.renove === 1 ? ' (rénové)' : ' (en ruines)');
    } else if (props.statut === 'à déterminer') {
        statutLabel = 'Vérification terrain nécessaire';
    }
    content += '<dt>Existant</dt><dd>' + escapeHtml(statutLabel) + '</dd>';
    content += '</dl>';

    if (loadingImages) {
        content += '<div class="feature-images is-visible is-loading">';
        content += '<p class="feature-images__title">Images</p>';
        content += '<p class="feature-images__loading" role="status" aria-live="polite">';
        content += '<span class="feature-images__spinner" aria-hidden="true"></span>';
        content += 'Chargement des images...';
        content += '</p>';
        content += '</div>';
        return content;
    }

    if (imageUrls && imageUrls.length) {
        content += '<div class="feature-images is-visible">';
        content += '<p class="feature-images__title">' + (imageUrls.length > 1 ? 'Images' : 'Image') + '</p>';
        imageUrls.forEach(function (url, index) {
            const captionText = captionTextFromMoulinsUrl(url);
            const imageAlt = imageUrls.length > 1
                ? 'Illustration ' + (index + 1) + ' du point ' + pointId
                : 'Illustration du point ' + pointId;

            content += '<figure class="feature-images__item">';
            content += '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener">';
            content += '<img src="' + escapeHtml(url) + '" alt="' + escapeHtml(imageAlt) + '" loading="lazy">';
            content += '</a>';
            if (captionText) {
                content += '<figcaption class="feature-images__caption">' + escapeHtml(captionText) + '</figcaption>';
            }
            content += '</figure>';
        });
        content += '</div>';
    }

    return content;
}

function renderLavoirsPanelContent(properties, requestToken) {
    const props = properties || {};
    const pointId = safeText(props.Id, '');
    const fallbackPointId = safeText(props.fid, '');
    const candidateIds = [pointId, fallbackPointId].filter(Boolean);

    if (!candidateIds.length) {
        updateFeaturePanel(buildLavoirsPanelContent(props, [], false));
        return;
    }

    Promise.all([
        loadLavoirsImageCredits(),
        resolveLavoirsImageUrls(candidateIds)
    ]).then(function (results) {
        if (requestToken !== lavoirsPanelRequestToken) {
            return;
        }
        const imageUrls = results[1] || [];
        updateFeaturePanel(buildLavoirsPanelContent(props, imageUrls, false));
    });
}

function renderMoulinsPanelContent(properties, requestToken) {
    const props = properties || {};
    const pointId = safeText(props.fid, '');
    const candidateIds = [pointId].filter(Boolean);

    if (!candidateIds.length) {
        updateFeaturePanel(buildMoulinsPanelContent(props, [], false));
        return;
    }

    Promise.all([
        loadMoulinsImageCredits(),
        resolveMoulinsImageUrls(candidateIds)
    ]).then(function (results) {
        if (requestToken !== moulinsPanelRequestToken) {
            return;
        }
        const imageUrls = results[1] || [];
        updateFeaturePanel(buildMoulinsPanelContent(props, imageUrls, false));
    });
}

function updateFeaturePanel(content) {
    if (featurePanelContent) {
        featurePanelContent.innerHTML = content;
    }
}

function resetFeaturePanel() {
    updateFeaturePanel('<p>Cliquez sur un élément de la carte pour afficher ses informations ici.</p>');
}

function handleFeatureClick(e, content) {
    suppressNextMapReset = true;
    if (e && e.originalEvent) {
        L.DomEvent.stopPropagation(e.originalEvent);
        if (e.originalEvent.preventDefault) {
            e.originalEvent.preventDefault();
        }
    }
    updateFeaturePanel(content);
}

function onEachFeatureMoulins(feature,layer){
    if (feature.properties.nom != null){
        var tooltip = feature.properties.nom
    }
    layer.bindTooltip(tooltip,{
         permanent: false,
         direction: "center",
    })

    layer.on('click', function (e) {
        moulinsPanelRequestToken += 1;
        const requestToken = moulinsPanelRequestToken;
        handleFeatureClick(e, buildMoulinsPanelContent(feature.properties, [], true));
        renderMoulinsPanelContent(feature.properties, requestToken);
    });
 }

var moulins = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: getMoulinsMarkerIcon(feature, moulinsStyleMode)
        });
    },
    onEachFeature:onEachFeatureMoulins,
    filter: function (feature, layer) {
        return shouldDisplayMoulinFeature(feature);
    }
}); 

var moulinsCluster = L.markerClusterGroup({
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    spiderfyOnMaxZoom: true,
    maxClusterRadius: 1
});
    
 $.getJSON(url_moulins, function(data) {
    moulinsSourceData = data;
    refreshMoulinsLayer();
});

function createPrecisionCircleMarker(feature, latlng) {
    let markerOptions = {
        radius: 8,
        fillOpacity: 0.8,
        color: 'black',
        fillColor: 'red',
        weight: 1,
    };

    //Adjust color based on precision
    if (feature.properties.modif_geom === 'exacte') {
        markerOptions.fillColor = 'green';
    } else if (feature.properties.modif_geom === 'affinée') {
        markerOptions.fillColor = 'orange';
    } else {
        markerOptions.fillColor = 'red';
    }
    return L.circleMarker(latlng, markerOptions);
}

function createLavoirCircleMarker(feature, latlng) {
    let markerOptions = {
        radius: 6, // Default radius
        fillOpacity: 0.8,
        color: 'black',
        fillColor: 'blue', // Default fill color
        weight: 1,
    };

    // Check the type of the feature and set options accordingly
    if (feature.properties.type === 'fontaine') {
        markerOptions.fillColor = '#325780'; // Color for fontaines
        markerOptions.radius = 5; // Radius for fontaines
    } else if (feature.properties.type === 'lavoir') {
        markerOptions.fillColor = '#62abf9'; // Color for lavoirs
        markerOptions.radius = 5; // Radius for lavoirs
    } else if (feature.properties.type === 'lavoir_fontaine') {
        markerOptions.fillColor = '#62abf9'; // Color for lavoirs
        markerOptions.radius = 4; // Radius for lavoirs
        markerOptions.color = '#325780'; // Color for lavoirs and fontaines
        markerOptions.weight = 3; // Weight for lavoirs and fontaines
    } else {
        markerOptions.radius = 5; // Default radius for other types
    }

    // Create and return the circle marker
    return L.circleMarker(latlng, markerOptions);
}

function onEachFeatureLavoirs(feature,layer){
    if (feature.properties.nom == null){
        var tooltip = "Nom non renseigné (" + feature.properties.type + ")";
    } else {
        var tooltip = feature.properties.nom
    }
    layer.bindTooltip(tooltip,{
         permanent: false,
         direction: "center",
    })

    layer.on('click', function (e) {
        lavoirsPanelRequestToken += 1;
        const requestToken = lavoirsPanelRequestToken;
        handleFeatureClick(e, buildLavoirsPanelContent(feature.properties, [], true));
        renderLavoirsPanelContent(feature.properties, requestToken);
    });
 }

var lavoirs_fontaines = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, getLavoirsMarkerStyle(feature, lavoirsStyleMode));
    },
    onEachFeature:onEachFeatureLavoirs,
    filter: function (feature, layer) {
        return feature.properties.type != "inconnu";
    }
}); 
    
 $.getJSON(url_lavoirs, function(data) {
    lavoirs_fontaines.addData(data);
    applyLavoirsStyleMode(lavoirsStyleMode);
    renderMapLegendPanel();
});


////////////////////////////////
var lieux_dits;
var lastClickedElement;
function highlightFeature(e) {
    if(lastClickedElement){
        lieux_dits.resetStyle(lastClickedElement)
    }

    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: 'blue',
        fillColor: 'blue',
        fillOpacity: 0.7
    });
    lastClickedElement= layer;
}


var url_lieux_dits = './data/lieux_dits.geojson';
lieux_dits = L.geoJson(null, {
    style: {
        color: 'grey',
        weight: 0.2,
        fillOpacity: 0.1,
        fillColor: '#fff',
    },
    onEachFeature:function(feature,layer){
        var tooltip = feature.properties["lieu-dit"]
        layer.bindTooltip(tooltip,{
             permanent: false,
             direction: "center",
        })

        var popupcontent = "<h4>"+feature.properties["lieu-dit"]+"</h4>";
        if (feature.properties["commentaire"]){
            popupcontent += "<p>Commentaire : "+feature.properties["commentaire"]+"</p>";
        }

        layer.on({
            click: function (e) {
                highlightFeature(e);
                handleFeatureClick(e, popupcontent);
            }
        });
    }
});
    
 $.getJSON(url_lieux_dits, function(data) {
    lieux_dits.addData(data);
});

map.on('click', function(e) {
    if (suppressNextMapReset) {
        suppressNextMapReset = false;
        return;
    }

    // If a polygon was previously highlighted, reset its style
    if (lastClickedElement) {
        lieux_dits.resetStyle(lastClickedElement);
        lastClickedElement = null;
    }
    resetFeaturePanel();
});

/// Toponymes maritimes (points)
var url_toponymes_maritimes_points = './data/toponymes_maritimes_points.geojson';
var toponymes_maritimes_points = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 1,
            fillColor: "black",
            color: "black",
            weight: 1,
            opacity: 0,
            fillOpacity: 0.2
        });
    },
    onEachFeature:function(feature,layer){
        var tooltip = feature.properties["Toponyme-bzh"]
        layer.bindTooltip(tooltip,{
             permanent: false,
             direction: "center",
        })
    }
});


/// Toponymes maritimes (lignes)
var url_toponymes_maritimes_lignes = './data/toponymes_maritimes_lignes.geojson';
var toponymes_maritimes_lignes = L.geoJson(null, {
    style: {
            color: "black",
            weight: 1,
            opacity: 0.1
    },
    onEachFeature:function(feature,layer){
        var tooltip = feature.properties["Toponyme-bzh"]
        layer.bindTooltip(tooltip,{
             permanent: false,
             direction: "center",
        })
    }
});

/// Toponyme maritime (feature group)
var toponymes_maritimes = L.featureGroup();
$.getJSON(url_toponymes_maritimes_points, function(data) {
    toponymes_maritimes_points.addData(data);
    toponymes_maritimes.addLayer(toponymes_maritimes_points);
});
$.getJSON(url_toponymes_maritimes_lignes, function(data) {
    toponymes_maritimes_lignes.addData(data);
    toponymes_maritimes.addLayer(toponymes_maritimes_lignes);
});

/**
 * CONTROLS
 */

const layers = [
    {
        name: 'Cartes actuelles',
        collapsed: false,
        layers: [
            { name: "Plan IGN", layer: ign2023, active: true},
            { name: "OpenStreetMap", layer: osm, active: false},
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
        name: 'Relief et bathymétrie',
        collapsed: true,
        layers: [
            { name: "MNT 1m Lidar HD", layer: lidarhd, active: false},
            { name: "Bathymétrie (Litto 3D, SHOM)", layer: litto3D, active: false},
        ],
    },
    {
        name: 'Cartes anciennes',
        collapsed: true,
        layers: [
            { name: "Dépôt de la Marine (v. 1780)", layer: depotmarine1780, active: false, opacityControl: true},
            { name: "Carte de Cassini (1786)", layer: cassini, active: false, opacityControl: true},
            { name: "Minute hydrographique (1816)", layer:minuteouessantshom, active: false, opacityControl: true},
            { name: "Pilote français (1822)", layer: pilotefrancais, active: false, opacityControl: true},
            { name: "Etat-Major (1866)", layer: etatmajor, active: false, opacityControl: true},
            { name: "Plan d'ensemble (1910)", layer: planensemble1910, active: false, opacityControl: true},
            { name: "Carte touristique (1929)", layer: cartetouristique1929, active: false, opacityControl: true},
            { name: "Scan historique IGN (1950)", layer: ign1952, active: false, opacityControl: true},
        ],
    },
    {
        name: 'Cadastre ancien (1842)',
        collapsed: true,
        layers: [
            { name: "Tableau d'assemblage (Atlas)", layer: assemblage, active: false, opacityControl: true},
            { name: "Tableau d'assemblage (Minute)", layer: assemblageAD29, active: false, opacityControl: true},
            { name: "Plan parcellaire", layer: planparcellaire, active: false, opacityControl: true},
        ],
    },
    {
        name:"Toponymie <i>(en cours)</i>",
        collapsed: true,
        layers: [
            { name: "Lieux-dits (Cadastre 1842)", layer: lieux_dits, active: false, opacityControl: false},
            { name: "Toponymes maritimes", layer: toponymes_maritimes, active: false, opacityControl: false},
        ],
    },
    {
        name: 'Patrimoine culturel <i>(en cours)</i>',
        collapsed: true,
        layers: [
            { name: "Lavoirs et fontaines", layer: lavoirs_fontaines, active: false, opacityControl: false},
            { name: "Moulins", layer: getMoulinsOverlayLayer(), active: false, opacityControl: false}
        ],
    }

];

var advancedLayersControl = L.control.advancedLayers(layers, {
    collapsible: true}).addTo(map);

var legendRefreshTimer = null;
function scheduleLegendRefresh() {
    if (legendRefreshTimer) {
        clearTimeout(legendRefreshTimer);
    }
    legendRefreshTimer = setTimeout(function () {
        legendRefreshTimer = null;
        renderMapLegendPanel();
    }, 0);
}

function bindLegendToLayerControl(control) {
    if (!control || typeof control.getContainer !== 'function') {
        return;
    }

    var container = control.getContainer();
    if (!container) {
        return;
    }

    container.addEventListener('change', function () {
        scheduleLegendRefresh();
    });

    container.addEventListener('click', function () {
        scheduleLegendRefresh();
    });
}

// Refresh legend on any map layer change.
map.on('layeradd', function () {
    scheduleLegendRefresh();
});

map.on('layerremove', function () {
    scheduleLegendRefresh();
});

bindLegendToLayerControl(advancedLayersControl);

renderMapLegendPanel();

L.control.scale().addTo(map);

L.control.locate({
    setViw:true,
    strings: {
    title: "Me situer sur la carte !"
  }}).addTo(map);
