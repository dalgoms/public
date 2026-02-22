/**
 * Strategy Templates - Figma-based Design Templates
 * 전략 템플릿: Figma에서 가져온 디자인 프리셋
 */

const STRATEGY_TEMPLATES = {
    // Template 1: Blue Question (파란색 질문형)
    blueQuestion: {
        id: 'blueQuestion',
        name: 'Blue Question',
        nameKo: '파란색 질문형',
        description: 'Bold question with blue background and wave pattern',
        thumbnail: 'https://www.figma.com/api/mcp/asset/7de9ea79-4042-489a-9655-2d533a8d3297',
        category: 'engagement',
        
        // Canvas settings
        canvas: {
            width: 1080,
            height: 1080,
            background: {
                type: 'solid',
                color: '#2a79ff'
            }
        },
        
        // Elements
        elements: [
            {
                type: 'text',
                id: 'label-top',
                content: "WHAT'S NEW?",
                style: {
                    fontFamily: 'Inter',
                    fontSize: 28,
                    fontWeight: '400',
                    color: '#ffffff',
                    opacity: 0.7,
                    textTransform: 'uppercase',
                    letterSpacing: '3px'
                },
                position: { x: 120, y: 280, anchor: 'top-left' }
            },
            {
                type: 'text',
                id: 'headline',
                content: '🔎 Where do you find fresh underwear?',
                style: {
                    fontFamily: 'Inter',
                    fontSize: 88,
                    fontWeight: '700',
                    color: '#ffffff',
                    lineHeight: 1.1
                },
                position: { x: 120, y: 392, width: 840, anchor: 'top-left' }
            },
            {
                type: 'text',
                id: 'counter',
                content: '1 of 10',
                style: {
                    fontFamily: 'Inter',
                    fontSize: 28,
                    fontWeight: '400',
                    color: '#ffffff',
                    opacity: 0.7
                },
                position: { x: 120, y: 680, anchor: 'top-left' }
            },
            {
                type: 'text',
                id: 'hashtag',
                content: '# our favorite question',
                style: {
                    fontFamily: 'Inter',
                    fontSize: 32,
                    fontWeight: '400',
                    color: '#ffffff',
                    opacity: 0.7,
                    textTransform: 'lowercase'
                },
                position: { x: 120, y: 880, anchor: 'top-left' }
            },
            {
                type: 'text',
                id: 'label-right',
                content: 'PERSONAL ACCOUNT',
                style: {
                    fontFamily: 'Inter',
                    fontSize: 28,
                    fontWeight: '400',
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    textAlign: 'right'
                },
                position: { x: 960, y: 120, anchor: 'top-right' }
            }
        ],
        
        // Logo/brand area
        logo: {
            position: { x: 120, y: 120 },
            text: 'youami',
            icon: 'face'
        }
    },
    
    // Template 2: Dark Question (어두운 질문형)
    darkQuestion: {
        id: 'darkQuestion',
        name: 'Dark Question',
        nameKo: '다크 질문형',
        description: 'Bold question with dark background and zigzag pattern',
        thumbnail: 'https://www.figma.com/api/mcp/asset/faf72af7-d586-46ca-992b-48228e1e7e43',
        category: 'engagement',
        
        canvas: {
            width: 1080,
            height: 1080,
            background: {
                type: 'solid',
                color: '#2a272b'
            }
        },
        
        elements: [
            {
                type: 'text',
                id: 'label-top',
                content: 'GETTING STARTED',
                style: {
                    fontFamily: 'Inter',
                    fontSize: 28,
                    fontWeight: '400',
                    color: '#ffffff',
                    opacity: 0.7,
                    textTransform: 'uppercase',
                    letterSpacing: '3px'
                },
                position: { x: 120, y: 280, anchor: 'top-left' }
            },
            {
                type: 'text',
                id: 'headline',
                content: 'Do I even need to label my goods?',
                style: {
                    fontFamily: 'Inter',
                    fontSize: 88,
                    fontWeight: '700',
                    color: '#ffffff',
                    lineHeight: 1.1
                },
                position: { x: 120, y: 392, width: 840, anchor: 'top-left' }
            },
            {
                type: 'text',
                id: 'counter',
                content: '1 of 10',
                style: {
                    fontFamily: 'Inter',
                    fontSize: 28,
                    fontWeight: '400',
                    color: '#ffffff',
                    opacity: 0.7
                },
                position: { x: 120, y: 680, anchor: 'top-left' }
            },
            {
                type: 'text',
                id: 'hashtag',
                content: '# our favorite question',
                style: {
                    fontFamily: 'Inter',
                    fontSize: 32,
                    fontWeight: '400',
                    color: '#ffffff',
                    opacity: 0.7,
                    textTransform: 'lowercase'
                },
                position: { x: 120, y: 880, anchor: 'top-left' }
            },
            {
                type: 'text',
                id: 'label-right',
                content: 'CASHIER APP',
                style: {
                    fontFamily: 'Inter',
                    fontSize: 28,
                    fontWeight: '400',
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    textAlign: 'right'
                },
                position: { x: 960, y: 120, anchor: 'top-right' }
            }
        ],
        
        logo: {
            position: { x: 120, y: 120 },
            text: 'youami',
            icon: 'face'
        }
    },
    
    // Template 3: White Question (흰색 질문형)
    whiteQuestion: {
        id: 'whiteQuestion',
        name: 'White Question',
        nameKo: '화이트 질문형',
        description: 'Bold question with white background and emoji image',
        thumbnail: 'https://www.figma.com/api/mcp/asset/fd59726e-a1b6-4ffc-9201-68c970bbbe03',
        category: 'engagement',
        
        canvas: {
            width: 1080,
            height: 1080,
            background: {
                type: 'solid',
                color: '#ffffff'
            }
        },
        
        elements: [
            {
                type: 'text',
                id: 'label-top',
                content: "WHAT'S NEW?",
                style: {
                    fontFamily: 'Inter',
                    fontSize: 28,
                    fontWeight: '400',
                    color: '#2a272b',
                    opacity: 0.7,
                    textTransform: 'uppercase',
                    letterSpacing: '3px'
                },
                position: { x: 120, y: 280, anchor: 'top-left' }
            },
            {
                type: 'text',
                id: 'headline',
                content: 'Where have you tasted the most delicious sushi?',
                style: {
                    fontFamily: 'Inter',
                    fontSize: 88,
                    fontWeight: '700',
                    color: '#2a272b',
                    lineHeight: 1.1
                },
                position: { x: 120, y: 392, width: 840, anchor: 'top-left' }
            },
            {
                type: 'text',
                id: 'counter',
                content: '1 of 10',
                style: {
                    fontFamily: 'Inter',
                    fontSize: 28,
                    fontWeight: '400',
                    color: '#2a272b',
                    opacity: 0.7
                },
                position: { x: 120, y: 680, anchor: 'top-left' }
            },
            {
                type: 'text',
                id: 'hashtag',
                content: '# our favorite question',
                style: {
                    fontFamily: 'Inter',
                    fontSize: 32,
                    fontWeight: '400',
                    color: '#2a272b',
                    opacity: 0.7,
                    textTransform: 'lowercase'
                },
                position: { x: 120, y: 880, anchor: 'top-left' }
            },
            {
                type: 'text',
                id: 'label-right',
                content: 'PERSONAL ACCOUNT',
                style: {
                    fontFamily: 'Inter',
                    fontSize: 28,
                    fontWeight: '400',
                    color: '#2a272b',
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    textAlign: 'right'
                },
                position: { x: 960, y: 120, anchor: 'top-right' }
            },
            {
                type: 'image',
                id: 'decorImage',
                src: 'https://www.figma.com/api/mcp/asset/fd59726e-a1b6-4ffc-9201-68c970bbbe03',
                style: {
                    width: 240,
                    height: 217,
                    objectFit: 'cover'
                },
                position: { x: 752, y: 760, anchor: 'top-left' }
            }
        ],
        
        logo: {
            position: { x: 120, y: 120 },
            text: 'youami',
            icon: 'face',
            color: '#2a272b'
        }
    }
};

