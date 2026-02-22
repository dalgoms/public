/**
 * ============================================
 * EDITOR STATE - Object-Based State Management
 * ============================================
 * 
 * Every canvas element is registered as an object:
 * {
 *   id: string,
 *   type: "background" | "text" | "image" | "shape",
 *   element: HTMLElement,
 *   x: number,
 *   y: number,
 *   width: number,
 *   height: number,
 *   styles: { fill, stroke, fontSize, color, ... }
 * }
 */

class EditorState {
    constructor() {
        this.state = {
            activeElement: null,
            objects: new Map(),
            creativeSeed: {
                keyword: '',
                platform: 'meta',
                template: 'benefit',
                targets: ['b2c', 'b2b']
            },
            content: {
                headline: '',
                subtext: '',
                cta: ''
            },
            canvas: {
                aspectRatio: '1:1',
                width: 1080,
                height: 1080
            },
            safeZone: {
                left: 1080 * 0.08,
                right: 1080 * 0.08,
                top: 1080 * 0.10,
                bottom: 1080 * 0.12
            },
            textLayout: {
                headline: {
                    maxWidth: 1080 * 0.84,
                    maxLines: 2,
                    wrapMode: 'wrap',
                    align: 'center',
                    minFontSize: 28,
                    initialFontSize: 50
                },
                subtext: {
                    maxWidth: 1080 * 0.84,
                    maxLines: 2,
                    wrapMode: 'wrap',
                    align: 'center',
                    minFontSize: 18,
                    initialFontSize: 32
                }
            },
            background: {
                type: 'gradient',
                solidColor: '#00298A',
                gradient: {
                    start: '#001D61',
                    end: '#003C8A',
                    angle: 135
                },
                imageUrl: null,
                imageOverlay: 0,
                imageBlur: 0
            }
        };
        
        this.listeners = [];
    }
    
    // ============================================
    // OBJECT REGISTRATION
    // ============================================
    
    registerObject(id, type, element, styles = {}, position = null) {
        const defaultStyles = this.getDefaultStyles(type);
        
        // Get initial position from element if not provided
        let x = 0, y = 0, width = 0, height = 0;
        if (position) {
            x = position.x ?? 0;
            y = position.y ?? 0;
            width = position.width ?? 0;
            height = position.height ?? 0;
        } else if (element && type !== 'background') {
            const rect = element.getBoundingClientRect();
            const canvasRect = element.parentElement?.getBoundingClientRect() || { left: 0, top: 0 };
            x = parseInt(element.style.left) || (rect.left - canvasRect.left);
            y = parseInt(element.style.top) || (rect.top - canvasRect.top);
            width = element.offsetWidth || rect.width;
            height = element.offsetHeight || rect.height;
        }
        
        const obj = {
            id,
            type,
            element,
            visible: true,
            x,
            y,
            width,
            height,
            styles: { ...defaultStyles, ...styles }
        };
        this.state.objects.set(id, obj);
        this.emit('objectRegistered', obj);
        return obj;
    }
    
    unregisterObject(id) {
        if (this.state.objects.has(id)) {
            this.state.objects.delete(id);
            if (this.state.activeElement?.id === id) {
                this.clearActiveElement();
            }
            this.emit('objectUnregistered', id);
        }
    }
    
    getObject(id) {
        return this.state.objects.get(id);
    }
    
    getAllObjects() {
        return Array.from(this.state.objects.values());
    }
    
    getDefaultStyles(type) {
        switch (type) {
            case 'background':
                return {
                    fillType: 'gradient',
                    fillColor: '#00298A',
                    fillOpacity: 100,
                    gradientStart: '#001D61',
                    gradientEnd: '#003C8A',
                    gradientAngle: 135,
                    image: null,
                    imageOverlay: 0,
                    imageBlur: 0
                };
            case 'text':
                return {
                    fillColor: '#ffffff',
                    fillOpacity: 100,
                    fontFamily: 'Inter',
                    fontWeight: '400',
                    fontSize: 50,
                    lineHeight: 1.2,
                    letterSpacing: 0,
                    textAlign: 'center'
                };
            case 'shape':
                return {
                    fillColor: '#3b82f6',
                    fillOpacity: 100,
                    strokeColor: '#ffffff',
                    strokeWidth: 0,
                    strokePosition: 'inside',
                    borderRadius: 0
                };
            case 'image':
                return {
                    fillOpacity: 100,
                    strokeColor: '#ffffff',
                    strokeWidth: 0,
                    strokePosition: 'inside',
                    borderRadius: 0,
                    objectFit: 'cover'
                };
            default:
                return {};
        }
    }
    
