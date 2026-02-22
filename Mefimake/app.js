/**
 * ============================================
 * META AD GENERATOR - MAIN APPLICATION
 * ============================================
 */

class MetaAdGenerator {
    constructor() {
        // 상태 관리 - EditorState 사용
        this.state = {
            platform: 'meta',
            keyword: '',
            targets: ['b2c', 'b2b'],
            aspectRatio: '1:1',
            template: 'benefit',
            colorTheme: 'professional',
            currentVariant: 0,
            currentCategory: 'square',
            variants: [],
            groupedVariants: {
                square: [],
                rectangle: [],
                landing: []
            },
            generatedImages: [],
            history: []
        };

        // DOM 요소 캐싱
        this.elements = {};
        this.cacheElements();
        
        // 이벤트 바인딩
        this.bindEvents();
        
        // 초기화
        this.init();
    }

    cacheElements() {
        // 입력 필드
        this.elements.keywordInput = document.getElementById('message-input') || document.getElementById('keyword-input');
        this.elements.aspectRatio = document.getElementById('aspect-ratio');
        this.elements.generateCount = document.getElementById('generate-count');

        // 플랫폼 & 템플릿 선택기
        this.elements.platformSelector = document.getElementById('platform-selector');
        this.elements.templateSelector = document.getElementById('template-selector');
        this.elements.colorThemes = document.getElementById('color-themes');

        // AI 생성 버튼
        this.elements.aiGenerateBtn = document.getElementById('ai-generate-btn');

        // 버튼
        this.elements.downloadBtn = document.getElementById('download-btn');
        this.elements.batchBtn = document.getElementById('batch-btn');
        this.elements.prevVariant = document.getElementById('prev-variant');
        this.elements.nextVariant = document.getElementById('next-variant');

        // 표시 영역
        this.elements.adCanvas = document.getElementById('ad-canvas');
        this.elements.adContent = document.getElementById('ad-content');
        this.elements.variantsPanel = document.getElementById('variants-panel');
        this.elements.variantsGridSquare = document.getElementById('variants-grid-square');
        this.elements.variantsGridRectangle = document.getElementById('variants-grid-rectangle');
        this.elements.variantsGridLanding = document.getElementById('variants-grid-landing');
        this.elements.variantCounter = document.getElementById('variant-counter');
        this.elements.downloadSetBtn = document.getElementById('download-set-btn');

        // 탭 카운터
        this.elements.squareCount = document.getElementById('square-count');
        this.elements.rectangleCount = document.getElementById('rectangle-count');
        this.elements.landingCount = document.getElementById('landing-count');

        // 내보내기
        this.elements.exportSizeSelect = document.getElementById('export-size-select');
        this.elements.exportCurrentSize = document.getElementById('export-current-size');

        // 레이어
        this.elements.layersList = document.getElementById('layers-list');
        this.elements.layersEmpty = document.getElementById('layers-empty');
        
        // 컨텍스트 편집
        this.elements.sectionContext = document.getElementById('section-context');
        this.elements.contextControls = document.getElementById('context-controls');
        this.elements.contextTitle = document.getElementById('context-title');

        // 모달
        this.elements.batchModal = document.getElementById('batch-modal');
        this.elements.progressFill = document.getElementById('progress-fill');
        this.elements.progressText = document.getElementById('progress-text');
        this.elements.batchPreview = document.getElementById('batch-preview');
    }

    bindEvents() {
        // 플랫폼 선택
        this.elements.platformSelector?.addEventListener('click', (e) => {
            const btn = e.target.closest('.platform-btn, .platform-card');
            if (btn) {
                this.selectPlatform(btn);
            }
        });

        // 키워드 변경
        this.elements.keywordInput?.addEventListener('change', () => {
            this.state.keyword = this.elements.keywordInput.value;
            if (window.editorState) {
                window.editorState.setKeyword(this.state.keyword);
            }
        });

        // 비율 변경
        this.elements.aspectRatio?.addEventListener('change', () => {
            this.state.aspectRatio = this.elements.aspectRatio.value;
            this.updateCanvasRatio();
        });

        // 타겟 체크박스
        document.querySelectorAll('[id^="target-"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateTargets());
        });

        // 템플릿 선택
        this.elements.templateSelector?.addEventListener('click', (e) => {
            if (e.target.classList.contains('template-btn') || e.target.closest('.strategy-btn')) {
                this.selectTemplate(e.target);
            }
        });

        // 컬러 테마 선택
        this.elements.colorThemes?.addEventListener('click', (e) => {
            if (e.target.classList.contains('color-btn')) {
                this.selectColorTheme(e.target);
            }
        });

        // AI 크리에이티브 생성 버튼 - figma-panel.js에서 처리
        // (중복 이벤트 핸들러 제거 - applyContentToCanvas에서 위치 재설정 포함)