/**
 * Apply template to canvas
 */
function applyStrategyTemplate(templateId) {
    const template = STRATEGY_TEMPLATES[templateId];
    if (!template) {
        console.error('Template not found:', templateId);
        return;
    }
    
    const canvas = document.getElementById('ad-canvas');
    const adContent = canvas?.querySelector('.ad-content');
    if (!canvas || !adContent) return;
    
    console.log('[StrategyTemplates] Applying template:', templateId);
    
    // First select background
    window.figmaPanelController?.selectObject('background', { switchToDesignTab: false });
    
    // Apply background
    const bg = template.canvas.background;
    if (bg.type === 'solid') {
        window.editorState?.updateActiveStyle('fillType', 'solid');
        window.editorState?.updateActiveStyle('fillColor', bg.color);
    } else if (bg.type === 'gradient') {
        window.editorState?.updateActiveStyle('fillType', 'gradient');
        window.editorState?.updateActiveStyle('gradientStart', bg.gradientStart);
        window.editorState?.updateActiveStyle('gradientEnd', bg.gradientEnd);
        window.editorState?.updateActiveStyle('gradientAngle', bg.gradientAngle || 135);
    }
    
    // Get text color based on background
    const textColor = template.elements.find(e => e.id === 'headline')?.style.color || '#ffffff';
    
    // Apply layout style (Figma design uses left alignment)
    adContent.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        text-align: left;
        padding: 22% 11% 15% 11%;
        gap: 16px;
    `;
    
    // Apply headline
    const headline = canvas.querySelector('.ad-headline');
    if (headline) {
        const headlineData = template.elements.find(e => e.id === 'headline');
        if (headlineData) {
            headline.textContent = headlineData.content;
            headline.style.cssText = `
                font-family: ${headlineData.style.fontFamily}, sans-serif;
                font-size: 44px;
                font-weight: ${headlineData.style.fontWeight};
                color: ${headlineData.style.color};
                line-height: ${headlineData.style.lineHeight};
                text-align: left;
                background: transparent;
                width: 100%;
                margin: 0;
                padding: 0;
            `;
        }
    }
    
    // Apply subtext (counter only)
    const subtext = canvas.querySelector('.ad-subtext');
    if (subtext) {
        const counterData = template.elements.find(e => e.id === 'counter');
        if (counterData) {
            subtext.textContent = counterData.content;
            subtext.style.cssText = `
                font-family: Inter, sans-serif;
                font-size: 14px;
                font-weight: 400;
                color: ${counterData.style.color};
                opacity: ${counterData.style.opacity};
                text-align: left;
                background: transparent;
                margin: 0;
                padding: 0;
            `;
        }
    }
    
    // Hide CTA for this template style
    const cta = canvas.querySelector('.ad-cta');
    if (cta) {
        cta.style.display = 'none';
    }
    
    // Add hashtag at bottom if not exists
    let hashtag = canvas.querySelector('.template-hashtag');
    const hashtagData = template.elements.find(e => e.id === 'hashtag');
    if (hashtagData) {
        if (!hashtag) {
            hashtag = document.createElement('div');
            hashtag.className = 'template-hashtag';
            canvas.appendChild(hashtag);
        }
        hashtag.textContent = hashtagData.content;
        hashtag.style.cssText = `
            position: absolute;
            bottom: 12%;
            left: 11%;
            font-family: Inter, sans-serif;
            font-size: 16px;
            font-weight: 400;
            color: ${hashtagData.style.color};
            opacity: ${hashtagData.style.opacity || 0.7};
            text-transform: lowercase;
        `;
    }
    
    // Refresh thumbnail preview
    window.figmaPanelController?.updateThumbnail?.();
    
    console.log('[StrategyTemplates] Applied template:', template.name);
}

/**
 * Get all templates as array
 */
function getStrategyTemplatesList() {
    return Object.values(STRATEGY_TEMPLATES);
}

/**
 * Render template selector UI
 */
function renderTemplateSelector(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const templates = getStrategyTemplatesList();
    
    container.innerHTML = templates.map(template => `
        <div class="strategy-template-card" data-template-id="${template.id}">
            <div class="template-preview" style="background-color: ${template.canvas.background.color}">
                <div class="template-preview-text" style="color: ${template.elements[1]?.style.color || '#fff'}">
                    ${template.nameKo}
                </div>
            </div>
            <div class="template-info">
                <span class="template-name">${template.name}</span>
            </div>
        </div>
    `).join('');
    
    // Bind click events
    container.querySelectorAll('.strategy-template-card').forEach(card => {
        card.addEventListener('click', () => {
            const templateId = card.dataset.templateId;
            applyStrategyTemplate(templateId);
            
            // Update active state
            container.querySelectorAll('.strategy-template-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
}

// Export for use
window.STRATEGY_TEMPLATES = STRATEGY_TEMPLATES;
window.applyStrategyTemplate = applyStrategyTemplate;
window.getStrategyTemplatesList = getStrategyTemplatesList;
window.renderTemplateSelector = renderTemplateSelector;
