/**
 * Image Manager
 * Handles image probing, resolution, and credits for any layer
 */

class ImageManager {
    /**
     * Initialize ImageManager
     * @param {Object} config - Configuration with basePath, creditsPath, extensions, maxNumbered
     */
    constructor(config) {
        this.basePath = config.basePath || './img';
        this.creditsPath = config.creditsPath;
        this.extensions = config.extensions || ['jpg', 'jpeg', 'png', 'webp'];
        this.maxNumbered = config.maxNumbered || 12;
        this.imageCredits = new Map();
        this.creditsPromise = null;
        this.imagesByIdMap = new Map();
    }

    /**
     * Probe if image URL exists
     */
    probeImage(url) {
        return new Promise((resolve) => {
            const image = new Image();
            image.onload = () => resolve(true);
            image.onerror = () => resolve(false);
            image.src = url;
        });
    }

    /**
     * Find first existing image URL from base path with multiple extensions
     */
    async firstExistingImageUrl(basePath) {
        const candidates = this.extensions.map((ext) => `${basePath}.${ext}`);
        
        const checks = await Promise.all(
            candidates.map((url) => this.probeImage(url))
        );
        
        const foundIndex = checks.findIndex(Boolean);
        return foundIndex >= 0 ? candidates[foundIndex] : null;
    }

    /**
     * Resolve all image URLs for given identifiers
     */
    async resolveImages(identifiers) {
        const ids = Array.isArray(identifiers) ? identifiers : [identifiers];
        const uniqueIds = Array.from(
            new Set(ids.map((v) => safeText(v, '')).filter(Boolean))
        );

        if (!uniqueIds.length) {
            return [];
        }

        const basePaths = [];
        
        // Main image
        uniqueIds.forEach((idValue) => {
            const encodedId = encodeURIComponent(idValue);
            basePaths.push(`${this.basePath}/${encodedId}`);
            
            // Numbered variants
            for (let i = 1; i <= this.maxNumbered; i++) {
                basePaths.push(`${this.basePath}/${encodedId}-${i}`);
            }
        });

        const resolvedUrls = await Promise.all(
            basePaths.map((basePath) => this.firstExistingImageUrl(basePath))
        );

        return Array.from(new Set(resolvedUrls.filter(Boolean)));
    }

    /**
     * Load image credits from JSON file
     */
    loadCredits() {
        if (this.creditsPromise) {
            return this.creditsPromise;
        }

        this.creditsPromise = fetch(this.creditsPath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
            })
            .then((entries) => {
                if (!Array.isArray(entries)) {
                    return;
                }
                entries.forEach((entry) => {
                    const imageName = safeText(entry.img || '', '').toLowerCase();
                    const imageId = safeText(entry.id || '', '');
                    
                    if (!imageName) return;
                    
                    this.imageCredits.set(imageName, {
                        author: safeText(entry.author || '', ''),
                        date: safeText(entry.date || '', '')
                    });
                    
                    if (imageId) {
                        this.imagesByIdMap.set(imageId, imageName);
                    }
                });
            })
            .catch((error) => {
                console.warn(`Could not load image credits from ${this.creditsPath}:`, error);
            });

        return this.creditsPromise;
    }

    /**
     * Get caption text for image URL
     */
    getCaptions(url) {
        const imageName = imageNameFromUrl(url);
        const credit = this.imageCredits.get(imageName);
        
        if (!credit) {
            return '';
        }

        const author = safeText(credit.author || '', '');
        const date = safeText(credit.date || '', '');
        
        if (author && date) {
            return `${author} - ${date}`;
        }
        return author || date;
    }

    /**
     * Load all images for feature and get captions
     */
    async loadAndPrepare(identifiers) {
        await this.loadCredits();
        const imageUrls = await this.resolveImages(identifiers);
        return imageUrls.map((url) => ({
            url: url,
            caption: this.getCaptions(url)
        }));
    }
}