    // ============================================
    // SAFE ZONE & TEXT LAYOUT
    // ============================================
    
    updateCanvasSize(width, height) {
        this.state.canvas.width = width;
        this.state.canvas.height = height;
        
        // Update safe zone
        this.state.safeZone = {
            left: width * 0.08,
            right: width * 0.08,
            top: height * 0.10,
            bottom: height * 0.12
        };
        
        // Update text layout constraints
        const maxTextWidth = width - this.state.safeZone.left - this.state.safeZone.right;
        this.state.textLayout.headline.maxWidth = maxTextWidth;
        this.state.textLayout.subtext.maxWidth = maxTextWidth;
        
        this.emit('canvasSizeChange', { width, height, safeZone: this.state.safeZone });
    }
    
    getSafeZone() {
        return this.state.safeZone;
    }
    
    getTextLayout(type) {
        return this.state.textLayout[type] || null;
    }
    
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
    
    clampPosition(x, y, elementWidth, elementHeight) {
        const sz = this.state.safeZone;
        const cw = this.state.canvas.width;
        const ch = this.state.canvas.height;
        
        return {
            x: this.clamp(x, sz.left, cw - sz.right - elementWidth),
            y: this.clamp(y, sz.top, ch - sz.bottom - elementHeight)
        };
    }
    
    // ============================================
    // ACTIVE ELEMENT
    // ============================================
    
    get activeElement() {
        return this.state.activeElement;
    }
    
    setActiveElement(id) {
        const obj = this.state.objects.get(id);
        
        if (obj) {
            this.state.activeElement = obj;
            this.emit('activeElementChange', obj);
        } else {
            // Try to find element and register it dynamically
            const element = document.querySelector(`[data-layer-id="${id}"], [data-layer="${id}"]`);
            if (element) {
                // Determine type
                let type = 'shape';
                if (element.classList.contains('canvas-text') || 
                    element.classList.contains('ad-headline') || 
                    element.classList.contains('ad-subtext')) {
                    type = 'text';
                } else if (element.classList.contains('ad-cta')) {
                    type = 'shape';
                } else if (element.tagName === 'IMG') {
                    type = 'image';
                }
                
                // Register and then set active
                const newObj = this.registerObject(id, type, element, this.getDefaultStyles(type));
                this.state.activeElement = newObj;
                this.emit('activeElementChange', newObj);
            } else {
                this.state.activeElement = null;
                this.emit('activeElementChange', null);
            }
        }
    }
    
    clearActiveElement() {
        this.state.activeElement = null;
        this.emit('activeElementChange', null);
    }
    
    // ============================================
    // POSITION UPDATES (State-Driven Movement)
    // ============================================
    
    updateObjectPosition(id, x, y) {
        const obj = this.state.objects.get(id);
        if (!obj) return;
        
        obj.x = x;
        obj.y = y;
        
        // Apply to DOM
        this.applyPositionToElement(obj);
        this.emit('positionChange', { id, x, y });
    }
    
    
    applyPositionToElement(obj) {
        if (!obj || !obj.element || obj.type === 'background') return;
        
        obj.element.style.left = `${obj.x}px`;
        obj.element.style.top = `${obj.y}px`;
    }
    
    // ============================================
    // BACKGROUND STATE
    // ============================================
    
    setBackgroundType(type) {
        this.state.background.type = type;
        
        // Also update the background object's fillType
        const bgObj = this.state.objects.get('background');
        if (bgObj) {
            bgObj.styles.fillType = type;
            this.applyStylesToElement(bgObj);
        }
        
        this.emit('backgroundTypeChange', type);
    }
    
    setBackgroundSolidColor(color) {
        this.state.background.solidColor = color;
        this.state.background.type = 'solid';
        
        const bgObj = this.state.objects.get('background');
        if (bgObj) {
            bgObj.styles.fillColor = color;
            bgObj.styles.fillType = 'solid';
            this.applyStylesToElement(bgObj);
        }
        
        this.emit('backgroundChange', this.state.background);
    }
    
