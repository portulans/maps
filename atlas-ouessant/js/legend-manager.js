/**
 * Legend Manager
 * Handles map legend rendering and updates
 */

class LegendManager {
    /**
     * Initialize LegendManager
     * @param {string} legendContainerId - ID of legend container element
     * @param {L.Map} mapInstance - Leaflet map instance
     * @param {Object} layers - Object containing all LayerManager instances
     */
    constructor(legendContainerId, mapInstance, layers) {
        this.container = document.getElementById(legendContainerId);
        this.map = mapInstance;
        this.layers = layers;
        this.stateChecks = {};

        if (!this.container) {
            console.warn(`Legend container ${legendContainerId} not found`);
        }
    }

    /**
     * Build legend row HTML for lavoirs
     */
    buildLavoirsLegendRow(styleMode) {
        const entries = getLegendEntries('lavoirs', styleMode);
        let symbolsHtml = '';

        entries.forEach((entry) => {
            symbolsHtml += `<span class="legend-item">
                <span class="legend-swatch" style="background:${entry.color};"></span>
                <span>${escapeHtml(entry.label)}</span>
            </span>`;
        });

        return `<div class="legend-layer-row">
            <span class="legend-layer-title">Lavoirs et fontaines</span>
            <span class="legend-layer-symbols">${symbolsHtml}</span>
            <label class="legend-style-inline-label" for="lavoirs-style-mode">Couleur :</label>
            <select id="lavoirs-style-mode" class="legend-style-select legend-style-select--inline">
                <option value="type">Type</option>
                <option value="precision">Précision géométrique</option>
                <option value="statut">Statut</option>
            </select>
        </div>`;
    }

    /**
     * Build legend row HTML for moulins
     */
    buildMoulinsLegendRow(styleMode) {
        let symbolsHtml = '';

        if (styleMode === 'type') {
            symbolsHtml += '<span class="legend-item"><img src="img/grand-moulin.svg" alt="Grand moulin" class="legend-icon"><span>Grand moulin</span></span>';
            symbolsHtml += '<span class="legend-item"><img src="img/petit-moulin.svg" alt="Petit moulin" class="legend-icon"><span>Petit moulin</span></span>';
        } else {
            const entries = getLegendEntries('moulins', styleMode);
            entries.forEach((entry) => {
                symbolsHtml += `<span class="legend-item">
                    <span class="legend-swatch legend-swatch--square" style="background:${entry.color};"></span>
                    <span>${escapeHtml(entry.label)}</span>
                </span>`;
            });
        }

        return `<div class="legend-layer-row">
            <span class="legend-layer-title">Moulins</span>
            <span class="legend-layer-symbols">${symbolsHtml}</span>
            <label class="legend-style-inline-label" for="moulins-style-mode">Coloration :</label>
            <select id="moulins-style-mode" class="legend-style-select legend-style-select--inline">
                <option value="type">Type</option>
                <option value="precision">Précision géométrique</option>
                <option value="statut">Statut</option>
            </select>
            <details class="legend-group-details">
                <summary>Groupes</summary>
                <label class="legend-group-option">
                    <input type="checkbox" name="moulins-group" value="petits_xix" checked>
                    ${MOULINS_GROUPS.petits_xix}
                </label>
                <label class="legend-group-option">
                    <input type="checkbox" name="moulins-group" value="grands_1842" checked>
                    ${MOULINS_GROUPS.grands_1842}
                </label>
                <label class="legend-group-option">
                    <input type="checkbox" name="moulins-group" value="autres">
                    ${MOULINS_GROUPS.autres}
                </label>
            </details>
        </div>`;
    }

    /**
     * Build legend row for lieux-dits
     */
    buildLieuxDitsLegendRow() {
        return `<div class="legend-layer-row">
            <span class="legend-layer-title">Lieux-dits</span>
            <span class="legend-layer-symbols">
                <span class="legend-item">
                    <span class="legend-polygon-swatch"></span>
                    <span>Emprise de lieu-dit</span>
                </span>
            </span>
        </div>`;
    }

