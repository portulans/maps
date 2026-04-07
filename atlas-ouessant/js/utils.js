/**
 * Shared Utility Functions
 * Common helpers used across the application
 */

/**
 * Safely extract text from a value with fallback
 */
function safeText(value, fallback) {
    if (value === null || value === undefined) {
        return fallback || '';
    }
    const text = String(value).trim();
    return text || (fallback || '');
}

/**
 * Escape HTML special characters
 */
function escapeHtml(value) {
    return safeText(value, '').replace(/[&<>"']/g, function (char) {
        const escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return escapeMap[char];
    });
}

/**
 * Convert boolean or string value to "Oui" or "Non"
 */
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
    return 'Non renseigné';
}

/**
 * Normalize text to lowercase for comparison
 */
function normalizeText(value) {
    return safeText(value, '').toLowerCase();
}

/**
 * Extract first year from string (matches 1xxx or 20xx patterns)
 */
function extractFirstYear(value) {
    const text = safeText(value, '');
    const match = text.match(/(1[0-9]{3}|20[0-9]{2})/);
    return match ? Number(match[1]) : null;
}

/**
 * Get color for precision value
 */
function colorByPrecision(value) {
    const normalized = normalizeText(value);
    if (normalized.indexOf('exact') !== -1) return '#0b7a75';
    if (normalized.indexOf('affin') !== -1) return '#3f9d68';
    if (normalized.indexOf('approx') !== -1) return '#d8a021';
    if (normalized.indexOf('très') !== -1 || normalized.indexOf('tres') !== -1) return '#c95d3a';
    return '#7b8790';
}

/**
 * Get color for statut value
 */
function colorByStatut(value) {
    const normalized = normalizeText(value);
    if (normalized.indexOf('detruit') !== -1 || normalized.indexOf('détruit') !== -1 || 
        normalized.indexOf('ruine') !== -1 || normalized.indexOf('traces') !== -1) {
        return '#8f3b2c';
    }
    if (normalized.indexOf('a déterminer') !== -1 || normalized.indexOf('à déterminer') !== -1 || 
        normalized.indexOf('incertain') !== -1) {
        return '#ca6a2a';
    }
    if (normalized.indexOf('existant') !== -1 || normalized.indexOf('entretenu') !== -1 || 
        normalized.indexOf('en état') !== -1 || normalized.indexOf('renové') !== -1 || 
        normalized.indexOf('rénové') !== -1) {
        return '#007f73';
    }
    return '#7b8790';
}

/**
 * Get color for type value
 */
function colorByType(value) {
    const normalized = normalizeText(value);
    if (normalized === 'fontaine') return '#3f9d68';
    if (normalized === 'lavoir') return '#2f6f95';
    if (normalized === 'lavoir_fontaine') return '#7a5a9c';
    if (normalized === 'lavoir en bordure de greve') return '#c95d3a';
    return '#7b8790';
}

/**
 * Extract filename from URL
 */
function imageNameFromUrl(url) {
    const cleanUrl = safeText(url, '').split('?')[0].split('#')[0];
    const parts = cleanUrl.split('/');
    return decodeURIComponent(parts[parts.length - 1] || '').toLowerCase();
}

/**
 * Check if layer is visible on map
 */
function isOverlayVisible(layer, mapInstance) {
    const isVisible = Boolean(layer && mapInstance && mapInstance.hasLayer(layer));
    return isVisible;
}
