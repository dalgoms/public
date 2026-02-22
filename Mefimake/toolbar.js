// ============================================
// FIGMA-STYLE TOOLBAR CONTROLLER
// ============================================

class ToolbarController {
    constructor() {
        this.currentTool = 'select';
        this.zoomLevel = 100;
        this.isDrawing = false;
        this.drawingStart = null;
        this.drawingElement = null;
        this.shapes = [];
        this.selectedElement = null;
        
        // Pan (Space + Drag) 관련
        this.isPanning = false;
        this.isSpacePressed = false;
        this.panStart = { x: 0, y: 0 };
        this.panOffset = { x: 0, y: 0 };
        
        // Snap guide settings
        this.snapEnabled = true;
        this.snapThreshold = 8; // px
        this.guides = { vertical: null, horizontal: null };
        
        this.toolbar = document.getElementById('floating-toolbar');
        this.canvas = document.getElementById('ad-canvas');
        this.container = document.querySelector('.preview-container');
        this.zoomDisplay = document.getElementById('zoom-level');
        this.statusZoom = document.getElementById('status-zoom');
        this.zoomSlider = document.getElementById('zoom-slider');
        this.statusSelection = document.getElementById('status-selection');
        
        this.init();
        this.createSnapGuides();
    }
    
    createSnapGuides() {
        // Create vertical guide line
        this.guides.vertical = document.createElement('div');
        this.guides.vertical.className = 'snap-guide snap-guide-vertical';
        this.canvas?.appendChild(this.guides.vertical);
        
        // Create horizontal guide line
        this.guides.horizontal = document.createElement('div');
        this.guides.horizontal.className = 'snap-guide snap-guide-horizontal';
        this.canvas?.appendChild(this.guides.horizontal);
    }
    
    showGuide(type, position) {
        const guide = this.guides[type];
        if (!guide) return;
        
        guide.style.display = 'block';
        if (type === 'vertical') {
            guide.style.left = `${position}px`;
        } else {
            guide.style.top = `${position}px`;
        }
    }
    
    hideGuides() {
        if (this.guides.vertical) this.guides.vertical.style.display = 'none';
        if (this.guides.horizontal) this.guides.horizontal.style.display = 'none';
    }
    
    calculateSnap(x, y, elementWidth, elementHeight, excludeElement) {
        if (!this.snapEnabled || !this.canvas) return { x, y, snappedX: false, snappedY: false };
        
        const canvasWidth = this.canvas.offsetWidth;
        const canvasHeight = this.canvas.offsetHeight;
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        
        let snappedX = false;
        let snappedY = false;
        let finalX = x;
        let finalY = y;
        
        const elemCenterX = x + elementWidth / 2;
        const elemCenterY = y + elementHeight / 2;
        const elemRight = x + elementWidth;
        const elemBottom = y + elementHeight;
        
        // Snap to canvas center (vertical line)
        if (Math.abs(elemCenterX - centerX) < this.snapThreshold) {
            finalX = centerX - elementWidth / 2;
            snappedX = true;
            this.showGuide('vertical', centerX);
        }
        // Snap to left edge
        else if (Math.abs(x) < this.snapThreshold) {
            finalX = 0;
            snappedX = true;
            this.showGuide('vertical', 0);
        }
        // Snap to right edge
        else if (Math.abs(elemRight - canvasWidth) < this.snapThreshold) {
            finalX = canvasWidth - elementWidth;
            snappedX = true;
            this.showGuide('vertical', canvasWidth);
        }
        
        // Snap to canvas center (horizontal line)
        if (Math.abs(elemCenterY - centerY) < this.snapThreshold) {
            finalY = centerY - elementHeight / 2;
            snappedY = true;
            this.showGuide('horizontal', centerY);
        }
        // Snap to top edge
        else if (Math.abs(y) < this.snapThreshold) {
            finalY = 0;
            snappedY = true;
            this.showGuide('horizontal', 0);
        }
        // Snap to bottom edge
        else if (Math.abs(elemBottom - canvasHeight) < this.snapThreshold) {
            finalY = canvasHeight - elementHeight;
            snappedY = true;
            this.showGuide('horizontal', canvasHeight);
        }
        
        // Snap to other elements
        const elements = this.canvas.querySelectorAll('.ad-headline, .ad-subtext, .ad-cta, .ad-element');
        elements.forEach(el => {
            if (el === excludeElement) return;
            
            const elX = parseInt(el.style.left) || 0;
            const elY = parseInt(el.style.top) || 0;
            const elW = el.offsetWidth;
            const elH = el.offsetHeight;
            const elCenterX = elX + elW / 2;
            const elCenterY = elY + elH / 2;
            
            // Snap to other element's center X
            if (!snappedX && Math.abs(elemCenterX - elCenterX) < this.snapThreshold) {
                finalX = elCenterX - elementWidth / 2;
                snappedX = true;
                this.showGuide('vertical', elCenterX);
            }
            
            // Snap to other element's center Y
            if (!snappedY && Math.abs(elemCenterY - elCenterY) < this.snapThreshold) {
                finalY = elCenterY - elementHeight / 2;
                snappedY = true;
                this.showGuide('horizontal', elCenterY);
            }
            
            // Snap to other element's left edge
            if (!snappedX && Math.abs(x - elX) < this.snapThreshold) {
                finalX = elX;
                snappedX = true;
                this.showGuide('vertical', elX);
            }
            
            // Snap to other element's top edge
            if (!snappedY && Math.abs(y - elY) < this.snapThreshold) {
                finalY = elY;
                snappedY = true;
                this.showGuide('horizontal', elY);
            }
        });
        
        if (!snappedX) this.guides.vertical.style.display = 'none';
        if (!snappedY) this.guides.horizontal.style.display = 'none';
        
        return { x: finalX, y: finalY, snappedX, snappedY };
    }
    
    init() {
        this.bindToolButtons();
        this.bindActionButtons();
        this.bindKeyboardShortcuts();
        this.bindCanvasEvents();
        this.bindStatusBar();
        this.bindPropertyControls();
        this.bindPanEvents();
        this.centerCanvas();
        this.initExistingElements();
    }
    
