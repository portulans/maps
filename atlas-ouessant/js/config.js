/**
 * Application Configuration
 * All constants, settings, and layer definitions
 */

// Map center and zoom
const MAP_CENTER = [48.46, -5.08];
const MAP_ZOOM = 13;
const MAP_MAX_ZOOM = 20;

// ===== LAYER CONFIGURATIONS =====

const LAYER_CONFIG = {
    lavoirs: {
        name: 'Lavoirs et fontaines',
        dataUrl: 'data/lavoirs_fontaines.geojson',
        type: 'point',
        images: {
            basePath: './img/library/Terrain/lavoirs_et_fontaines',
            creditsPath: './img/library/Terrain/lavoirs_et_fontaines/credits.json',
            extensions: ['jpg', 'jpeg', 'png', 'webp'],
            maxNumbered: 12
        },
        idFields: ['fid', 'Id', 'id'],  // fallback order for feature ID
        styling: {
            type: 'circle',
            modes: ['precision', 'statut', 'type']
        },
        panelFields: [
            { key: 'type', label: 'Type', type: 'text' },
            { key: 'nom', label: 'Nom', type: 'text' },
            { key: 'statut', label: 'Statut', type: 'text' },
            { key: 'precision_geom', label: 'Précision des coordonnées', type: 'text' },
            { key: 'source', label: 'Source', type: 'text' },
            { key: 'src_p1910', label: 'Trace sur le plan de 1910 ?', type: 'yesno' },
            { key: 'src_c1842', label: 'Trace sur le cadastre de 1842 ?', type: 'yesno' },
            { key: 'description', label: 'Description', type: 'paragraph' },
            { key: 'commentaire_st', label: 'Commentaire', type: 'paragraph' }
        ]
    },
    moulins: {
        name: 'Moulins',
        dataUrl: 'data/moulins.geojson',
        type: 'point',
        images: {
            basePath: './img/library/Terrain/moulins',
            creditsPath: './img/library/Terrain/moulins/credits.json',
            extensions: ['jpg', 'jpeg', 'png', 'webp'],
            maxNumbered: 12
        },
        idFields: ['fid'],
        styling: {
            type: 'icon',
            modes: ['type', 'precision', 'statut']
        },
        panelFields: [
            { key: 'type', label: 'Type', type: 'text' },
            { key: 'nom', label: 'Nom', type: 'text' },
            { key: 'source', label: 'Source', type: 'text' },
            { key: 'date_const', label: 'Date de construction', type: 'text' },
            { key: 'date_arret', label: 'Date de mise à l\'arrêt', type: 'text' },
            { key: 'date_dem', label: 'Date de démolition', type: 'text' },
            { key: 'statut', label: 'Existant', type: 'custom_moulin_statut' }
        ]
    },
    lieux_dits: {
        name: 'Lieux-dits (Cadastre 1842)',
        dataUrl: './data/lieux_dits.geojson',
        type: 'polygon',
        idFields: ['lieu-dit']
    }
};

// ===== STYLING LEGENDS =====

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

const MOULINS_STYLE_LEGENDS = {
    precision: LAVOIRS_STYLE_LEGENDS.precision,
    statut: LAVOIRS_STYLE_LEGENDS.statut,
    type: [
        { label: 'Grand moulin', icon: 'img/grand-moulin.svg' },
        { label: 'Petit moulin', icon: 'img/petit-moulin.svg' }
    ]
};

// ===== MOULINS GROUPS =====

const MOULINS_GROUPS = {
    petits_xix: 'Petits moulins construits au 19ème siècle',
    grands_1842: 'Grands moulins existants en 1842',
    autres: '18ème siècle, disp. avant 1842'
};

// ===== DEFAULT UI STATE =====

const DEFAULT_STATE = {
    lavoirsStyleMode: 'precision',
    moulinsStyleMode: 'type',
    moulinsGroupVisibility: {
        petits_xix: true,
        grands_1842: true,
        autres: false
    }
};

/**
 * Get legend entries for a layer and mode
 */
function getLegendEntries(layerKey, styleMode) {
    if (layerKey === 'lavoirs') {
        return LAVOIRS_STYLE_LEGENDS[styleMode] || [];
    }
    if (layerKey === 'moulins') {
        return MOULINS_STYLE_LEGENDS[styleMode] || [];
    }
    return [];
}

/**
 * Get feature ID from properties using configured fallback order
 */
function getFeatureId(properties, layerKey) {
    if (!properties) return '';
    const config = LAYER_CONFIG[layerKey];
    if (!config || !config.idFields) return '';
    
    for (let i = 0; i < config.idFields.length; i++) {
        const fieldName = config.idFields[i];
        if (properties[fieldName]) {
            return safeText(properties[fieldName]);
        }
    }
    return '';
}
