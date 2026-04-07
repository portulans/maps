/**
 * Application Initialization & Orchestration
 * Main entry point that initializes all managers and wires up the application
 */

let app = {};

/**
 * Initialize the entire application
 */
function initializeApp() {
    // ===== CREATE MAP =====
    app.map = L.map('mapviz', {
        maxZoom: MAP_MAX_ZOOM,
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topleft'
        }
    }).setView(MAP_CENTER, MAP_ZOOM);

    // ===== INITIALIZE STATE =====
    app.state = {
        lavoirsStyleMode: DEFAULT_STATE.lavoirsStyleMode,
        moulinsStyleMode: DEFAULT_STATE.moulinsStyleMode,
        moulinsGroupVisibility: { ...DEFAULT_STATE.moulinsGroupVisibility }
    };

    // ===== INITIALIZE MANAGERS =====

    // Feature panel manager
    const panelElement = document.getElementById('feature-panel-content');
    const lavoirsPanelConfig = {
        ...LAYER_CONFIG.lavoirs,
        layerKey: 'lavoirs',
        showAltName: true
    };
    const moulinsPanelConfig = {
        ...LAYER_CONFIG.moulins,
        layerKey: 'moulins',
        showAltName: false
    };

    app.lavoirsPanelManager = new PanelManager(panelElement, lavoirsPanelConfig);
    app.moulinsPanelManager = new PanelManager(panelElement, moulinsPanelConfig);

    // Image managers
    app.lavoirsImageManager = new ImageManager(LAYER_CONFIG.lavoirs.images);
    app.moulinsImageManager = new ImageManager(LAYER_CONFIG.moulins.images);

    // Layer managers (will be created after image managers)
    app.layerManagers = {};

    // ===== INITIALIZE LEGEND FIRST =====
    app.legendManager = new LegendManager('lavoirs-map-legend', app.map, {
        lavoirs: app.layerManagers.lavoirs,
        moulins: app.layerManagers.moulins,
        lieux_dits: app.layerManagers.lieux_dits
    });

    // Setup legend callbacks
    app.legendManager.onStyleModeChangeCallback = (layerKey, newMode) => {
        app.state[`${layerKey}StyleMode`] = newMode;
        app.legendManager.render(app.state.lavoirsStyleMode, app.state.moulinsStyleMode);
    };

    app.legendManager.onGroupVisibilityChangeCallback = (groupKey, isVisible) => {
        app.state.moulinsGroupVisibility[groupKey] = isVisible;
        if (app.layerManagers.moulins) {
            app.layerManagers.moulins.refresh();
            app.legendManager.render(app.state.lavoirsStyleMode, app.state.moulinsStyleMode);
        }
    };

    // Monitor layer visibility and update legend
    app.legendManager.monitorLayerVisibility(() => {
        app.legendManager.render(app.state.lavoirsStyleMode, app.state.moulinsStyleMode);
    });

    // ===== INITIALIZE LAYERS (asynchronous) =====
    Promise.all([
        initializeLavoirs(),
        initializeMoulins(),
        initializeLieuxDits()
    ]).then(() => {
        setupLayerControls();
    });
}

/**
 * Setup layer controls - called AFTER all layers are loaded
 */
function setupLayerControls() {
    const layers = [
        {
            name: 'Cartes actuelles',
            collapsed: false,
            layers: [
                { name: "Plan IGN", layer: ign2023, active: true },
                { name: "OpenStreetMap", layer: osm, active: false },
                { name: "OpenSeaMap", layer: seamarks, active: false }
            ]
        },
        {
            name: 'Images aériennes',
            collapsed: true,
            layers: [
                { name: "1952", layer: ignaerial1950, active: false },
                { name: "1975", layer: ignaerial1965, active: false },
                { name: "2000", layer: ignaerial2000, active: false },
                { name: "2005", layer: ignaerial2005, active: false },
                { name: "2009", layer: ignaerial2009, active: false },
                { name: "2015", layer: ignaerial2015, active: false },
                { name: "2018", layer: ignaerial2018, active: false },
                { name: "2021", layer: ignaerial2023, active: false }
            ]
        },
        {
            name: 'Cartes anciennes',
            collapsed: true,
            layers: [
                { name: "Dépôt de la Marine (v. 1780)", layer: depotmarine1780, active: false, opacityControl: true },
                { name: "Carte de Cassini (1786)", layer: cassini, active: false, opacityControl: true },
                { name: "Minute hydrographique (1816)", layer: minuteouessantshom, active: false, opacityControl: true },
                { name: "Pilote français (1822)", layer: pilotefrancais, active: false, opacityControl: true },
                { name: "Etat-Major (1866)", layer: etatmajor, active: false, opacityControl: true },
                { name: "Carte touristique (1929)", layer: cartetouristique1929, active: false, opacityControl: true },
                { name: "Scan historique IGN (1950)", layer: ign1950, active: false, opacityControl: true }
            ]
        },
        {
            name: 'Cadastre ancien (1842)',
            collapsed: true,
            layers: [
                { name: "Tableau d'assemblage (Atlas)", layer: assemblage, active: false, opacityControl: true },
                { name: "Tableau d'assemblage (Minute)", layer: assemblageAD29, active: false, opacityControl: true },
                { name: "Plan parcellaire", layer: planparcellaire, active: false, opacityControl: true }
            ]
        },
        {
            name: "Toponymie <i>(en cours)</i>",
            collapsed: true,
            layers: [
                { name: "Lieux-dits (Cadastre 1842)", layer: app.layerManagers.lieux_dits.getLayer(), active: false, opacityControl: false }
            ]
        },
        {
            name: 'Patrimoine culturel <i>(en cours)</i>',
            collapsed: true,
            layers: [
                { name: "Lavoirs et fontaines", layer: app.layerManagers.lavoirs.getLayer(), active: false, opacityControl: false },
                { name: "Moulins", layer: app.layerManagers.moulins.cluster, active: false, opacityControl: false }
            ]
        }
    ];

    L.control.advancedLayers(layers, { collapsible: true }).addTo(app.map);

    // ===== SETUP MAP CONTROLS =====
    L.control.scale().addTo(app.map);
    L.control.locate({
        setView: true,
        strings: {
            title: "Me situer sur la carte !"
        }
    }).addTo(app.map);

    // ===== SETUP MAP CLICK HANDLER =====
    app.map.on('click', (e) => {
        if (app.lavoirsPanelManager.suppressNextMapReset) {
            app.lavoirsPanelManager.suppressNextMapReset = false;
            return;
        }
        resetFeaturePanel();
    });

    // ===== INITIAL LEGEND RENDER =====
    app.legendManager.render(app.state.lavoirsStyleMode, app.state.moulinsStyleMode);

    console.log('Application initialized');
}