        // 변형 탭 선택
        document.querySelectorAll('.variants-tab').forEach(tab => {
            tab.addEventListener('click', () => this.selectVariantCategory(tab.dataset.category));
        });

        // 변형 네비게이션 (2개씩 이동)
        document.getElementById('variants-prev')?.addEventListener('click', () => this.navigateVariantsPage(-1));
        document.getElementById('variants-next')?.addEventListener('click', () => this.navigateVariantsPage(1));

        // 내보내기 사이즈 선택
        this.elements.exportSizeSelect?.addEventListener('change', (e) => {
            this.updateExportSize(e.target.value);
        });

        // 버튼 이벤트
        this.elements.downloadBtn?.addEventListener('click', () => {
            this.saveToHistory();
            this.downloadCurrentImage();
        });
        this.elements.downloadSetBtn?.addEventListener('click', () => {
            this.saveToHistory();
            this.downloadSizeSet();
        });
        this.elements.batchBtn?.addEventListener('click', () => this.generateBatch());
        this.elements.prevVariant?.addEventListener('click', () => this.navigateVariant(-1));
        this.elements.nextVariant?.addEventListener('click', () => this.navigateVariant(1));

        // 캔버스 요소 클릭 (컨텍스트 편집)
        this.elements.adCanvas?.addEventListener('click', (e) => {
            this.handleCanvasClick(e);
        });
        