    /**
     * Render the complete legend
     */
    render(lavoirsStyleMode, moulinsStyleMode) {
        if (!this.container) return;

        const rows = [];

        if (this.layers.lavoirs && this.layers.lavoirs.isVisible()) {
            rows.push(this.buildLavoirsLegendRow(lavoirsStyleMode));
        }

        if (this.layers.moulins && this.layers.moulins.isVisible()) {
            rows.push(this.buildMoulinsLegendRow(moulinsStyleMode));
        }

        if (this.layers.lieux_dits && this.layers.lieux_dits.isVisible()) {
            rows.push(this.buildLieuxDitsLegendRow());
        }

        if (!rows.length) {
            this.container.innerHTML = `<h4>Légende des couches visibles</h4>
                <p class="legend-empty">Activez une couche thématique pour afficher sa légende.</p>`;
            return;
        }

        this.container.innerHTML = `<h4>Légende des couches visibles</h4>
            <div class="legend-content">${rows.join('')}</div>`;

        this.attachEventListeners(lavoirsStyleMode, moulinsStyleMode);
    }

    /**
     * Attach event listeners to legend controls
     */
    attachEventListeners(lavoirsStyleMode, moulinsStyleMode) {
        // Lavoirs style selector
        const lavoirsSelect = document.getElementById('lavoirs-style-mode');
        if (lavoirsSelect && this.layers.lavoirs && this.layers.lavoirs.isVisible()) {
            lavoirsSelect.value = lavoirsStyleMode;
            lavoirsSelect.addEventListener('change', (e) => {
                this.layers.lavoirs.applyStyleMode(e.target.value);
                this.onStyleModeChange('lavoirs', e.target.value);
            });
        }

        // Moulins style selector
        const moulinsSelect = document.getElementById('moulins-style-mode');
        if (moulinsSelect && this.layers.moulins && this.layers.moulins.isVisible()) {
            moulinsSelect.value = moulinsStyleMode;
            moulinsSelect.addEventListener('change', (e) => {
                this.layers.moulins.applyStyleMode(e.target.value);
                this.onStyleModeChange('moulins', e.target.value);
            });
        }

        // Moulins group toggles
        const moulinGroupToggles = this.container.querySelectorAll('input[name="moulins-group"]');
        moulinGroupToggles.forEach((checkbox) => {
            checkbox.addEventListener('change', (e) => {
                this.onGroupVisibilityChange(e.target.value, e.target.checked);
            });
        });
    }

    /**
     * Called when style mode changes
     */
    onStyleModeChange(layerKey, newMode) {
        // This will be implemented in app.js to update state
        if (this.onStyleModeChangeCallback) {
            this.onStyleModeChangeCallback(layerKey, newMode);
        }
    }

    /**
     * Called when group visibility changes
     */
    onGroupVisibilityChange(groupKey, isVisible) {
        // This will be implemented in app.js to update moulins visibility
        if (this.onGroupVisibilityChangeCallback) {
            this.onGroupVisibilityChangeCallback(groupKey, isVisible);
        }
    }

    /**
     * Monitor layer visibility changes and update legend
     */
    monitorLayerVisibility(updateCallback) {
        let lastState = this.getCurrentState();

        this.map.on('overlayadd', () => {
            if (this.getCurrentState() !== lastState) {
                lastState = this.getCurrentState();
                updateCallback();
            }
        });

        this.map.on('overlayremove', () => {
            if (this.getCurrentState() !== lastState) {
                lastState = this.getCurrentState();
                updateCallback();
            }
        });

        // Backup: monitor every 500ms
        setInterval(() => {
            const currentState = this.getCurrentState();
            if (currentState !== lastState) {
                lastState = currentState;
                updateCallback();
            }
        }, 500);
    }

    /**
     * Get current visibility state as string
     */
    getCurrentState() {
        return [
            this.layers.lavoirs && this.layers.lavoirs.isVisible() ? '1' : '0',
            this.layers.moulins && this.layers.moulins.isVisible() ? '1' : '0',
            this.layers.lieux_dits && this.layers.lieux_dits.isVisible() ? '1' : '0'
        ].join(',');
    }
}
