// ============================================
// LAYOUT PRESETS - Size & Structure Definitions
// ============================================

const LAYOUT_CATEGORIES = {
    square: {
        id: 'square',
        name: 'Square Ads',
        icon: '⬜',
        description: '1:1 - Meta / Mobion',
        platforms: ['meta', 'mobion'],
        sizes: [
            { id: '1080x1080', width: 1080, height: 1080, label: '1080×1080', default: true },
            { id: '1200x1200', width: 1200, height: 1200, label: '1200×1200' },
            { id: '600x600', width: 600, height: 600, label: '600×600 (Small)' }
        ],
        previewScale: 0.5,
        cssClass: 'ratio-1-1'
    },
    
    rectangle: {
        id: 'rectangle',
        name: 'Rectangle Ads',
        icon: '▬',
        description: '16:9 - YouTube / Display',
        platforms: ['youtube', 'google'],
        sizes: [
            { id: '1280x720', width: 1280, height: 720, label: '1280×720 (HD)', default: true },
            { id: '1920x1080', width: 1920, height: 1080, label: '1920×1080 (FHD)' },
            { id: '1200x628', width: 1200, height: 628, label: '1200×628 (FB Link)' },
            { id: '300x250', width: 300, height: 250, label: '300×250 (Display)' }
        ],
        previewScale: 0.42,
        cssClass: 'ratio-16-9'
    },
    
    landing: {
        id: 'landing',
        name: 'Landing Page',
        icon: '📄',
        description: 'Hero Section Layouts',
        platforms: ['landing'],
        sizes: [
            { id: 'desktop', width: 1440, height: 800, label: 'Desktop Hero', default: true },
            { id: 'mobile', width: 390, height: 844, label: 'Mobile Hero' },
            { id: 'tablet', width: 768, height: 600, label: 'Tablet Hero' }
        ],
        previewScale: 0.25,
        cssClass: 'layout-landing'
    }
};

// Layout structures for each category
const LAYOUT_STRUCTURES = {
    square: {
        standard: {
            id: 'standard',
            name: 'Standard',
            elements: ['badge', 'hook', 'primary', 'supporting', 'cta'],
            layout: 'center',
            padding: { top: 80, right: 60, bottom: 80, left: 60 }
        },
        minimal: {
            id: 'minimal',
            name: 'Minimal',
            elements: ['hook', 'cta'],
            layout: 'center',
            padding: { top: 120, right: 80, bottom: 120, left: 80 }
        },
        splitHorizontal: {
            id: 'splitHorizontal',
            name: 'Split Horizontal',
            elements: ['image', 'hook', 'primary', 'cta'],
            layout: 'split-h',
            padding: { top: 40, right: 40, bottom: 40, left: 40 }
        }
    },
    
    rectangle: {
        standard: {
            id: 'standard',
            name: 'Standard',
            elements: ['hook', 'primary', 'cta'],
            layout: 'left',
            padding: { top: 60, right: 80, bottom: 60, left: 80 }
        },
        centered: {
            id: 'centered',
            name: 'Centered',
            elements: ['hook', 'primary'],
            layout: 'center',
            padding: { top: 80, right: 120, bottom: 80, left: 120 }
        },
        thumbnail: {
            id: 'thumbnail',
            name: 'YouTube Thumbnail',
            elements: ['hook', 'primary'],
            layout: 'dramatic',
            padding: { top: 40, right: 60, bottom: 40, left: 60 }
        }
    },
    
    landing: {
        heroLeft: {
            id: 'heroLeft',
            name: 'Hero Left',
            elements: ['badge', 'hook', 'primary', 'supporting', 'cta', 'image', 'trust'],
            layout: 'split-left',
            padding: { top: 80, right: 60, bottom: 80, left: 100 }
        },
        heroCenter: {
            id: 'heroCenter',
            name: 'Hero Center',
            elements: ['badge', 'hook', 'primary', 'cta', 'trust'],
            layout: 'center',
            padding: { top: 100, right: 120, bottom: 60, left: 120 }
        },
        heroRight: {
            id: 'heroRight',
            name: 'Hero Right',
            elements: ['image', 'badge', 'hook', 'primary', 'supporting', 'cta'],
            layout: 'split-right',
            padding: { top: 80, right: 100, bottom: 80, left: 60 }
        }
    }
};

