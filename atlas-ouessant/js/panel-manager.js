/**
 * Panel Manager
 * Handles feature panel content building and rendering
 */

class PanelManager {
    /**
     * Initialize PanelManager
     * @param {HTMLElement} panelElement - DOM element for panel content
     * @param {Object} config - Layer configuration
     */
    constructor(panelElement, config) {
        this.panelElement = panelElement;
        this.config = config;
        this.requestTokens = new Map();
        this.currentToken = 0;
    }

    /**
     * Generate unique request token to cancel stale requests
     */
    getNewRequestToken(layerId) {
        this.currentToken += 1;
        this.requestTokens.set(layerId, this.currentToken);
        return this.currentToken;
    }

    /**
     * Check if request is still valid
     */
    isValidToken(layerId, token) {
        return this.requestTokens.get(layerId) === token;
    }

    /**
     * Update panel DOM content
     */
    updateDOM(content) {
        if (this.panelElement) {
            this.panelElement.innerHTML = content;
        }
    }

    /**
     * Build panel header HTML
     */
    buildHeader(typeLabel) {
        return `<div class="panel-header">
            <p class="feature-type">${escapeHtml(typeLabel)}</p>
        </div>`;
    }

    /**
     * Build panel title
     */
    buildTitle(title) {
        return `<h3 class="feature-title">${escapeHtml(title)}</h3>`;
    }

    /**
     * Build metadata list HTML
     */
    buildMetadata(properties, fields) {
        let html = '<dl class="feature-meta">';
        
        fields.forEach((field) => {
            if (field.type === 'paragraph') return;
            if (field.type === 'custom_moulin_statut') return;
            
            const value = properties[field.key];
            let displayValue = '';
            
            if (field.type === 'yesno') {
                displayValue = toYesNo(value);
            } else {
                displayValue = safeText(value, 'Non renseigné');
            }
            
            html += `<dt>${escapeHtml(field.label)}</dt>`;
            html += `<dd>${escapeHtml(displayValue)}</dd>`;
        });
        
        html += '</dl>';
        return html;
    }

    /**
     * Build custom moulin statut field
     */
    buildMoulinStatut(properties) {
        let statutLabel = 'Non renseigné';
        if (properties.statut === 'détruit') {
            statutLabel = 'Non';
        } else if (properties.statut === 'existant') {
            statutLabel = 'Oui' + (properties.renove === 1 ? ' (rénové)' : ' (en ruines)');
        } else if (properties.statut === 'à déterminer') {
            statutLabel = 'À déterminer (vérification sur le terrain)';
        }
        
        return `<dt>Existant</dt><dd>${escapeHtml(statutLabel)}</dd>`;
    }

    /**
     * Build paragraphs (description, comments, etc)
     */
    buildParagraphs(properties, fields) {
        let html = '';
        
        fields.forEach((field) => {
            if (field.type !== 'paragraph') return;
            
            const value = safeText(properties[field.key], '');
            if (value) {
                html += `<p class="feature-${field.key}">${escapeHtml(field.label)}: ${escapeHtml(value)}</p>`;
            }
        });
        
        return html;
    }

    /**
     * Build loading state HTML
     */
    buildLoadingState() {
        return `<div class="feature-images is-visible is-loading">
            <p class="feature-images__title">Images</p>
            <p class="feature-images__loading" role="status" aria-live="polite">
                <span class="feature-images__spinner" aria-hidden="true"></span>
                Chargement des images...
            </p>
        </div>`;
    }

    /**
     * Build images HTML
     */
    buildImages(imageData, pointId) {
        if (!imageData || !imageData.length) {
            return '';
        }

        let html = '<div class="feature-images is-visible">';
        html += `<p class="feature-images__title">${imageData.length > 1 ? 'Images' : 'Image'}</p>`;
        
        imageData.forEach((img, index) => {
            const imageAlt = imageData.length > 1
                ? `Illustration ${index + 1} du point ${pointId}`
                : `Illustration du point ${pointId}`;

            html += '<figure class="feature-images__item">';
            html += `<a href="${escapeHtml(img.url)}" target="_blank" rel="noopener">`;
            html += `<img src="${escapeHtml(img.url)}" alt="${escapeHtml(imageAlt)}" loading="lazy">`;
            html += '</a>';
            
            if (img.caption) {
                html += `<figcaption class="feature-images__caption">${escapeHtml(img.caption)}</figcaption>`;
            }
            
            html += '</figure>';
        });
        
        html += '</div>';
        return html;
    }

    /**
     * Build complete panel content
     */
    buildContent(properties, imageData, isLoading = false) {
        const typeLabel = safeText(properties.type, 'inconnu');
        const title = safeText(properties.nom, `Nom non renseigné (${typeLabel})`);
        const pointId = getFeatureId(properties, this.config.layerKey) || 'Non renseigné';
        
        let html = this.buildHeader(typeLabel);
        html += this.buildTitle(title);
        
        if (this.config.showAltName) {
            const altName = safeText(properties['alt-name'], 'Aucun nom alternatif');
            html += `<p class="muted feature-subtitle">${escapeHtml(altName)}</p>`;
        }
        
        html += this.buildMetadata(properties, this.config.panelFields);
        
        // Special case for moulins statut
        if (this.config.layerKey === 'moulins' && properties.statut) {
            html = html.replace('</dl>', `${this.buildMoulinStatut(properties)}</dl>`);
        }
        
        html += this.buildParagraphs(properties, this.config.panelFields);
        
        if (isLoading) {
            html += this.buildLoadingState();
        } else if (imageData && imageData.length) {
            html += this.buildImages(imageData, pointId);
        }
        
        return html;
    }

    /**
     * Render panel with async image loading
     */
    async renderAsync(properties, layerId, imageManager, requestToken) {
        const currentProperties = properties || {};
        const currentLayerId = layerId || this.config.layerKey;
        
        // Show loading state immediately
        this.updateDOM(this.buildContent(currentProperties, [], true));
        
        try {
            // Get feature ID and load images
            const featureId = getFeatureId(currentProperties, currentLayerId);
            const imageCandidates = [featureId].filter(Boolean);
            
            if (!imageCandidates.length) {
                // No ID, show empty content
                this.updateDOM(this.buildContent(currentProperties, [], false));
                return;
            }

            // Load images asynchronously
            const imageData = await imageManager.loadAndPrepare(imageCandidates);
            
            // Only update if this request is still valid
            if (!this.isValidToken(currentLayerId, requestToken)) {
                return;
            }
            
            this.updateDOM(this.buildContent(currentProperties, imageData, false));
        } catch (error) {
            console.error('Error rendering panel:', error);
            this.updateDOM(this.buildContent(currentProperties, [], false));
        }
    }
}