        // EditorState 이벤트 리스너
        if (window.editorState) {
            window.editorState.on('activeElementChange', (id) => this.onActiveElementChange(id));
            window.editorState.on('layersChange', () => this.renderLayers());
        }
    }

    init() {
        // 초기 AI 크리에이티브 생성
        this.generateAICreative();
        
        // 레이어 렌더링
        this.renderLayers();
        
        // 초기 변형 생성
        this.generateInitialVariants();
    }

    updateTargets() {
        this.state.targets = [];
        if (document.getElementById('target-b2c')?.checked) this.state.targets.push('b2c');
        if (document.getElementById('target-b2b')?.checked) this.state.targets.push('b2b');
        if (document.getElementById('target-enterprise')?.checked) this.state.targets.push('enterprise');
    }
    
    // ============================================
    // AI CREATIVE GENERATION
    // ============================================
    
    generateAICreative() {
        const keyword = this.elements.keywordInput?.value || '성장';
        const platform = this.state.platform;
        const template = this.state.template;
        
        if (window.creativeEngine) {
            const creative = window.creativeEngine.generateCreative(keyword, platform, template);
            this.applyCreativeToCanvas(creative);
            
            // EditorState 업데이트
            if (window.editorState) {
                window.editorState.setContent(creative);
            }
        }
    }
    
    applyCreativeToCanvas(creative) {
        const canvas = this.elements.adCanvas;
        if (!canvas) return;
        
        const headline = canvas.querySelector('.ad-headline');
        const subtext = canvas.querySelector('.ad-subtext');
        const cta = canvas.querySelector('.ad-cta');
        
        if (headline) headline.textContent = creative.headline;
        if (subtext) subtext.innerHTML = creative.subtext;
        if (cta) cta.textContent = creative.cta;
    }
    
    // ============================================
    // CANVAS CONTEXT EDITING
    // ============================================
    
    handleCanvasClick(e) {
        const target = e.target;
        const layerId = target.dataset?.layer;
        
        if (layerId && window.editorState) {
            window.editorState.setActiveElement(layerId);
        } else if (!target.closest('.ad-content')) {
            // 캔버스 빈 영역 클릭시 선택 해제
            if (window.editorState) {
                window.editorState.clearActiveElement();
            }
        }
    }
    
    onActiveElementChange(elementId) {
        // 캔버스 요소 하이라이트
        this.elements.adCanvas?.querySelectorAll('[data-layer]').forEach(el => {
            el.classList.toggle('selected', el.dataset.layer === elementId);
        });
        
        // 컨텍스트 패널 업데이트
        this.updateContextPanel(elementId);
        
        // 레이어 목록 하이라이트
        this.elements.layersList?.querySelectorAll('.layer-item').forEach(el => {
            el.classList.toggle('active', el.dataset.layerId === elementId);
        });
    }
    
    updateContextPanel(elementId) {
        const section = this.elements.sectionContext;
        const controls = this.elements.contextControls;
        const title = this.elements.contextTitle;
        
        if (!elementId) {
            if (section) section.style.display = 'none';
            return;
        }
        
        if (section) section.style.display = 'block';
        
        const layer = window.editorState?.getObject(elementId);
        if (!layer) return;
        
        if (title) title.textContent = layer.name;
        
        // 타입에 따른 컨트롤 생성
        if (controls) {
            controls.innerHTML = this.generateContextControls(layer);
            this.bindContextControlEvents(elementId);
        }
    }
    
    generateContextControls(layer) {
        if (layer.type === 'text') {
            return `
                <div class="property-group">
                    <div class="property-row">
                        <span class="property-label">색상</span>
                        <input type="color" id="context-color" value="#ffffff" class="mini-color-picker">
                    </div>
                    <div class="property-row">
                        <span class="property-label">크기</span>
                        <input type="number" id="context-size" value="24" min="10" max="100" class="size-input">
                    </div>
                    <div class="property-row">
                        <span class="property-label">투명도</span>
                        <input type="range" id="context-opacity" min="0" max="100" value="100" class="prop-slider">
                    </div>
                </div>
                <button class="layer-btn delete" id="context-delete">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                    </svg>
                    삭제
                </button>
            `;
        }
        return '<div class="context-empty">이 요소는 편집할 수 없습니다</div>';
    }
    
    bindContextControlEvents(elementId) {
        const canvas = this.elements.adCanvas;
        const element = canvas?.querySelector(`[data-layer="${elementId}"]`);
        if (!element) return;
        
        document.getElementById('context-color')?.addEventListener('input', (e) => {
            element.style.color = e.target.value;
        });
        
        document.getElementById('context-size')?.addEventListener('input', (e) => {
            element.style.fontSize = e.target.value + 'px';
        });
        
        document.getElementById('context-opacity')?.addEventListener('input', (e) => {
            element.style.opacity = e.target.value / 100;
        });
        
        document.getElementById('context-delete')?.addEventListener('click', () => {
            if (window.editorState) {
                window.editorState.removeLayer(elementId);
                element.style.display = 'none';
            }
        });
    }
    
    // ============================================
    // LAYERS PANEL
    // ============================================
    
    renderLayers() {
        // Delegate to FigmaPanelController
        if (window.figmaPanelController) {
            window.figmaPanelController.renderLayers();
        }
    }
    
    getLayerIcon(type, shapeType) {
        const icons = {
            text: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3"/><path d="M12 4v16"/></svg>',
            image: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
            shape: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>',
            rectangle: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>',
            ellipse: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="12" rx="9" ry="9"/></svg>',
            line: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="19" x2="19" y2="5"/></svg>',
            frame: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>'
        };
        // For shape type, use specific icon if available
        if (type === 'shape' && shapeType && icons[shapeType]) {
            return icons[shapeType];
        }
        return icons[type] || icons.text;
    }
    
    selectCanvasElement(layerId) {
        // Try both attribute types
        let element = this.elements.adCanvas?.querySelector(`[data-layer="${layerId}"]`);
        if (!element) {
            element = this.elements.adCanvas?.querySelector(`[data-layer-id="${layerId}"]`);
        }
        
        // Also check the layer object for direct element reference
        const layer = window.editorState?.getObject(layerId);
        if (!element && layer?.element) {
            element = layer.element;
        }
        
        if (element && window.toolbarController) {
            window.toolbarController.selectElement(element);
        }
    }
    
    toggleCanvasElementVisibility(layerId) {
        // Try both attribute types
        let element = this.elements.adCanvas?.querySelector(`[data-layer="${layerId}"]`);
        if (!element) {
            element = this.elements.adCanvas?.querySelector(`[data-layer-id="${layerId}"]`);
        }
        
        // Also check the layer object for direct element reference
        const layer = window.editorState?.getObject(layerId);
        if (!element && layer?.element) {
            element = layer.element;
        }
        
        if (element) {
            element.style.visibility = layer?.visible ? 'visible' : 'hidden';
        }
    }
    
    hideCanvasElement(layerId) {
        // Try both attribute types
        let element = this.elements.adCanvas?.querySelector(`[data-layer="${layerId}"]`);
        if (!element) {
            element = this.elements.adCanvas?.querySelector(`[data-layer-id="${layerId}"]`);
        }
        
        // Also check the layer object for direct element reference
        const layer = window.editorState?.getObject(layerId);
        if (!element && layer?.element) {
            element = layer.element;
        }
        
        if (element) {
            element.remove();
        }
    }

    // ============================================
    // PLATFORM SELECTION
    // ============================================
    
    selectPlatform(btn) {
        // UI 업데이트
        this.elements.platformSelector.querySelectorAll('.platform-btn, .platform-card').forEach(b => {
            b.classList.remove('active');
        });
        btn.classList.add('active');
        
        // 상태 업데이트
        this.state.platform = btn.dataset.platform;
        
        if (window.editorState) {
            window.editorState.setPlatform(this.state.platform);
        }
        
        // 사이즈 옵션 업데이트
        this.updateSizeOptionsForPlatform();
        
        // 새 크리에이티브 생성
        this.generateAICreative();
        
        // 변형 재생성
        this.generateInitialVariants();
    }
    
    updateSizeOptionsForPlatform() {
        const sizeMap = {
            meta: ['1:1', '4:5', '9:16'],
            google: ['16:9', '1:1'],
            mobion: ['1:1', '16:9'],
            youtube: ['16:9'],
            landing: ['16:9']
        };
        
        const sizes = sizeMap[this.state.platform] || sizeMap.meta;
        this.state.aspectRatio = sizes[0];
        if (this.elements.aspectRatio) {
            this.elements.aspectRatio.value = sizes[0];
        }
        this.updateCanvasRatio();
    }

    // ============================================
    // VARIANT CATEGORY HANDLING
    // ============================================
    
    selectVariantCategory(category) {
        this.state.currentCategory = category;
        this.state.categoryPageIndex = this.state.categoryPageIndex || {};
        this.state.categoryPageIndex[category] = this.state.categoryPageIndex[category] || 0;
        
        // 탭 UI 업데이트
        document.querySelectorAll('.variants-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === category);
        });
        
        // 그리드 표시 전환
        document.querySelectorAll('.variants-grid').forEach(grid => {
            grid.classList.toggle('active', grid.dataset.category === category);
        });
        
        // 2개씩 표시 업데이트
        this.updateVisibleVariants();
        this.updateNavButtons();
        
        // 내보내기 사이즈 옵션 업데이트
        this.updateExportSizeForCategory(category);
    }
    
    navigateVariantsPage(direction) {
        const category = this.state.currentCategory;
        const variants = this.state.groupedVariants[category] || [];
        const visibleCount = 2; // 2개씩 표시
        const maxPage = Math.ceil(variants.length / visibleCount) - 1;
        
        this.state.categoryPageIndex = this.state.categoryPageIndex || {};
        let currentPage = this.state.categoryPageIndex[category] || 0;
        
        currentPage += direction;
        currentPage = Math.max(0, Math.min(currentPage, maxPage));
        
        this.state.categoryPageIndex[category] = currentPage;
        this.updateVisibleVariants();
        this.updateNavButtons();
    }
    
    updateVisibleVariants() {
        const category = this.state.currentCategory;
        const pageIndex = this.state.categoryPageIndex?.[category] || 0;
        const visibleCount = 2; // 2개씩 표시
        const startIndex = pageIndex * visibleCount;
        
        const grids = {
            square: this.elements.variantsGridSquare,
            rectangle: this.elements.variantsGridRectangle,
            landing: this.elements.variantsGridLanding
        };
        
        const container = grids[category];
        if (!container) return;
        
        const thumbs = container.querySelectorAll('.variant-thumb');
        thumbs.forEach((thumb, index) => {
            const isVisible = index >= startIndex && index < startIndex + visibleCount;
            thumb.style.display = isVisible ? 'block' : 'none';
        });
    }
    
    updateNavButtons() {
        const category = this.state.currentCategory;
        const variants = this.state.groupedVariants[category] || [];
        const visibleCount = 2; // 2개씩 표시
        const maxPage = Math.ceil(variants.length / visibleCount) - 1;
        const currentPage = this.state.categoryPageIndex?.[category] || 0;
        
        const prevBtn = document.getElementById('variants-prev');
        const nextBtn = document.getElementById('variants-next');
        
        if (prevBtn) prevBtn.disabled = currentPage <= 0;
        if (nextBtn) nextBtn.disabled = currentPage >= maxPage;
    }
    
    // 내보내기 사이즈 업데이트
    updateExportSize(sizeValue) {
        this.state.exportSize = sizeValue;
        
        // 사이즈 텍스트 표시 업데이트
        const sizeText = sizeValue.replace('x', ' × ');
        if (this.elements.exportCurrentSize) {
            this.elements.exportCurrentSize.textContent = sizeText;
        }
    }
    
    // 카테고리에 따라 내보내기 사이즈 옵션 업데이트
    updateExportSizeForCategory(category) {
        const sizeOptions = {
            square: [
                { value: '1080x1080', label: '1080 × 1080' },
                { value: '1200x1200', label: '1200 × 1200' }
            ],
            rectangle: [
                { value: '1280x720', label: '1280 × 720 (HD)' },
                { value: '1920x1080', label: '1920 × 1080 (FHD)' }
            ],
            landing: [
                { value: '1440x800', label: '1440 × 800 (Desktop)' },
                { value: '390x844', label: '390 × 844 (Mobile)' }
            ]
        };
        
        const options = sizeOptions[category] || sizeOptions.square;
        
        if (this.elements.exportSizeSelect) {
            this.elements.exportSizeSelect.innerHTML = options.map((opt, i) => 
                `<option value="${opt.value}" ${i === 0 ? 'selected' : ''}>${opt.label}</option>`
            ).join('');
            
            // 첫 번째 옵션으로 업데이트
            this.updateExportSize(options[0].value);
        }
    }

    selectTemplate(btn) {
        // UI 업데이트
        this.elements.templateSelector.querySelectorAll('.template-btn, .strategy-btn').forEach(b => {
            b.classList.remove('active');
        });
        btn.classList.add('active');
        
        // 상태 업데이트
        this.state.template = btn.dataset.template;
        
        if (window.editorState) {
            window.editorState.setTemplate(this.state.template);
        }
        
        // 템플릿 클래스 적용
        if (this.elements.adCanvas) {
            this.elements.adCanvas.className = 'ad-canvas';
            this.elements.adCanvas.classList.add(`template-${this.state.template}`);
            this.elements.adCanvas.classList.add(`theme-${this.state.colorTheme}`);
            this.updateCanvasRatio();
        }
        
        // 새 AI 크리에이티브 생성
        this.generateAICreative();
    }

    selectColorTheme(btn) {
        // UI 업데이트
        this.elements.colorThemes.querySelectorAll('.color-btn').forEach(b => {
            b.classList.remove('active');
        });
        btn.classList.add('active');
        
        // 상태 업데이트
        this.state.colorTheme = btn.dataset.theme;
        
        // 테마 클래스 적용
        this.elements.adCanvas.classList.remove(
            'theme-professional', 'theme-warm', 'theme-nature',
            'theme-energy', 'theme-modern', 'theme-trust'
        );
        this.elements.adCanvas.classList.add(`theme-${this.state.colorTheme}`);
        
        // 커스텀 컬러 필드 동기화
        const colors = this.getThemeColors(this.state.colorTheme);
        this.syncCustomColorFields(colors.primary, colors.secondary);
    }

    getThemeColors(theme) {
        const themes = {
            professional: { primary: '#001D61', secondary: '#003C8A', accent: '#0A84FF' },
            warm: { primary: '#1a0a0a', secondary: '#4a1c1c', accent: '#FF375F' },
            nature: { primary: '#0d1f22', secondary: '#1b4332', accent: '#40c9a2' },
            energy: { primary: '#1a0a0a', secondary: '#4a1c1c', accent: '#ff6b35' },
            modern: { primary: '#001D61', secondary: '#003C8A', accent: '#ffd700' },
            trust: { primary: '#0a192f', secondary: '#172a45', accent: '#64ffda' }
        };
        return themes[theme] || themes.professional;
    }

    syncCustomColorFields(startColor, endColor) {
        // DesignEditor와 연동
        if (window.designEditor) {
            window.designEditor.setGradientFromPreset(startColor, endColor);
        }
    }

    updateCanvasRatio() {
        this.elements.adCanvas.classList.remove('ratio-4-5', 'ratio-9-16');
        
        if (this.state.aspectRatio === '4:5') {
            this.elements.adCanvas.classList.add('ratio-4-5');
        } else if (this.state.aspectRatio === '9:16') {
            this.elements.adCanvas.classList.add('ratio-9-16');
        }
    }


    async downloadCurrentImage() {
        try {
            const canvas = await html2canvas(this.elements.adCanvas, {
                scale: 2,
                backgroundColor: null,
                logging: false
            });
            
            const link = document.createElement('a');
            link.download = `${this.state.topic}_${this.state.template}_${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('이미지 생성 실패:', error);
            alert('이미지 생성에 실패했습니다. 다시 시도해주세요.');
        }
    }

    async generateBatch() {
        const count = parseInt(this.elements.generateCount.value);
        const plan = ContentUtils.generateMonthlyPlan(this.state.topic, this.state.targets);
        
        // 모달 표시
        this.elements.batchModal.classList.add('active');
        this.elements.batchPreview.innerHTML = '';
        this.state.generatedImages = [];
        
        // 배치 생성
        for (let i = 0; i < count; i++) {
            const variant = plan[i];
            
            // 프로그레스 업데이트
            const progress = ((i + 1) / count) * 100;
            this.elements.progressFill.style.width = `${progress}%`;
            this.elements.progressText.textContent = `${i + 1} / ${count} 생성 완료`;
            
            // 캔버스 설정
            this.applyVariant(variant);
            
            // 잠시 대기 (렌더링 시간)
            await this.delay(100);
            
            // 이미지 생성
            try {
                const canvas = await html2canvas(this.elements.adCanvas, {
                    scale: 2,
                    backgroundColor: null,
                    logging: false
                });
                
                const dataUrl = canvas.toDataURL('image/png');
                this.state.generatedImages.push({
                    id: i + 1,
                    dataUrl,
                    variant
                });
                
                // 미리보기에 추가
                const img = document.createElement('img');
                img.src = dataUrl;
                img.alt = `변형 ${i + 1}`;
                this.elements.batchPreview.appendChild(img);
            } catch (error) {
                console.error(`변형 ${i + 1} 생성 실패:`, error);
            }
        }
        
        // 완료 후 다운로드 버튼 추가
        this.addBatchDownloadButton();
    }

    applyVariant(variant) {
        // 테마 적용
        this.elements.adCanvas.className = 'ad-canvas';
        this.elements.adCanvas.classList.add(`template-${variant.template}`);
        this.elements.adCanvas.classList.add(`theme-${variant.colorTheme}`);
        
        // 비율 적용
        if (variant.ratio === '4:5') {
            this.elements.adCanvas.classList.add('ratio-4-5');
        } else if (variant.ratio === '9:16') {
            this.elements.adCanvas.classList.add('ratio-9-16');
        }
        
        // 콘텐츠 적용
        const canvas = this.elements.adCanvas;
        canvas.querySelector('.ad-badge').textContent = variant.badge;
        canvas.querySelector('.ad-hook').textContent = variant.hook;
        canvas.querySelector('.ad-main').innerHTML = variant.main;
        canvas.querySelector('.ad-sub').textContent = variant.sub;
        canvas.querySelector('.ad-cta').textContent = variant.cta;
    }

    addBatchDownloadButton() {
        const downloadAllBtn = document.createElement('button');
        downloadAllBtn.className = 'btn-download';
        downloadAllBtn.style.marginTop = '20px';
        downloadAllBtn.textContent = '전체 다운로드 (ZIP)';
        downloadAllBtn.onclick = () => this.downloadAllAsZip();
        
        // 닫기 버튼
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn-preview';
        closeBtn.style.marginTop = '10px';
        closeBtn.textContent = '닫기';
        closeBtn.onclick = () => this.elements.batchModal.classList.remove('active');
        
        const btnContainer = document.createElement('div');
        btnContainer.appendChild(downloadAllBtn);
        btnContainer.appendChild(closeBtn);
        
        this.elements.batchPreview.parentElement.appendChild(btnContainer);
    }

    async downloadAllAsZip() {
        // JSZip 라이브러리가 없으므로 개별 다운로드
        for (let i = 0; i < this.state.generatedImages.length; i++) {
            const img = this.state.generatedImages[i];
            const link = document.createElement('a');
            link.download = `${this.state.topic}_${img.variant.template}_week${img.variant.week}_${img.id}.png`;
            link.href = img.dataUrl;
            link.click();
            
            // 브라우저 제한을 위해 딜레이
            await this.delay(200);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    generateInitialVariants() {
        const plan = ContentUtils.generateMonthlyPlan(this.state.topic, this.state.targets);
        this.state.variants = plan;
        this.renderVariantThumbnails();
        this.updateVariantCounter();
    }

    // 고객 여정 데이터 표시 (콘솔)
    showCustomerJourney() {
        if (window.CUSTOMER_JOURNEY) {
            console.log('고객 여정 분석:', window.CUSTOMER_JOURNEY);
        }
    }

    renderVariantThumbnails() {
        // 페이지 인덱스 초기화
        this.state.categoryPageIndex = {
            square: 0,
            rectangle: 0,
            landing: 0
        };
        
        // 변형을 카테고리별로 그룹화
        this.groupVariantsByCategory();
        
        // 각 카테고리 그리드 렌더링
        this.renderCategoryGrid('square', this.elements.variantsGridSquare);
        this.renderCategoryGrid('rectangle', this.elements.variantsGridRectangle);
        this.renderCategoryGrid('landing', this.elements.variantsGridLanding);
        
        // 탭 카운트 업데이트
        this.updateTabCounts();
        
        // Best Variant 찾기
        this.highlightBestVariant();
        
        // 2개씩 표시 적용
        this.updateVisibleVariants();
        this.updateNavButtons();
    }
    
    groupVariantsByCategory() {
        const distribution = typeof THUMBNAIL_GROUPS !== 'undefined' 
            ? THUMBNAIL_GROUPS.distributeVariantsToCategories(this.state.variants.length)
            : { square: 8, rectangle: 8, landing: 4 };
        
        this.state.groupedVariants = {
            square: [],
            rectangle: [],
            landing: []
        };
        
        this.state.variants.forEach((variant, index) => {
            let category = 'square';
            
            if (index < distribution.square) {
                category = 'square';
                variant.ratio = '1:1';
            } else if (index < distribution.square + distribution.rectangle) {
                category = 'rectangle';
                variant.ratio = '16:9';
            } else {
                category = 'landing';
                variant.ratio = 'landing-desktop';
                variant.template = 'hero';
            }
            
            variant.category = category;
            variant.originalIndex = index;
            this.state.groupedVariants[category].push(variant);
        });
    }
    
    renderCategoryGrid(category, container) {
        if (!container) return;
        
        container.innerHTML = '';
        
        const templateNames = {
            benefit: '혜택',
            question: '질문',
            story: '스토리',
            stats: '통계',
            compare: '비교',
            urgency: '긴급',
            fear_address: '두려움',
            anti_ad: '안티',
            hero: '히어로',
            product: '제품',
            service: '서비스'
        };
        
        const variants = this.state.groupedVariants[category] || [];
        
        variants.forEach((variant, localIndex) => {
            const thumb = document.createElement('div');
            const isActive = variant.originalIndex === this.state.currentVariant;
            thumb.className = `variant-thumb ${isActive ? 'active' : ''}`;
            thumb.dataset.index = variant.originalIndex;
            
            const hookText = variant.hook?.length > 20 
                ? variant.hook.substring(0, 20) + '...' 
                : variant.hook || '';
            
            if (category === 'landing') {
                thumb.innerHTML = `
                    <div class="variant-number">${localIndex + 1}</div>
                    <div class="variant-preview" style="background: linear-gradient(135deg, ${this.getThemeColor(variant.theme, 'primary')}, ${this.getThemeColor(variant.theme, 'secondary')})">
                        <div class="variant-preview-landing">
                            <div class="variant-preview-content">
                                <div class="variant-preview-badge">${templateNames[variant.template] || 'Hero'}</div>
                                <div class="variant-preview-hook">${hookText}</div>
                                <div class="variant-preview-cta">${variant.cta?.substring(0, 10) || 'CTA'}</div>
                            </div>
                            <div class="variant-preview-image"></div>
                        </div>
                    </div>
                `;
            } else {
                thumb.innerHTML = `
                    <div class="variant-number">${localIndex + 1}</div>
                    <div class="variant-preview" style="background: linear-gradient(135deg, ${this.getThemeColor(variant.theme, 'primary')}, ${this.getThemeColor(variant.theme, 'secondary')})">
                        <div class="variant-preview-badge">${templateNames[variant.template] || variant.template}</div>
                        <div class="variant-preview-hook">${hookText}</div>
                        <div class="variant-preview-cta">${variant.cta?.substring(0, 8) || 'CTA'}</div>
                    </div>
                `;
            }
            
            thumb.onclick = () => this.selectVariant(variant.originalIndex);
            container.appendChild(thumb);
        });
    }
    
    updateTabCounts() {
        if (this.elements.squareCount) {
            this.elements.squareCount.textContent = this.state.groupedVariants.square.length;
        }
        if (this.elements.rectangleCount) {
            this.elements.rectangleCount.textContent = this.state.groupedVariants.rectangle.length;
        }
        if (this.elements.landingCount) {
            this.elements.landingCount.textContent = this.state.groupedVariants.landing.length;
        }
    }
    
    highlightBestVariant() {
        if (typeof VARIANT_SCORING === 'undefined') return;
        
        const best = VARIANT_SCORING.findBestVariant(this.state.variants);
        if (!best) return;
        
        // Best 표시자에 표시
        const bestVariant = this.state.variants[best.index];
        
        document.querySelectorAll('.variant-thumb').forEach(thumb => {
            thumb.classList.remove('best');
            if (parseInt(thumb.dataset.index) === best.index) {
                thumb.classList.add('best');
            }
        });
        
        if (this.elements.bestVariantIndicator) {
            this.elements.bestVariantIndicator.style.display = 'flex';
        }
        if (this.elements.bestReason) {
            const hookLen = bestVariant.hook?.length || 0;
            this.elements.bestReason.textContent = 
                hookLen <= 20 ? 'Short hook + Strong CTA' : 'Optimal balance';
        }
    }

    getThemeColor(theme, type) {
        const colors = {
            professional: { primary: '#001D61', secondary: '#003C8A' },  // 딥 블루
            warm: { primary: '#1a0a0a', secondary: '#4a1c1c' },          // 웜 다크
            nature: { primary: '#0d1f22', secondary: '#1b4332' },        // 다크 포레스트
            energy: { primary: '#1a0a0a', secondary: '#4a1c1c' },        // 선셋 다크
            modern: { primary: '#001D61', secondary: '#003C8A' },        // 모던 블루
            trust: { primary: '#0a192f', secondary: '#172a45' }          // 일렉트릭 블루
        };
        return colors[theme]?.[type] || colors.professional[type];
    }

    selectVariant(index) {
        this.state.currentVariant = index;
        const variant = this.state.variants[index];
        
        // 캔버스에 적용
        this.applyVariant(variant);
        
        // 입력 필드 업데이트
        this.elements.hookCopy.value = variant.hook;
        this.elements.mainCopy.value = variant.main.replace(/<[^>]*>/g, '').replace(/\n/g, ' ');
        this.elements.subCopy.value = variant.sub;
        this.elements.ctaText.value = variant.cta;
        
        // UI 업데이트
        this.updateVariantCounter();
        this.highlightActiveThumbnail();
    }

    navigateVariant(direction) {
        let newIndex = this.state.currentVariant + direction;
        
        if (newIndex < 0) newIndex = this.state.variants.length - 1;
        if (newIndex >= this.state.variants.length) newIndex = 0;
        
        this.selectVariant(newIndex);
    }

    updateVariantCounter() {
        this.elements.variantCounter.textContent = 
            `${this.state.currentVariant + 1} / ${this.state.variants.length}`;
    }

    highlightActiveThumbnail() {
        // 모든 그리드에서 active 클래스 업데이트
        document.querySelectorAll('.variants-grid .variant-thumb').forEach(thumb => {
            const index = parseInt(thumb.dataset.index);
            thumb.classList.toggle('active', index === this.state.currentVariant);
        });
        
        // 현재 변형의 카테고리로 탭 전환
        const currentVariant = this.state.variants[this.state.currentVariant];
        if (currentVariant?.category && currentVariant.category !== this.state.currentCategory) {
            this.selectVariantCategory(currentVariant.category);
        }
    }

    loadLibrary(tab) {
        const items = CONTENT_LIBRARY[tab];
        if (!items || !this.elements.libraryList) return;
        
        this.elements.libraryList.innerHTML = '';
        
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'library-item';
            if (item.recommended) {
                div.classList.add('recommended');
            }
            div.textContent = item.text || item;
            div.onclick = () => this.useLibraryItem(tab, item);
            this.elements.libraryList.appendChild(div);
        });
    }

    switchLibraryTab(tab) {
        document.querySelectorAll('.lib-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.loadLibrary(tab.dataset.lib);
    }

    useLibraryItem(tab, item) {
        const text = item.text || item;
        
        switch(tab) {
            case 'hooks':
                this.elements.hookCopy.value = text;
                break;
            case 'benefits':
                this.elements.subCopy.value = text;
                break;
            case 'subCopies':
                this.elements.subCopy.value = text;
                break;
            case 'ctas':
                this.elements.ctaText.value = text;
                break;
        }
        
        this.updatePreview();
    }

    // 히스토리에 현재 조합 저장
    saveToHistory() {
        const entry = {
            id: Date.now(),
            template: this.state.template,
            hook: this.elements.hookCopy?.value || '',
            main: this.elements.mainCopy?.value || '',
            sub: this.elements.subCopy?.value || '',
            cta: this.elements.ctaText?.value || '',
            ratio: this.state.aspectRatio,
            timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        };

        // 중복 방지
        const isDuplicate = this.state.history.some(h => 
            h.hook === entry.hook && h.template === entry.template
        );

        if (!isDuplicate && entry.hook) {
            this.state.history.unshift(entry);
            if (this.state.history.length > 20) {
                this.state.history.pop();
            }
            this.renderHistory();
        }
    }

    // 히스토리 렌더링
    renderHistory() {
        if (!this.elements.historyList) return;

        if (this.state.history.length === 0) {
            this.elements.historyList.innerHTML = '<div class="history-empty">생성된 조합이 여기에 저장됩니다</div>';
            return;
        }

        const templateNames = {
            benefit: '혜택형',
            question: '질문형',
            story: '스토리',
            stats: '통계형',
            compare: '비교형',
            urgency: '긴급형',
            fear_address: '두려움',
            anti_ad: '안티광고'
        };

        this.elements.historyList.innerHTML = this.state.history.map(entry => `
            <div class="history-item" data-id="${entry.id}">
                <div class="history-template">${templateNames[entry.template] || entry.template}</div>
                <div class="history-hook">${entry.hook}</div>
                <div class="history-meta">${entry.ratio} · ${entry.timestamp}</div>
            </div>
        `).join('');

        // 클릭 이벤트
        this.elements.historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                this.loadFromHistory(id);
            });
        });
    }

    // 히스토리에서 불러오기
    loadFromHistory(id) {
        const entry = this.state.history.find(h => h.id === id);
        if (!entry) return;

        // 템플릿 변경
        this.state.template = entry.template;
        document.querySelectorAll('.template-btn, .strategy-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.template === entry.template);
        });

        // 텍스트 복원
        if (this.elements.hookCopy) this.elements.hookCopy.value = entry.hook;
        if (this.elements.mainCopy) this.elements.mainCopy.value = entry.main;
        if (this.elements.subCopy) this.elements.subCopy.value = entry.sub;
        if (this.elements.ctaText) this.elements.ctaText.value = entry.cta;

        this.updatePreview();
    }

    // 사이즈 세트 다운로드 (3개 묶음)
    async downloadSizeSet() {
        const originalRatio = this.state.aspectRatio;
        const ratios = ['1:1', '4:5', '9:16'];
        
        for (const ratio of ratios) {
            this.state.aspectRatio = ratio;
            this.elements.aspectRatio.value = ratio;
            this.updateCanvasRatio();
            
            await new Promise(resolve => setTimeout(resolve, 300));
            await this.downloadCurrentImage();
        }
        
        // 원래 비율로 복원
        this.state.aspectRatio = originalRatio;
        this.elements.aspectRatio.value = originalRatio;
        this.updateCanvasRatio();
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MetaAdGenerator();
});