    initExistingElements() {
        // Initialize existing canvas elements to be draggable and selectable
        const selectors = [
            '[data-layer]',
            '[data-layer-id]',
            '.ad-headline',
            '.ad-subtext',
            '.ad-cta'
        ];
        
        const existingElements = this.canvas.querySelectorAll(selectors.join(','));
        const processed = new Set();
        const canvasRect = this.canvas.getBoundingClientRect();
        
        existingElements.forEach(element => {
            if (processed.has(element)) return;
            processed.add(element);
            
            // Get or assign layer ID
            let layerId = element.dataset.layerId || element.dataset.layer;
            if (!layerId) {
                if (element.classList.contains('ad-headline')) {
                    layerId = 'headline';
                    element.dataset.layer = layerId;
                } else if (element.classList.contains('ad-subtext')) {
                    layerId = 'subtext';
                    element.dataset.layer = layerId;
                } else if (element.classList.contains('ad-cta')) {
                    layerId = 'cta';
                    element.dataset.layer = layerId;
                } else {
                    layerId = `element-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
                    element.dataset.layerId = layerId;
                }
            }
            
            // Ensure absolute positioning first
            element.style.position = 'absolute';
            
            // Get current visual position using getBoundingClientRect
            const elemRect = element.getBoundingClientRect();
            let x = elemRect.left - canvasRect.left;
            let y = elemRect.top - canvasRect.top;
            
            // Set explicit pixel positions (removes dependency on CSS/transform)
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            element.style.transform = 'none';
            
            // Sync position to EditorState if object exists
            if (window.editorState) {
                const obj = window.editorState.getObject(layerId);
                if (obj) {
                    obj.x = x;
                    obj.y = y;
                    obj.width = element.offsetWidth;
                    obj.height = element.offsetHeight;
                }
            }
            
            // Make draggable
            this.makeShapeDraggable(element);
        });
    }
    
    bindStatusBar() {
        const zoomInBtn = document.getElementById('zoom-in-btn');
        const zoomOutBtn = document.getElementById('zoom-out-btn');
        const zoomFitBtn = document.getElementById('zoom-fit-btn');
        const toggleMinimap = document.getElementById('toggle-minimap');
        const minimap = document.getElementById('minimap');
        const minimapClose = document.getElementById('minimap-close');
        
        zoomInBtn?.addEventListener('click', () => this.handleAction('zoom-in'));
        zoomOutBtn?.addEventListener('click', () => this.handleAction('zoom-out'));
        zoomFitBtn?.addEventListener('click', () => this.handleAction('fit'));
        
        this.zoomSlider?.addEventListener('input', (e) => {
            this.setZoom(parseInt(e.target.value));
        });
        
        // Minimap toggle
        toggleMinimap?.addEventListener('click', () => {
            minimap?.classList.toggle('visible');
            toggleMinimap.classList.toggle('active');
        });
        
        minimapClose?.addEventListener('click', () => {
            minimap?.classList.remove('visible');
            toggleMinimap?.classList.remove('active');
        });
    }
    
    bindToolButtons() {
        const toolBtns = this.toolbar.querySelectorAll('.tool-btn[data-tool]');
        toolBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectTool(btn.dataset.tool);
            });
        });
    }
    
    bindActionButtons() {
        const actionBtns = this.toolbar.querySelectorAll('.tool-btn[data-action]');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleAction(btn.dataset.action);
            });
        });
    }
    
    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            // Space key for pan mode
            if (e.code === 'Space' && !this.isSpacePressed) {
                e.preventDefault();
                this.isSpacePressed = true;
                this.container.classList.add('pan-mode');
                this.canvas.classList.add('pan-mode');
                return;
            }
            
            const shortcuts = {
                'v': 'select',
                'r': 'rectangle',
                'o': 'ellipse',
                'l': 'line',
                't': 'text'
            };
            
            if (shortcuts[e.key.toLowerCase()]) {
                e.preventDefault();
                this.selectTool(shortcuts[e.key.toLowerCase()]);
            }
            
            // Zoom shortcuts
            if (e.key === '=' || e.key === '+') {
                e.preventDefault();
                this.handleAction('zoom-in');
            }
            if (e.key === '-') {
                e.preventDefault();
                this.handleAction('zoom-out');
            }
            if (e.key === '0' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.handleAction('fit');
            }
            
            // Delete selected element
            if ((e.key === 'Delete' || e.key === 'Backspace') && this.selectedElement) {
                if (this.selectedElement.classList.contains('canvas-text') && 
                    this.selectedElement.classList.contains('editing')) {
                    return;
                }
                e.preventDefault();
                this.deleteSelectedElement();
            }
            
            // Escape to deselect
            if (e.key === 'Escape') {
                this.deselectAll();
                this.selectTool('select');
            }
        });
        
        // Space key release
        document.addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                this.isSpacePressed = false;
                this.isPanning = false;
                this.container.classList.remove('pan-mode');
                this.canvas.classList.remove('pan-mode');
            }
        });
    }
    
    bindCanvasEvents() {
        this.canvas.addEventListener('mousedown', (e) => this.onCanvasMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onCanvasMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onCanvasMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.onCanvasMouseUp(e));
        
        // Click outside to deselect (but NOT when clicking on control panel)
        document.addEventListener('click', (e) => {
            // Get control panel fresh each time (in case DOM changed)
            const controlPanel = document.querySelector('.control-panel');
            
            // Don't deselect when clicking on canvas, toolbar, or control panel
            const isInCanvas = this.canvas && this.canvas.contains(e.target);
            const isInToolbar = this.toolbar && this.toolbar.contains(e.target);
            const isInControlPanel = controlPanel && controlPanel.contains(e.target);
            
            if (!isInCanvas && !isInToolbar && !isInControlPanel) {
                this.deselectAll();
            }
        });
    }
    
    selectTool(tool) {
        this.currentTool = tool;
        
        // Update button states
        this.toolbar.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === tool);
        });
        
        // Update canvas cursor
        this.canvas.className = this.canvas.className.replace(/tool-\w+/g, '');
        this.canvas.classList.add(`tool-${tool}`);
        
        // Deselect when switching tools
        if (tool !== 'select') {
            this.deselectAll();
        }
        
        // Show tool feedback
        this.showToolFeedback(tool);
    }
    
    showToolFeedback(tool) {
        const toolNames = {
            'select': '선택 도구',
            'rectangle': '사각형',
            'ellipse': '원형',
            'line': '선',
            'text': '텍스트'
        };
        
        // Create or update feedback element
        let feedback = document.querySelector('.tool-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'tool-feedback';
            document.body.appendChild(feedback);
        }
        
        feedback.textContent = toolNames[tool] || tool;
        feedback.classList.add('visible');
        
        setTimeout(() => {
            feedback.classList.remove('visible');
        }, 800);
    }
    
    handleAction(action) {
        switch (action) {
            case 'zoom-in':
                this.setZoom(Math.min(this.zoomLevel + 10, 200));
                break;
            case 'zoom-out':
                this.setZoom(Math.max(this.zoomLevel - 10, 25));
                break;
            case 'fit':
                this.fitToScreen();
                break;
        }
    }
    
    setZoom(level) {
        this.zoomLevel = level;
        
        // Update all zoom displays
        if (this.zoomDisplay) this.zoomDisplay.textContent = `${level}%`;
        if (this.statusZoom) this.statusZoom.textContent = `${level}%`;
        if (this.zoomSlider) this.zoomSlider.value = level;
        
        const scale = level / 100;
        this.canvas.style.transform = `scale(${scale})`;
        this.canvas.style.transformOrigin = 'center center';
    }
    
    updateSelectionStatus(text) {
        if (this.statusSelection) {
            this.statusSelection.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
                </svg>
                ${text}
            `;
        }
    }
    
    onCanvasMouseDown(e) {
        if (e.target !== this.canvas && !e.target.classList.contains('ad-bg-image') && 
            !e.target.classList.contains('ad-overlay') && !e.target.classList.contains('ad-content')) {
            
            // Check if clicking on any editable element
            const isEditable = e.target.classList.contains('canvas-shape') || 
                               e.target.classList.contains('canvas-text') ||
                               e.target.classList.contains('ad-headline') ||
                               e.target.classList.contains('ad-subtext') ||
                               e.target.classList.contains('ad-cta') ||
                               e.target.dataset.layerId ||
                               e.target.dataset.layer;
            
            if (isEditable) {
                this.selectElement(e.target);
                return;
            }
            return;
        }
        
        const rect = this.canvas.getBoundingClientRect();
        const scale = this.zoomLevel / 100;
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;
        
        switch (this.currentTool) {
            case 'select':
                this.deselectAll();
                break;
            case 'text':
                this.createTextElement(x, y);
                break;
        }
    }
    
    onCanvasMouseMove(e) {
        if (!this.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const scale = this.zoomLevel / 100;
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;
        
        this.updateDrawing(x, y);
    }
    
    onCanvasMouseUp(e) {
        if (this.isDrawing) {
            this.finishDrawing();
        }
    }
    
    startDrawing(x, y) {
        this.isDrawing = true;
        this.drawingStart = { x, y };
        
        this.drawingElement = document.createElement('div');
        this.drawingElement.className = `drawing-shape ${this.currentTool}`;
        this.drawingElement.style.left = `${x}px`;
        this.drawingElement.style.top = `${y}px`;
        this.drawingElement.style.width = '0';
        this.drawingElement.style.height = '0';
        
        this.canvas.appendChild(this.drawingElement);
    }
    
    updateDrawing(x, y) {
        if (!this.drawingElement || !this.drawingStart) return;
        
        const width = x - this.drawingStart.x;
        const height = y - this.drawingStart.y;
        
        if (this.currentTool === 'line') {
            const length = Math.sqrt(width * width + height * height);
            const angle = Math.atan2(height, width) * (180 / Math.PI);
            this.drawingElement.style.width = `${length}px`;
            this.drawingElement.style.transform = `rotate(${angle}deg)`;
        } else {
            // Handle negative dimensions
            if (width < 0) {
                this.drawingElement.style.left = `${x}px`;
                this.drawingElement.style.width = `${-width}px`;
            } else {
                this.drawingElement.style.left = `${this.drawingStart.x}px`;
                this.drawingElement.style.width = `${width}px`;
            }
            
            if (height < 0) {
                this.drawingElement.style.top = `${y}px`;
                this.drawingElement.style.height = `${-height}px`;
            } else {
                this.drawingElement.style.top = `${this.drawingStart.y}px`;
                this.drawingElement.style.height = `${height}px`;
            }
        }
    }
    
    finishDrawing() {
        if (!this.drawingElement) return;
        
        const width = parseInt(this.drawingElement.style.width);
        const height = parseInt(this.drawingElement.style.height) || 2;
        
        // Remove if too small
        if (width < 10 && height < 10) {
            this.drawingElement.remove();
        } else {
            // Convert to permanent shape
            const layerId = `shape-${Date.now()}`;
            this.drawingElement.className = `canvas-shape ${this.currentTool}`;
            this.drawingElement.dataset.layerId = layerId;
            this.shapes.push(this.drawingElement);
            this.makeShapeDraggable(this.drawingElement);
            
            // Register with EditorState as object
            if (window.editorState) {
                window.editorState.registerObject(layerId, 'shape', this.drawingElement, {
                    fillType: 'solid',
                    fillColor: this.drawingElement.style.backgroundColor || '#3b82f6',
                    fillOpacity: 100,
                    gradientStart: '#3b82f6',
                    gradientEnd: '#8b5cf6',
                    gradientAngle: 135,
                    strokeColor: '#ffffff',
                    strokeWidth: 0,
                    borderRadius: this.currentTool === 'ellipse' ? 50 : 0
                });
                
            }
            
            this.selectElement(this.drawingElement);
        }
        
        this.isDrawing = false;
        this.drawingStart = null;
        this.drawingElement = null;
    }
    
    // Select all movable elements and move together
    selectAllElements() {
        const editableElements = this.canvas.querySelectorAll(
            '.ad-headline, .ad-subtext, .ad-cta, .canvas-text'
        );
        
        if (editableElements.length === 0) {
            this.updateSelectionStatus('이동 가능한 요소 없음');
            return;
        }
        
        // Clear previous selection
        this.deselectAll(false);
        
        // Select all elements
        this.selectedElements = Array.from(editableElements);
        this.selectedElements.forEach(el => {
            el.classList.add('selected');
        });
        
        this.isGroupMode = true;
        this.updateSelectionStatus(`${this.selectedElements.length}개 요소 선택됨 (그룹 이동)`);
        
        // Show group selection border
        this.showGroupBorder();
        
        // Update Position panel for group
        if (window.figmaPanelController) {
            window.figmaPanelController.updatePositionPanelForGroup();
        }
        
        // Switch back to select tool
        this.selectTool('select');
    }
    
    showGroupBorder() {
        // Remove existing group border
        this.hideGroupBorder();
        
        if (!this.selectedElements || this.selectedElements.length === 0) return;
        
        // Calculate bounding box
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        this.selectedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const canvasRect = this.canvas.getBoundingClientRect();
            const scale = this.zoomLevel / 100;
            
            const left = (rect.left - canvasRect.left) / scale;
            const top = (rect.top - canvasRect.top) / scale;
            const right = left + rect.width / scale;
            const bottom = top + rect.height / scale;
            
            minX = Math.min(minX, left);
            minY = Math.min(minY, top);
            maxX = Math.max(maxX, right);
            maxY = Math.max(maxY, bottom);
        });
        
        // Create group border element
        const border = document.createElement('div');
        border.className = 'group-selection-border';
        border.style.cssText = `
            position: absolute;
            left: ${minX - 5}px;
            top: ${minY - 5}px;
            width: ${maxX - minX + 10}px;
            height: ${maxY - minY + 10}px;
            border: 2px dashed #f59e0b;
            border-radius: 4px;
            pointer-events: none;
            z-index: 50;
        `;
        this.canvas.appendChild(border);
        this.groupBorder = border;
    }
    
    hideGroupBorder() {
        if (this.groupBorder) {
            this.groupBorder.remove();
            this.groupBorder = null;
        }
    }
    
    // Move all selected elements together
    moveGroupBy(dx, dy) {
        if (!this.selectedElements || this.selectedElements.length === 0) return;
        
        this.selectedElements.forEach(el => {
            const currentX = parseInt(el.style.left) || 0;
            const currentY = parseInt(el.style.top) || 0;
            el.style.left = `${currentX + dx}px`;
            el.style.top = `${currentY + dy}px`;
            
            // Sync to state
            const layerId = el.dataset.layerId || el.dataset.layer;
            if (window.editorState && layerId) {
                const obj = window.editorState.getObject(layerId);
                if (obj) {
                    obj.x = currentX + dx;
                    obj.y = currentY + dy;
                }
            }
        });
        
        // Update group border
        this.showGroupBorder();
    }
    
    createTextElement(x, y) {
        const layerId = `text-${Date.now()}`;
        
        const textEl = document.createElement('div');
        textEl.className = 'canvas-text';
        textEl.contentEditable = true;
        textEl.style.left = `${x}px`;
        textEl.style.top = `${y}px`;
        textEl.textContent = '텍스트 입력';
        textEl.dataset.layerId = layerId;
        
        this.canvas.appendChild(textEl);
        this.shapes.push(textEl);
        
        // Register with EditorState as object
        if (window.editorState) {
            window.editorState.registerObject(layerId, 'text', textEl, {
                fillColor: '#ffffff',
                fillOpacity: 100,
                fontFamily: 'Pretendard',
                fontWeight: '400',
                fontSize: 24,
                lineHeight: 1.4,
                letterSpacing: 0,
                textAlign: 'left'
            });
            
        }
        
        // Start editing immediately
        textEl.classList.add('editing');
        textEl.focus();
        
        // Select all text
        const range = document.createRange();
        range.selectNodeContents(textEl);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        
        // Handle blur
        textEl.addEventListener('blur', () => {
            textEl.classList.remove('editing');
            if (textEl.textContent.trim() === '') {
                textEl.remove();
                const idx = this.shapes.indexOf(textEl);
                if (idx > -1) this.shapes.splice(idx, 1);
                // Remove from EditorState
                if (window.editorState) {
                    window.editorState.removeLayer(layerId);
                }
            }
        });
        
        this.makeShapeDraggable(textEl);
        this.selectElement(textEl);
    }
    
    makeShapeDraggable(element) {
        // Mark element as draggable to prevent duplicate bindings
        if (element.dataset.draggable === 'true') return;
        element.dataset.draggable = 'true';
        
        let isDragging = false;
        let startMouseX, startMouseY, startElemX, startElemY;
        const layerId = element.dataset.layerId || element.dataset.layer;
        
        const onMouseDown = (e) => {
            // Don't drag if editing text
            if (element.classList.contains('editing')) return;
            // Don't drag if clicking on contenteditable
            if (element.contentEditable === 'true' && document.activeElement === element) return;
            // Don't drag if element is locked
            if (layerId && window.editorState) {
                const obj = window.editorState.getObject(layerId);
                if (obj?.locked) return;
            }
            
            e.stopPropagation();
            e.preventDefault();
            isDragging = true;
            
            // Store starting mouse position (raw client coordinates)
            startMouseX = e.clientX;
            startMouseY = e.clientY;
            
            // Get current element position from DOM directly
            startElemX = parseInt(element.style.left) || 0;
            startElemY = parseInt(element.style.top) || 0;
            
            // Reset group drag delta
            this.lastDx = 0;
            this.lastDy = 0;
            
            // In group mode, don't change selection
            if (!this.isGroupMode) {
                this.selectElement(element);
            }
            element.style.cursor = 'grabbing';
            document.body.style.cursor = 'grabbing';
            
            // Add temporary document listeners
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };
        
        const onMouseMove = (e) => {
            if (!isDragging) return;
            
            // Calculate delta from start position (considering zoom)
            const scale = (this.zoomLevel || 100) / 100;
            const dx = (e.clientX - startMouseX) / scale;
            const dy = (e.clientY - startMouseY) / scale;
            
            // Group mode: move all selected elements together
            if (this.isGroupMode && this.selectedElements?.length > 0) {
                const deltaX = dx - (this.lastDx || 0);
                const deltaY = dy - (this.lastDy || 0);
                this.moveGroupBy(deltaX, deltaY);
                this.lastDx = dx;
                this.lastDy = dy;
            } else {
                // Single element mode with snap
                let newX = startElemX + dx;
                let newY = startElemY + dy;
                
                // Apply snap
                const snapped = this.calculateSnap(
                    newX, newY, 
                    element.offsetWidth, element.offsetHeight,
                    element
                );
                newX = snapped.x;
                newY = snapped.y;
                
                element.style.left = `${newX}px`;
                element.style.top = `${newY}px`;
                
                // Real-time position update
                if (window.editorState && layerId) {
                    const obj = window.editorState.getObject(layerId);
                    if (obj) {
                        obj.x = Math.round(newX);
                        obj.y = Math.round(newY);
                        if (window.figmaPanelController) {
                            window.figmaPanelController.updatePositionPanel(obj);
                        }
                    }
                }
            }
        };
        
        const onMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'move';
                document.body.style.cursor = '';
                
                // Hide snap guides
                this.hideGuides();
                
                // Reset group delta
                this.lastDx = 0;
                this.lastDy = 0;
                
                // Group mode: update group border
                if (this.isGroupMode) {
                    this.showGroupBorder();
                } else {
                    // Single element: sync final position to state
                    const finalX = parseInt(element.style.left) || 0;
                    const finalY = parseInt(element.style.top) || 0;
                    
                    if (window.editorState && layerId) {
                        const obj = window.editorState.getObject(layerId);
                        if (obj) {
                            obj.x = finalX;
                            obj.y = finalY;
                            window.editorState.emit('positionChange', {
                                object: obj,
                                position: { x: finalX, y: finalY }
                            });
                        }
                    }
                }
            }
            // Remove temporary listeners
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        
        element.addEventListener('mousedown', onMouseDown);
        
        // Double click to edit text
        element.addEventListener('dblclick', (e) => {
            if (element.classList.contains('canvas-text') || 
                element.classList.contains('ad-headline') ||
                element.classList.contains('ad-subtext') ||
                element.classList.contains('ad-cta')) {
                e.stopPropagation();
                element.classList.add('editing');
                element.contentEditable = true;
                element.focus();
            }
        });
        
        // Handle blur for text editing
        element.addEventListener('blur', () => {
            element.classList.remove('editing');
            element.contentEditable = false;
        });
        
        // Set initial cursor
        element.style.cursor = 'move';
    }
    
    selectElement(element) {
        // Don't clear state during reselection - we'll set the new active element below
        this.deselectAll(false);
        element.classList.add('selected');
        this.selectedElement = element;
        
        // Add resize handles for shapes, text, and image elements
        const isText = element.classList.contains('canvas-text') || 
                       element.classList.contains('ad-headline') || 
                       element.classList.contains('ad-subtext') ||
                       element.classList.contains('ad-cta');
        const isShape = element.classList.contains('canvas-shape');
        const isImage = element.id?.startsWith('icon-') || element.querySelector('img');
        
        if (isShape || isText || isImage) {
            this.addResizeHandles(element, isImage ? 'image' : (isText ? 'text' : 'shape'));
        }
        
        // Update status bar
        let typeName = '요소';
        if (isImage) {
            typeName = '이미지';
        } else if (isText && !element.classList.contains('ad-cta')) {
            typeName = '텍스트';
        } else if (element.classList.contains('ad-cta')) {
            typeName = 'CTA 버튼';
        } else if (element.classList.contains('rectangle') || element.classList.contains('canvas-shape')) {
            typeName = '도형';
        } else if (element.classList.contains('ellipse')) {
            typeName = '원형';
        } else if (element.classList.contains('line')) {
            typeName = '선';
        }
        
        this.updateSelectionStatus(typeName + ' 선택됨');
        
        // Notify FigmaPanel to select this object (with fromToolbar flag to prevent infinite loop)
        const layerId = element.dataset.layerId || element.dataset.layer;
        
        if (layerId) {
            // Try FigmaPanelController first
            if (window.figmaPanelController) {
                window.figmaPanelController.selectObject(layerId, { fromToolbar: true });
            } else {
                // Fallback: use EditorState directly
                if (window.editorState) {
                    window.editorState.setActiveElement(layerId);
                }
            }
        }
    }
    
    deselectAll(clearState = true) {
        // Remove resize handles
        this.removeResizeHandles();
        
        // Clear group mode
        this.isGroupMode = false;
        this.selectedElements = [];
        this.hideGroupBorder();
        
        this.canvas.querySelectorAll('.selected').forEach(el => {
            el.classList.remove('selected');
        });
        this.selectedElement = null;
        this.updateSelectionStatus('선택 없음');
        
        // Only clear active element when explicitly deselecting (not during reselection)
        if (clearState && window.editorState) {
            window.editorState.clearActiveElement();
        }
    }
    
    addResizeHandles(element, elementType = 'shape') {
        this.removeResizeHandles();
        
        // For text and image, only use corner handles for proportional resize
        const handles = (elementType === 'text' || elementType === 'image')
            ? ['nw', 'ne', 'sw', 'se'] 
            : ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];
            
        handles.forEach(pos => {
            const handle = document.createElement('div');
            handle.className = `resize-handle ${pos}`;
            handle.dataset.handle = pos;
            handle.dataset.elementType = elementType;
            element.appendChild(handle);
            
            handle.addEventListener('mousedown', (e) => this.startResize(e, element, pos, elementType));
        });
    }
    