    setBackgroundGradient(start, end, angle) {
        if (start !== undefined) this.state.background.gradient.start = start;
        if (end !== undefined) this.state.background.gradient.end = end;
        if (angle !== undefined) this.state.background.gradient.angle = angle;
        
        const bgObj = this.state.objects.get('background');
        if (bgObj) {
            bgObj.styles.gradientStart = this.state.background.gradient.start;
            bgObj.styles.gradientEnd = this.state.background.gradient.end;
            bgObj.styles.gradientAngle = this.state.background.gradient.angle;
            if (this.state.background.type === 'gradient') {
                this.applyStylesToElement(bgObj);
            }
        }
        
        this.emit('backgroundChange', this.state.background);
    }
    
    setBackgroundImage(url, overlay) {
        if (url !== undefined) this.state.background.imageUrl = url;
        if (overlay !== undefined) this.state.background.imageOverlay = overlay;
        
        const bgObj = this.state.objects.get('background');
        if (bgObj) {
            bgObj.styles.image = this.state.background.imageUrl;
            bgObj.styles.imageOverlay = this.state.background.imageOverlay;
            if (this.state.background.type === 'image') {
                this.applyStylesToElement(bgObj);
            }
        }
        
        this.emit('backgroundChange', this.state.background);
    }
    
    getBackground() {
        return this.state.background;
    }
    
    // ============================================
    // STYLE UPDATES
    // ============================================
    
    updateActiveStyle(property, value) {
        if (!this.state.activeElement) return;
        
        this.state.activeElement.styles[property] = value;
        
        // Sync background state if updating background object
        if (this.state.activeElement.id === 'background') {
            this.syncBackgroundState(property, value);
        }
        
        this.emit('styleChange', {
            object: this.state.activeElement,
            property,
            value
        });
        
        // Apply to DOM
        this.applyStylesToElement(this.state.activeElement);
    }
    
    syncBackgroundState(property, value) {
        switch (property) {
            case 'fillType':
                this.state.background.type = value;
                break;
            case 'fillColor':
                this.state.background.solidColor = value;
                break;
            case 'gradientStart':
                this.state.background.gradient.start = value;
                break;
            case 'gradientEnd':
                this.state.background.gradient.end = value;
                break;
            case 'gradientAngle':
                this.state.background.gradient.angle = value;
                break;
            case 'image':
                this.state.background.imageUrl = value;
                break;
            case 'imageOverlay':
                this.state.background.imageOverlay = value;
                break;
            case 'imageBlur':
                this.state.background.imageBlur = value;
                break;
            case 'imageFit':
                this.state.background.imageFit = value;
                break;
        }
    }
    
    updateActiveStyles(styles) {
        if (!this.state.activeElement) return;
        
        Object.assign(this.state.activeElement.styles, styles);
        
        // Sync background state if updating background object
        if (this.state.activeElement.id === 'background') {
            Object.entries(styles).forEach(([prop, val]) => {
                this.syncBackgroundState(prop, val);
            });
        }
        
        this.emit('stylesChange', {
            object: this.state.activeElement,
            styles
        });
        
        // Apply to DOM
        this.applyStylesToElement(this.state.activeElement);
    }
    
    updateActivePosition(positionData) {
        if (!this.state.activeElement) return;
        if (this.state.activeElement.type === 'background') return;
        if (this.state.activeElement.locked) return;
        
        const obj = this.state.activeElement;
        
        if (positionData.x !== undefined) obj.x = positionData.x;
        if (positionData.y !== undefined) obj.y = positionData.y;
        if (positionData.rotation !== undefined) obj.rotation = positionData.rotation;
        
        this.emit('positionChange', {
            object: obj,
            position: positionData
        });
        
        this.applyPositionToElement(obj);
    }
    
    updateActiveSize(width, height) {
        if (!this.state.activeElement) return;
        if (this.state.activeElement.type === 'background') return;
        if (this.state.activeElement.locked) return;
        
        const obj = this.state.activeElement;
        const el = obj.element;
        
        obj.width = width;
        obj.height = height;
        
        if (el) {
            if (obj.type === 'text') {
                // For text, calculate font size based on width ratio
                const originalWidth = el.offsetWidth || 100;
                const originalFontSize = parseFloat(el.style.fontSize) || obj.styles?.fontSize || 50;
                const ratio = width / originalWidth;
                const newFontSize = Math.max(10, Math.round(originalFontSize * ratio));
                
                obj.styles = obj.styles || {};
                obj.styles.fontSize = newFontSize;
                el.style.fontSize = newFontSize + 'px';
                
                // Sync typography panel
                const fontSizeInput = document.getElementById('font-size');
                if (fontSizeInput) fontSizeInput.value = newFontSize;
            } else {
                // For shapes/images, directly set width and height
                el.style.width = width + 'px';
                el.style.height = height + 'px';
            }
        }
        
        this.emit('sizeChange', {
            object: obj,
            width,
            height
        });
        
        this.emit('positionChange', { object: obj });
    }
    