// Best variant heuristics
const VARIANT_SCORING = {
    hookLengthScore(hookLength) {
        if (hookLength <= 20) return 10;
        if (hookLength <= 30) return 8;
        if (hookLength <= 40) return 5;
        return 2;
    },
    
    ctaContrastScore(ctaText) {
        const highContrastKeywords = ['지금', '무료', '시작', '바로', '즉시'];
        const score = highContrastKeywords.filter(k => ctaText.includes(k)).length;
        return Math.min(score * 3, 10);
    },
    
    templateScore(template) {
        const scores = {
            'urgency': 9,
            'benefit': 8,
            'fear_address': 7,
            'question': 6,
            'compare': 5,
            'story': 4
        };
        return scores[template] || 5;
    },
    
    calculateTotalScore(variant) {
        return this.hookLengthScore(variant.hook?.length || 0) +
               this.ctaContrastScore(variant.cta || '') +
               this.templateScore(variant.template);
    },
    
    findBestVariant(variants) {
        if (!variants || variants.length === 0) return null;
        
        let bestIndex = 0;
        let bestScore = 0;
        
        variants.forEach((variant, index) => {
            const score = this.calculateTotalScore(variant);
            if (score > bestScore) {
                bestScore = score;
                bestIndex = index;
            }
        });
        
        return { index: bestIndex, score: bestScore };
    }
};

// Thumbnail grouping utilities
const THUMBNAIL_GROUPS = {
    groupVariantsByCategory(variants) {
        const grouped = {
            square: [],
            rectangle: [],
            landing: []
        };
        
        variants.forEach((variant, index) => {
            const category = this.getCategoryForVariant(variant);
            grouped[category].push({ ...variant, originalIndex: index });
        });
        
        return grouped;
    },
    
    getCategoryForVariant(variant) {
        const ratio = variant.ratio || '1:1';
        
        if (ratio === '1:1' || ratio === '4:5') {
            return 'square';
        } else if (ratio === '16:9' || ratio === '9:16') {
            return 'rectangle';
        } else if (variant.template === 'hero' || variant.platform === 'landing') {
            return 'landing';
        }
        
        return 'square';
    },
    
    distributeVariantsToCategories(count = 20) {
        const distribution = {
            square: Math.floor(count * 0.4),
            rectangle: Math.floor(count * 0.4),
            landing: Math.floor(count * 0.2)
        };
        
        const remainder = count - (distribution.square + distribution.rectangle + distribution.landing);
        distribution.square += remainder;
        
        return distribution;
    }
};

// Get layout category
function getLayoutCategory(categoryId) {
    return LAYOUT_CATEGORIES[categoryId] || LAYOUT_CATEGORIES.square;
}

// Get available categories
function getAvailableCategories() {
    return Object.values(LAYOUT_CATEGORIES).map(c => ({
        id: c.id,
        name: c.name,
        icon: c.icon,
        description: c.description
    }));
}

// Get sizes for category
function getCategorySizes(categoryId) {
    const category = LAYOUT_CATEGORIES[categoryId];
    return category ? category.sizes : [];
}

// Get layout structure
function getLayoutStructure(categoryId, structureId) {
    const structures = LAYOUT_STRUCTURES[categoryId];
    if (!structures) return null;
    return structures[structureId] || Object.values(structures)[0];
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LAYOUT_CATEGORIES,
        LAYOUT_STRUCTURES,
        VARIANT_SCORING,
        THUMBNAIL_GROUPS,
        getLayoutCategory,
        getAvailableCategories,
        getCategorySizes,
        getLayoutStructure
    };
}