    removeResizeHandles() {
        this.canvas.querySelectorAll('.resize-handle').forEach(h => h.remove());
    }
    
    startResize(e, element, handle, elementType = 'shape') {
        e.stopPropagation();
        e.preventDefault();
        
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = element.offsetWidth;
        const startHeight = element.offsetHeight;
        const startLeft = parseInt(element.style.left) || 0;
        const startTop = parseInt(element.style.top) || 0;
        const scale = (this.zoomLevel || 100) / 100;
        
        // For text and image elements - proportional resize
        const isTextElement = elementType === 'text';
        const isImageElement = elementType === 'image';
        const isProportional = isTextElement || isImageElement;
        const aspectRatio = startWidth / startHeight;
        const startFontSize = isTextElement ? parseFloat(window.getComputedStyle(element).fontSize) || 24 : 0;
        
        const onMouseMove = (e) => {
            const dx = (e.clientX - startX) / scale;
            const dy = (e.clientY - startY) / scale;
            
            if (isProportional) {
                // Proportional resize for text and images
                let delta = 0;
                if (handle === 'se') delta = Math.max(dx, dy);
                else if (handle === 'nw') delta = -Math.max(-dx, -dy);
                else if (handle === 'ne') delta = Math.max(dx, -dy);
                else if (handle === 'sw') delta = Math.max(-dx, dy);
                
                const newWidth = Math.max(20, startWidth + delta);
                const newHeight = Math.max(20, newWidth / aspectRatio);
                const scaleFactor = newWidth / startWidth;
                
                let newLeft = startLeft;
                let newTop = startTop;
                
                if (handle === 'nw' || handle === 'sw') {
                    newLeft = startLeft - (newWidth - startWidth);
                }
                if (handle === 'nw' || handle === 'ne') {
                    newTop = startTop - (newHeight - startHeight);
                }
                
                element.style.width = `${newWidth}px`;
                element.style.height = `${newHeight}px`;
                element.style.left = `${newLeft}px`;
                element.style.top = `${newTop}px`;
                
                // For text, also scale font size proportionally
                if (isTextElement && startFontSize > 0) {
                    const newFontSize = Math.max(8, Math.min(300, Math.round(startFontSize * scaleFactor)));
                    element.style.fontSize = `${newFontSize}px`;
                }
            } else {
                // Shape resize: change dimensions
                let newWidth = startWidth;
                let newHeight = startHeight;
                let newLeft = startLeft;
                let newTop = startTop;
                
                if (handle.includes('e')) {
                    newWidth = Math.max(20, startWidth + dx);
                }
                if (handle.includes('w')) {
                    newWidth = Math.max(20, startWidth - dx);
                    newLeft = startLeft + dx;
                }
                if (handle.includes('s')) {
                    newHeight = Math.max(20, startHeight + dy);
                }
                if (handle.includes('n')) {
                    newHeight = Math.max(20, startHeight - dy);
                    newTop = startTop + dy;
                }
                
                element.style.width = `${newWidth}px`;
                element.style.height = `${newHeight}px`;
                element.style.left = `${newLeft}px`;
                element.style.top = `${newTop}px`;
            }
        };
        
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            
            // Sync to state
            const layerId = element.dataset.layerId || element.dataset.layer;
            if (window.editorState && layerId) {
                const obj = window.editorState.getObject(layerId);
                if (obj) {
                    obj.x = parseInt(element.style.left) || 0;
                    obj.y = parseInt(element.style.top) || 0;
                    obj.width = element.offsetWidth;
                    obj.height = element.offsetHeight;
                    
                    // Update font size in styles for text elements
                    if (isTextElement) {
                        const newFontSize = parseFloat(window.getComputedStyle(element).fontSize) || 24;
                        obj.styles.fontSize = newFontSize;
                        
                        // Sync to panel
                        const fontSizeInput = document.getElementById('font-size');
                        if (fontSizeInput) fontSizeInput.value = Math.round(newFontSize);
                    }
                    
                    // Emit position change event
                    window.editorState.emit('positionChange', {
                        object: obj,
                        position: { x: obj.x, y: obj.y }
                    });
                }
            }
        };
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
    