    updateActiveProperty(property, value) {
        if (!this.state.activeElement) return;
        
        this.state.activeElement[property] = value;
        
        this.emit('propertyChange', {
            object: this.state.activeElement,
            property,
            value
        });
    }
    
    applyPositionToElement(obj) {
        if (!obj || !obj.element) return;
        
        const el = obj.element;
        el.style.left = `${obj.x || 0}px`;
        el.style.top = `${obj.y || 0}px`;
        
        if (obj.rotation) {
            el.style.transform = `rotate(${obj.rotation}deg)`;
        } else {
            el.style.transform = '';
        }
    }
    
    applyStylesToElement(obj) {
        if (!obj || !obj.element) return;
        
        const el = obj.element;
        const s = obj.styles;
        
        // Apply type-specific styles
        switch (obj.type) {
            case 'text':
                // Text uses fillColor as text color, not background
                this.applyTextOnlyStyles(el, s);
                break;
            case 'cta':
                // CTA has both background color and text color
                this.applyCtaStyles(el, s);
                break;
            case 'background':
            case 'shape':
                // Background and shapes use fill rendering
                this.renderFill(obj.id, obj.type, el, s);
                if (obj.type === 'shape') {
                    this.applyStrokeStyles(el, s);
                }
                break;
            case 'image':
                this.renderFill(obj.id, obj.type, el, s);
                this.applyStrokeStyles(el, s);
                break;
        }
    }
    
    // CTA-specific styles (background + text color)
    applyCtaStyles(el, s) {
        // Background color
        el.style.background = s.fillColor || '#3B82F6';
        el.style.opacity = (s.fillOpacity ?? 100) / 100;
        
        // Text color
        el.style.color = s.textColor || '#ffffff';
        
        // Typography
        if (s.fontFamily) el.style.fontFamily = s.fontFamily;
        if (s.fontWeight) el.style.fontWeight = s.fontWeight;
        if (s.fontSize) el.style.fontSize = s.fontSize + 'px';
        if (s.borderRadius !== undefined) el.style.borderRadius = s.borderRadius + 'px';
    }
    
    // ============================================
    // UNIFIED FILL RENDERER - Single source of truth
    // ============================================
    
    renderFill(targetId, targetType, el, fillConfig) {
        const opacity = (fillConfig.fillOpacity ?? 100) / 100;
        const fillType = fillConfig.fillType || 'solid';
        
        // For background, handle special image container
        const bgImage = el.querySelector('.ad-bg-image');
        const overlay = el.querySelector('.ad-overlay');
        if (bgImage) bgImage.style.display = 'none';
        
        // Reset all fill styles first
        el.style.background = 'none';
        el.style.backgroundColor = 'transparent';
        
        switch (fillType) {
            case 'solid':
                el.style.backgroundColor = this.hexToRgba(fillConfig.fillColor || '#3b82f6', opacity);
                break;
                
            case 'gradient':
                const start = this.hexToRgba(fillConfig.gradientStart || fillConfig.fillColor || '#001D61', opacity);
                const end = this.hexToRgba(fillConfig.gradientEnd || '#003C8A', opacity);
                const angle = fillConfig.gradientAngle ?? 135;
                el.style.background = `linear-gradient(${angle}deg, ${start}, ${end})`;
                break;
                
            case 'image':
                if (fillConfig.image) {
                    // For background type with special image container
                    if (targetType === 'background' && bgImage) {
                        el.style.backgroundColor = '#1a1a1a';
                        bgImage.style.display = 'block';
                        bgImage.style.backgroundImage = `url(${fillConfig.image})`;
                        bgImage.style.backgroundSize = fillConfig.imageFit || 'cover';
                        bgImage.style.backgroundPosition = 'center';
                        
                        // Apply blur to background image
                        const blurValue = fillConfig.imageBlur ?? 0;
                        bgImage.style.filter = blurValue > 0 ? `blur(${blurValue}px)` : 'none';
                        
                        // Apply dark overlay
                        if (overlay) {
                            const overlayValue = fillConfig.imageOverlay ?? 0;
                            overlay.style.opacity = overlayValue / 100;
                            overlay.style.display = 'block';
                        }
                    } else {
                        // For shapes and other elements - direct background
                        el.style.background = `url(${fillConfig.image}) center/cover no-repeat`;
                        el.style.opacity = opacity;
                    }
                } else {
                    // No image yet, show placeholder color
                    el.style.backgroundColor = this.hexToRgba(fillConfig.fillColor || '#3b82f6', opacity);
                    if (overlay) {
                        overlay.style.opacity = 0;
                    }
                }
                break;
        }
    }
    
