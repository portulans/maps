/**
 * Layer Manager
 * Handles GeoJSON layer creation, styling, and event handling
 */

class LayerManager {
    /**
     * Initialize LayerManager
     * @param {L.Map} mapInstance - Leaflet map instance
     * @param {Object} config - Layer configuration
     * @param {PanelManager} panelManager - Panel manager instance
     * @param {ImageManager} imageManager - Image manager instance
     */
    constructor(mapInstance, config, panelManager, imageManager) {
        this.map = mapInstance;
        this.config = config;
        this.panelManager = panelManager;
        this.imageManager = imageManager;
        this.geoJsonLayer = null;
        this.styleMode = config.defaultMode || 'type';
        this.sourceData = null;
        this.suppressNextMapReset = false;
    }

    /**
     * Get marker style for feature based on current mode (lavoirs)
     */
    getCircleMarkerStyle(feature, mode) {
        const props = feature.properties || {};
        let color = '#7b8790';

        if (mode === 'type') {
            color = colorByType(props.type);
        } else if (mode === 'statut') {
            color = colorByStatut(props.statut);
        } else if (mode === 'precision') {
            color = colorByPrecision(props.precision_geom);
        }

        return {
            radius: 7,
            fillOpacity: 0.85,
            color: '#172328',
            fillColor: color,
            weight: 1.2
        };
    }

    /**
     * Get marker icon for feature (moulins)
     */
    getMarkerIcon(feature, mode) {
        const props = feature.properties || {};
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
            }
            
            return L.icon({
                iconUrl: icon,
                iconSize: iconSize
            });
        }

        const color = mode === 'precision'
            ? colorByPrecision(props.precision_geom)
            : colorByStatut(props.statut);

        return L.divIcon({
            className: 'moulin-square-icon-wrapper',
            html: `<span class="moulin-square-icon" style="background:${color};"></span>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });
    }

    /**
     * Create GeoJSON layer from data
     */
    createLayer(geojsonData) {
        const self = this;

        const options = {
            onEachFeature: (feature, layer) => this.attachEventHandlers(feature, layer),
            filter: (feature) => this.shouldDisplayFeature(feature)
        };

        // Add point rendering based on config
        if (this.config.styling.type === 'circle') {
            options.pointToLayer = (feature, latlng) => {
                return L.circleMarker(latlng, this.getCircleMarkerStyle(feature, this.styleMode));
            };
        } else if (this.config.styling.type === 'icon') {
            options.pointToLayer = (feature, latlng) => {
                return L.marker(latlng, {
                    icon: this.getMarkerIcon(feature, this.styleMode)
                });
            };
        }

        this.geoJsonLayer = L.geoJson(geojsonData, options);
        return this.geoJsonLayer;
    }

    /**
     * Check if feature should be displayed
     */
    shouldDisplayFeature(feature) {
        const props = feature.properties || {};
        
        // Filter out unknown types for lavoirs
        if (this.config.layerKey === 'lavoirs' && props.type === 'inconnu') {
            return false;
        }
        
        return true;
    }

    /**
     * Attach click and tooltip handlers to layer
     */
    attachEventHandlers(feature, layer) {
        const props = feature.properties || {};
        const tooltip = safeText(props.nom, '');

        // Add tooltip
        if (tooltip) {
            layer.bindTooltip(tooltip, {
                permanent: false,
                direction: 'center'
            });
        }

        // Add click handler
        layer.on('click', (e) => {
            this.suppressNextMapReset = true;
            
            if (e && e.originalEvent) {
                L.DomEvent.stopPropagation(e.originalEvent);
                if (e.originalEvent.preventDefault) {
                    e.originalEvent.preventDefault();
                }
            }

            const requestToken = this.panelManager.getNewRequestToken(this.config.layerKey);
            this.panelManager.renderAsync(
                props,
                this.config.layerKey,
                this.imageManager,
                requestToken
            );
        });
    }

    /**
     * Apply style mode to all features
     */
    applyStyleMode(mode) {
        this.styleMode = mode;
        
        if (!this.geoJsonLayer) {
            return;
        }

        this.geoJsonLayer.eachLayer((layer) => {
            if (!layer || !layer.feature) return;

            if (this.config.styling.type === 'circle' && typeof layer.setStyle === 'function') {
                layer.setStyle(this.getCircleMarkerStyle(layer.feature, mode));
            } else if (this.config.styling.type === 'icon' && typeof layer.setIcon === 'function') {
                layer.setIcon(this.getMarkerIcon(layer.feature, mode));
            }
        });
    }

    /**
     * Refresh layer (clear and re-add data)
     */
    refresh() {
        if (!this.geoJsonLayer || !this.sourceData) {
            return;
        }

        this.geoJsonLayer.clearLayers();
        this.geoJsonLayer.addData(this.sourceData);
        this.applyStyleMode(this.styleMode);
    }

    /**
     * Load GeoJSON data and create layer
     */
    async loadData(dataUrl) {
        try {
            const response = await fetch(dataUrl);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            this.sourceData = data;
            
            if (!this.geoJsonLayer) {
                this.createLayer(data);
            } else {
                this.geoJsonLayer.addData(data);
                this.applyStyleMode(this.styleMode);
            }
            
            return this.geoJsonLayer;
        } catch (error) {
            console.error(`Error loading data from ${dataUrl}:`, error);
            return null;
        }
    }

    /**
     * Get the layer object (for map control)
     */
    getLayer() {
        return this.geoJsonLayer;
    }

    /**
     * Get the underlying data
     */
    getData() {
        return this.sourceData;
    }

    /**
     * Check if layer is visible on map
     */
    isVisible() {
        return isOverlayVisible(this.geoJsonLayer, this.map);
    }
}