    showContextPanel(element) {
        const section = document.getElementById('section-context');
        const controls = document.getElementById('context-controls');
        const title = document.getElementById('context-title');
        
        if (!section || !controls) return;
        
        section.style.display = 'block';
        section.classList.add('open');
        
        // Determine type - include existing elements
        const isText = element.classList.contains('canvas-text') || 
                       element.classList.contains('ad-headline') || 
                       element.classList.contains('ad-subtext');
        const isShape = element.classList.contains('canvas-shape');
        const isCTA = element.classList.contains('ad-cta');
        
        if (title) {
            if (isText) title.textContent = '텍스트';
            else if (isCTA) title.textContent = 'CTA 버튼';
            else if (isShape) title.textContent = '도형';
            else title.textContent = '요소';
        }
        
        // Generate controls based on type
        controls.innerHTML = this.generateContextControls(element, isText, isShape, isCTA);
        this.bindContextControls(element);
    }
    
    hideContextPanel() {
        const section = document.getElementById('section-context');
        if (section) {
            section.style.display = 'none';
        }
    }
    
    generateContextControls(element, isText, isShape, isCTA = false) {
        let html = '';
        
        // Position & Size (common)
        const left = parseInt(element.style.left) || 0;
        const top = parseInt(element.style.top) || 0;
        const width = element.offsetWidth || 100;
        const height = element.offsetHeight || 100;
        
        html += `
            <div class="context-group">
                <div class="context-group-title">Position</div>
                <div class="context-row">
                    <div class="context-field">
                        <label>X</label>
                        <input type="number" id="ctx-x" value="${left}" class="ctx-input">
                    </div>
                    <div class="context-field">
                        <label>Y</label>
                        <input type="number" id="ctx-y" value="${top}" class="ctx-input">
                    </div>
                </div>
                <div class="context-row">
                    <div class="context-field">
                        <label>W</label>
                        <input type="number" id="ctx-w" value="${width}" class="ctx-input">
                    </div>
                    <div class="context-field">
                        <label>H</label>
                        <input type="number" id="ctx-h" value="${height}" class="ctx-input">
                    </div>
                </div>
            </div>
        `;
        
        // CTA button controls
        if (isCTA) {
            const bgColor = this.rgbToHex(element.style.backgroundColor || getComputedStyle(element).backgroundColor || '#c8ff00');
            const textColor = this.rgbToHex(element.style.color || getComputedStyle(element).color || '#000000');
            const size = parseInt(element.style.fontSize) || parseInt(getComputedStyle(element).fontSize) || 14;
            const radius = parseInt(element.style.borderRadius) || parseInt(getComputedStyle(element).borderRadius) || 24;
            
            html += `
                <div class="context-group">
                    <div class="context-group-title">CTA Style</div>
                    <div class="context-row">
                        <div class="context-field">
                            <label>배경색</label>
                            <div class="color-control">
                                <input type="color" id="ctx-cta-bg" value="${bgColor}" class="ctx-color">
                                <input type="text" id="ctx-cta-bg-hex" value="${bgColor}" class="ctx-hex">
                            </div>
                        </div>
                    </div>
                    <div class="context-row">
                        <div class="context-field">
                            <label>텍스트색</label>
                            <div class="color-control">
                                <input type="color" id="ctx-cta-color" value="${textColor}" class="ctx-color">
                                <input type="text" id="ctx-cta-color-hex" value="${textColor}" class="ctx-hex">
                            </div>
                        </div>
                    </div>
                    <div class="context-row">
                        <div class="context-field">
                            <label>Size</label>
                            <input type="number" id="ctx-cta-size" value="${size}" min="8" max="48" class="ctx-input">
                        </div>
                        <div class="context-field">
                            <label>Radius</label>
                            <input type="number" id="ctx-cta-radius" value="${radius}" min="0" max="100" class="ctx-input">
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Text-specific controls
        if (isText) {
            const color = this.rgbToHex(element.style.color || getComputedStyle(element).color || '#ffffff');
            const size = parseInt(element.style.fontSize) || parseInt(getComputedStyle(element).fontSize) || 16;
            const weight = element.style.fontWeight || getComputedStyle(element).fontWeight || '400';
            
            html += `
                <div class="context-group">
                    <div class="context-group-title">Typography</div>
                    <div class="context-row">
                        <div class="context-field">
                            <label>Color</label>
                            <div class="color-control">
                                <input type="color" id="ctx-text-color" value="${color}" class="ctx-color">
                                <input type="text" id="ctx-text-color-hex" value="${color}" class="ctx-hex">
                            </div>
                        </div>
                    </div>
                    <div class="context-row">
                        <div class="context-field">
                            <label>Size</label>
                            <input type="number" id="ctx-text-size" value="${size}" min="8" max="200" class="ctx-input">
                        </div>
                        <div class="context-field">
                            <label>Weight</label>
                            <select id="ctx-text-weight" class="ctx-select">
                                <option value="300" ${weight == '300' ? 'selected' : ''}>Light</option>
                                <option value="400" ${weight == '400' ? 'selected' : ''}>Regular</option>
                                <option value="500" ${weight == '500' ? 'selected' : ''}>Medium</option>
                                <option value="600" ${weight == '600' ? 'selected' : ''}>SemiBold</option>
                                <option value="700" ${weight == '700' ? 'selected' : ''}>Bold</option>
                            </select>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Shape-specific controls
        if (isShape) {
            const fill = this.rgbToHex(element.style.backgroundColor || '#3b82f6');
            const stroke = this.rgbToHex(element.style.borderColor || 'transparent');
            const strokeWidth = parseInt(element.style.borderWidth) || 0;
            const radius = parseInt(element.style.borderRadius) || 0;
            const opacity = Math.round((parseFloat(element.style.opacity) || 1) * 100);
            
            html += `
                <div class="context-group">
                    <div class="context-group-title">Fill</div>
                    <div class="context-row">
                        <div class="context-field full">
                            <div class="color-control">
                                <input type="color" id="ctx-fill" value="${fill}" class="ctx-color">
                                <input type="text" id="ctx-fill-hex" value="${fill}" class="ctx-hex">
                                <span class="ctx-opacity">${opacity} %</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="context-group">
                    <div class="context-group-title">Stroke</div>
                    <div class="context-row">
                        <div class="context-field">
                            <div class="color-control">
                                <input type="color" id="ctx-stroke" value="${stroke}" class="ctx-color">
                            </div>
                        </div>
                        <div class="context-field">
                            <label>Width</label>
                            <input type="number" id="ctx-stroke-width" value="${strokeWidth}" min="0" max="20" class="ctx-input small">
                        </div>
                    </div>
                </div>
                <div class="context-group">
                    <div class="context-group-title">Corner Radius</div>
                    <div class="context-row">
                        <input type="range" id="ctx-radius" value="${radius}" min="0" max="100" class="ctx-slider">
                        <span class="ctx-value" id="ctx-radius-val">${radius}</span>
                    </div>
                </div>
                <div class="context-group">
                    <div class="context-group-title">Image Fill</div>
                    <div class="context-row">
                        <button class="ctx-btn" id="ctx-add-image">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <path d="M21 15l-5-5L5 21"/>
                            </svg>
                            이미지 추가
                        </button>
                        <input type="file" id="ctx-image-input" accept="image/*" hidden>
                    </div>
                </div>
            `;
        }
        
        // Opacity (common)
        const opacity = Math.round((parseFloat(element.style.opacity) || 1) * 100);
        html += `
            <div class="context-group">
                <div class="context-group-title">Opacity</div>
                <div class="context-row">
                    <input type="range" id="ctx-opacity" value="${opacity}" min="0" max="100" class="ctx-slider">
                    <span class="ctx-value" id="ctx-opacity-val">${opacity}%</span>
                </div>
            </div>
        `;
        
        // Delete button
        html += `
            <div class="context-group">
                <button class="ctx-btn-danger" id="ctx-delete">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                    </svg>
                    삭제
                </button>
            </div>
        `;
        
        return html;
    }
    
    bindContextControls(element) {
        // Position
        document.getElementById('ctx-x')?.addEventListener('input', (e) => {
            element.style.left = e.target.value + 'px';
        });
        document.getElementById('ctx-y')?.addEventListener('input', (e) => {
            element.style.top = e.target.value + 'px';
        });
        document.getElementById('ctx-w')?.addEventListener('input', (e) => {
            element.style.width = e.target.value + 'px';
        });
        document.getElementById('ctx-h')?.addEventListener('input', (e) => {
            element.style.height = e.target.value + 'px';
        });
        
        // Text controls
        const textColor = document.getElementById('ctx-text-color');
        const textColorHex = document.getElementById('ctx-text-color-hex');
        
        textColor?.addEventListener('input', (e) => {
            element.style.color = e.target.value;
            if (textColorHex) textColorHex.value = e.target.value;
        });
        textColorHex?.addEventListener('change', (e) => {
            let val = e.target.value;
            if (!val.startsWith('#')) val = '#' + val;
            element.style.color = val;
            if (textColor) textColor.value = val;
        });
        
        document.getElementById('ctx-text-size')?.addEventListener('input', (e) => {
            element.style.fontSize = e.target.value + 'px';
        });
        document.getElementById('ctx-text-weight')?.addEventListener('change', (e) => {
            element.style.fontWeight = e.target.value;
        });
        
        // CTA controls
        const ctaBg = document.getElementById('ctx-cta-bg');
        const ctaBgHex = document.getElementById('ctx-cta-bg-hex');
        
        ctaBg?.addEventListener('input', (e) => {
            element.style.backgroundColor = e.target.value;
            if (ctaBgHex) ctaBgHex.value = e.target.value;
        });
        ctaBgHex?.addEventListener('change', (e) => {
            let val = e.target.value;
            if (!val.startsWith('#')) val = '#' + val;
            element.style.backgroundColor = val;
            if (ctaBg) ctaBg.value = val;
        });
        
        const ctaColor = document.getElementById('ctx-cta-color');
        const ctaColorHex = document.getElementById('ctx-cta-color-hex');
        
        ctaColor?.addEventListener('input', (e) => {
            element.style.color = e.target.value;
            if (ctaColorHex) ctaColorHex.value = e.target.value;
        });
        ctaColorHex?.addEventListener('change', (e) => {
            let val = e.target.value;
            if (!val.startsWith('#')) val = '#' + val;
            element.style.color = val;
            if (ctaColor) ctaColor.value = val;
        });
        
        document.getElementById('ctx-cta-size')?.addEventListener('input', (e) => {
            element.style.fontSize = e.target.value + 'px';
        });
        document.getElementById('ctx-cta-radius')?.addEventListener('input', (e) => {
            element.style.borderRadius = e.target.value + 'px';
        });
        
        // Shape fill
        const fill = document.getElementById('ctx-fill');
        const fillHex = document.getElementById('ctx-fill-hex');
        
        fill?.addEventListener('input', (e) => {
            element.style.backgroundColor = e.target.value;
            if (fillHex) fillHex.value = e.target.value;
        });
        fillHex?.addEventListener('change', (e) => {
            let val = e.target.value;
            if (!val.startsWith('#')) val = '#' + val;
            element.style.backgroundColor = val;
            if (fill) fill.value = val;
        });
        
        // Stroke
        document.getElementById('ctx-stroke')?.addEventListener('input', (e) => {
            element.style.borderColor = e.target.value;
            if (!element.style.borderStyle || element.style.borderStyle === 'none') {
                element.style.borderStyle = 'solid';
            }
        });
        document.getElementById('ctx-stroke-width')?.addEventListener('input', (e) => {
            element.style.borderWidth = e.target.value + 'px';
            if (parseInt(e.target.value) > 0) {
                element.style.borderStyle = 'solid';
            }
        });
        
        // Corner radius
        const radius = document.getElementById('ctx-radius');
        const radiusVal = document.getElementById('ctx-radius-val');
        radius?.addEventListener('input', (e) => {
            element.style.borderRadius = e.target.value + 'px';
            if (radiusVal) radiusVal.textContent = e.target.value;
        });
        
        // Opacity
        const opacity = document.getElementById('ctx-opacity');
        const opacityVal = document.getElementById('ctx-opacity-val');
        opacity?.addEventListener('input', (e) => {
            element.style.opacity = e.target.value / 100;
            if (opacityVal) opacityVal.textContent = e.target.value + '%';
        });
        
        // Image fill
        const addImageBtn = document.getElementById('ctx-add-image');
        const imageInput = document.getElementById('ctx-image-input');
        
        addImageBtn?.addEventListener('click', () => {
            imageInput?.click();
        });
        
        imageInput?.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                element.style.backgroundImage = `url(${event.target.result})`;
                element.style.backgroundSize = 'cover';
                element.style.backgroundPosition = 'center';
            };
            reader.readAsDataURL(file);
        });
        
        // Delete
        document.getElementById('ctx-delete')?.addEventListener('click', () => {
            this.deleteSelectedElement();
        });
    }
    
    
    rgbToHex(color) {
        if (!color) return '#000000';
        if (color.startsWith('#')) return color;
        
        const rgb = color.match(/\d+/g);
        if (!rgb || rgb.length < 3) return '#000000';
        
        return '#' + rgb.slice(0, 3).map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }
    
    bindPropertyControls() {
        // Property controls are now handled in bindContextControls
    }
    
    deleteSelectedElement() {
        if (!this.selectedElement) return;
        
        // Don't delete core template elements - just hide them
        const isCore = this.selectedElement.classList.contains('ad-headline') ||
                       this.selectedElement.classList.contains('ad-subtext') ||
                       this.selectedElement.classList.contains('ad-cta');
        
        if (isCore) {
            // Hide instead of delete
            this.selectedElement.style.display = 'none';
            const layerId = this.selectedElement.dataset.layer;
            if (layerId && window.editorState) {
                const layer = window.editorState.getObject(layerId);
                if (layer) layer.visible = false;
            }
        } else {
            // Actually delete user-created elements
            const layerId = this.selectedElement.dataset.layerId;
            const idx = this.shapes.indexOf(this.selectedElement);
            if (idx > -1) {
                this.shapes.splice(idx, 1);
            }
            
            // Remove from EditorState
            if (layerId && window.editorState) {
                window.editorState.removeLayer(layerId);
            }
            
            this.selectedElement.remove();
        }
        
        this.selectedElement = null;
        this.updateSelectionStatus('선택 없음');
    }
    
    // ============================================
    // PAN (SPACE + DRAG) FUNCTIONALITY
    // ============================================
    
    bindPanEvents() {
        // Pan on container (not just canvas)
        this.container.addEventListener('mousedown', (e) => {
            if (this.isSpacePressed) {
                e.preventDefault();
                this.isPanning = true;
                this.panStart = {
                    x: e.clientX + this.container.scrollLeft,
                    y: e.clientY + this.container.scrollTop
                };
                this.container.classList.add('panning');
            }
        });
        
        this.container.addEventListener('mousemove', (e) => {
            if (this.isPanning && this.isSpacePressed) {
                e.preventDefault();
                const scrollLeft = this.panStart.x - e.clientX;
                const scrollTop = this.panStart.y - e.clientY;
                this.container.scrollLeft = scrollLeft;
                this.container.scrollTop = scrollTop;
            }
        });
        
        this.container.addEventListener('mouseup', () => {
            this.isPanning = false;
            this.container.classList.remove('panning');
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.isPanning = false;
            this.container.classList.remove('panning');
        });
        
        // Mouse wheel zoom
        this.container.addEventListener('wheel', (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                if (e.deltaY < 0) {
                    this.handleAction('zoom-in');
                } else {
                    this.handleAction('zoom-out');
                }
            }
        }, { passive: false });
    }
    
    centerCanvas() {
        // 캔버스를 컨테이너 중앙에 배치하기 위한 초기 스크롤 설정
        requestAnimationFrame(() => {
            const containerWidth = this.container.clientWidth;
            const containerHeight = this.container.clientHeight;
            const scrollWidth = this.container.scrollWidth;
            const scrollHeight = this.container.scrollHeight;
            
            // 스크롤 가능한 경우 중앙으로 이동
            if (scrollWidth > containerWidth) {
                this.container.scrollLeft = (scrollWidth - containerWidth) / 2;
            }
            if (scrollHeight > containerHeight) {
                this.container.scrollTop = (scrollHeight - containerHeight) / 2;
            }
        });
    }
    
    // 화면에 맞추기 기능 업데이트
    fitToScreen() {
        const containerWidth = this.container.clientWidth - 80;
        const containerHeight = this.container.clientHeight - 120;
        const canvasWidth = this.canvas.offsetWidth;
        const canvasHeight = this.canvas.offsetHeight;
        
        const scaleX = containerWidth / canvasWidth;
        const scaleY = containerHeight / canvasHeight;
        const scale = Math.min(scaleX, scaleY, 1) * 100;
        
        this.setZoom(Math.round(scale));
        this.centerCanvas();
    }
}

// Tool feedback styles (injected)
const feedbackStyles = document.createElement('style');
feedbackStyles.textContent = `
    .tool-feedback {
        position: fixed;
        bottom: 160px;
        left: 50%;
        transform: translateX(-50%) translateY(10px);
        padding: 10px 20px;
        background: #2c2c2c;
        border: 1px solid #3d3d3d;
        border-radius: 8px;
        color: #e5e7eb;
        font-size: 13px;
        font-weight: 500;
        opacity: 0;
        visibility: hidden;
        transition: all 0.2s ease;
        z-index: 1000;
        pointer-events: none;
    }
    
    .tool-feedback.visible {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(0);
    }
`;
document.head.appendChild(feedbackStyles);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.toolbarController = new ToolbarController();
});