    // Text-specific styles (not fill)
    applyTextOnlyStyles(el, s) {
        // Ensure text has transparent background
        el.style.background = 'transparent';
        el.style.backgroundColor = 'transparent';
        
        // Apply text color (fillColor is text color for text elements)
        el.style.color = s.fillColor || '#ffffff';
        el.style.opacity = (s.fillOpacity ?? 100) / 100;
        el.style.fontFamily = s.fontFamily || 'Inter';
        el.style.fontWeight = s.fontWeight || '400';
        el.style.fontSize = (s.fontSize || 50) + 'px';
        el.style.lineHeight = s.lineHeight || 'normal';
        el.style.letterSpacing = (s.letterSpacing || 0) + '%';
        el.style.textAlign = s.textAlign || 'center';
    }
    
    // Stroke styles for shapes/images
    applyStrokeStyles(el, s) {
        if (s.strokeWidth > 0) {
            if (s.strokePosition === 'inside') {
                el.style.boxShadow = `inset 0 0 0 ${s.strokeWidth}px ${s.strokeColor}`;
                el.style.border = 'none';
            } else if (s.strokePosition === 'outside') {
                el.style.boxShadow = `0 0 0 ${s.strokeWidth}px ${s.strokeColor}`;
                el.style.border = 'none';
            } else {
                el.style.border = `${s.strokeWidth}px solid ${s.strokeColor}`;
                el.style.boxShadow = 'none';
            }
        } else {
            el.style.boxShadow = 'none';
            el.style.border = 'none';
        }
        
        if (s.borderRadius !== undefined) {
            el.style.borderRadius = s.borderRadius + 'px';
        }
    }
    
    // Legacy compatibility - redirect to renderFill
    applyImageStyles(el, s) {
        this.renderFill('image', 'image', el, s);
        this.applyStrokeStyles(el, s);
    }
    
    applyImageStrokesOnly(el, s) {
        if (s.strokeWidth > 0) {
            if (s.strokePosition === 'inside') {
                el.style.boxShadow = `inset 0 0 0 ${s.strokeWidth}px ${s.strokeColor}`;
            } else {
                el.style.boxShadow = `0 0 0 ${s.strokeWidth}px ${s.strokeColor}`;
            }
        }
        
        if (s.borderRadius !== undefined) {
            el.style.borderRadius = s.borderRadius + 'px';
        }
    }
    
    hexToRgba(hex, alpha = 1) {
        if (!hex) return 'transparent';
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    // ============================================
    // LAYERS (derived from objects)
    // ============================================
    
    get layers() {
        return this.getAllObjects()
            .filter(obj => obj.type !== 'background')
            .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
    }
    
    toggleLayerVisibility(id) {
        const obj = this.state.objects.get(id);
        if (obj) {
            obj.visible = !obj.visible;
            if (obj.element) {
                obj.element.style.visibility = obj.visible ? 'visible' : 'hidden';
            }
            this.emit('visibilityChange', obj);
        }
    }
    
    removeLayer(id) {
        const obj = this.state.objects.get(id);
        if (obj && obj.element) {
            obj.element.remove();
        }
        this.unregisterObject(id);
        this.emit('layersChange');
    }
    
    // ============================================
    // CREATIVE SEED
    // ============================================
    
    get creativeSeed() {
        return this.state.creativeSeed;
    }
    
    get content() {
        return this.state.content;
    }
    
    setKeyword(keyword) {
        this.state.creativeSeed.keyword = keyword;
    }
    
    setPlatform(platform) {
        this.state.creativeSeed.platform = platform;
    }
    
    setTemplate(template) {
        this.state.creativeSeed.template = template;
    }
    
    setContent(content) {
        this.state.content = { ...this.state.content, ...content };
    }
    
    // ============================================
    // EVENT SYSTEM
    // ============================================
    
    on(event, callback) {
        this.listeners.push({ event, callback });
    }
    
    off(event, callback) {
        this.listeners = this.listeners.filter(
            l => l.event !== event || l.callback !== callback
        );
    }
    
    emit(event, data) {
        this.listeners
            .filter(l => l.event === event)
            .forEach(l => l.callback(data));
    }
}

// Global instance
window.editorState = new EditorState();