/**
 * Initialize lavoirs layer
 */
function initializeLavoirs() {
    const lavoirsConfig = {
        ...LAYER_CONFIG.lavoirs,
        layerKey: 'lavoirs',
        defaultMode: app.state.lavoirsStyleMode
    };

    app.layerManagers.lavoirs = new LayerManager(
        app.map,
        lavoirsConfig,
        app.lavoirsPanelManager,
        app.lavoirsImageManager
    );

    return app.layerManagers.lavoirs.loadData(LAYER_CONFIG.lavoirs.dataUrl).then((layer) => {
        // Keep layer loaded but hidden by default; control toggles visibility.
        return layer;
    });
}

/**
 * Initialize moulins layer
 */
function initializeMoulins() {
    const moulinsConfig = {
        ...LAYER_CONFIG.moulins,
        layerKey: 'moulins',
        defaultMode: app.state.moulinsStyleMode
    };

    app.layerManagers.moulins = new LayerManager(
        app.map,
        moulinsConfig,
        app.moulinsPanelManager,
        app.moulinsImageManager
    );

    return app.layerManagers.moulins.loadData(LAYER_CONFIG.moulins.dataUrl).then((layer) => {
        if (layer) {
            // Wrap moulins in clustering
            const moulinsCluster = L.markerClusterGroup({
                showCoverageOnHover: false,
                zoomToBoundsOnClick: true,
                spiderfyOnMaxZoom: true,
                maxClusterRadius: 5
            });
            
            moulinsCluster.addLayer(layer);
            
            // Store cluster reference
            app.layerManagers.moulins.cluster = moulinsCluster;
            return moulinsCluster;
        }
    });
}

/**
 * Initialize lieux-dits layer
 */
function initializeLieuxDits() {
    const lieuxDitsConfig = {
        ...LAYER_CONFIG.lieux_dits,
        layerKey: 'lieux_dits'
    };

    app.layerManagers.lieux_dits = new LayerManager(
        app.map,
        lieuxDitsConfig,
        null, // No panel manager for lieux-dits
        null
    );

    // Custom styling for lieux-dits (polygon layer)
    return fetch(LAYER_CONFIG.lieux_dits.dataUrl)
        .then(r => r.json())
        .then(data => {
            let lastClickedElement = null;

            const geoJsonLayer = L.geoJson(data, {
                style: {
                    color: 'grey',
                    weight: 0.2,
                    fillOpacity: 0.1,
                    fillColor: '#fff'
                },
                onEachFeature: (feature, layer) => {
                    const tooltip = feature.properties['lieu-dit'];
                    if (tooltip) {
                        layer.bindTooltip(tooltip, {
                            permanent: false,
                            direction: 'center'
                        });
                    }

                    layer.on('click', (e) => {
                        if (lastClickedElement) {
                            geoJsonLayer.resetStyle(lastClickedElement);
                        }
                        
                        layer.setStyle({
                            weight: 5,
                            color: 'blue',
                            fillColor: 'blue',
                            fillOpacity: 0.7
                        });
                        lastClickedElement = layer;

                        let popupContent = `<h4>${feature.properties['lieu-dit']}</h4>`;
                        if (feature.properties['commentaire']) {
                            popupContent += `<p>Commentaire: ${feature.properties['commentaire']}</p>`;
                        }

                        const panelElement = document.getElementById('feature-panel-content');
                        if (panelElement) {
                            panelElement.innerHTML = popupContent;
                        }

                        L.DomEvent.stopPropagation(e.originalEvent);
                        e.originalEvent.preventDefault();
                    });
                }
            });

            app.layerManagers.lieux_dits.geoJsonLayer = geoJsonLayer;
            return geoJsonLayer;
        })
        .catch(err => {
            console.error('Error loading lieux-dits:', err);
            return null;
        });
}

/**
 * Reset feature panel to default state
 */
function resetFeaturePanel() {
    const panelElement = document.getElementById('feature-panel-content');
    if (panelElement) {
        panelElement.innerHTML = '<p>Cliquez sur un élément de la carte pour afficher ses informations ici.</p>';
    }
}

/**
 * Start the application when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
