/**
 * ============================================
 * FIGMA-STYLE OBJECT PROPERTY PANEL
 * ============================================
 * 
 * Universal editor for ANY selected canvas object.
 * Shows/hides sections based on activeElement.type.
 */

class FigmaPanelController {
    constructor() {
        this.canvas = document.getElementById('ad-canvas');
        this.sections = {
            position: document.getElementById('section-position'),
            fill: document.getElementById('section-fill'),
            stroke: document.getElementById('section-stroke'),
            typography: document.getElementById('section-typography'),
            layers: document.getElementById('section-layers')
        };
        this.panels = {
            plan: document.getElementById('panel-plan'),
            design: document.getElementById('panel-design'),
            export: document.getElementById('panel-export')
        };
        this.currentTab = localStorage.getItem('activeTab') || 'plan';
        
        // Default canvas dimensions
        this.currentWidth = 1080;
        this.currentHeight = 1080;
        this.currentScale = 0.5;
        
        // Variant cycling (0-4 for 5 different outputs)
        this.variantIndex = 0;
        this.lastKeyword = '';
        
        // History management
        this.savedWorks = [];
        this.selectedWorkIds = new Set();
        this.loadSavedWorks();
        
        // Size set preview data
        this.sizeSetPreviews = {};
        
        this.init();
    }
    
    init() {
        this.bindTabNavigation();
        this.switchTab(this.currentTab);
        this.registerBackgroundAsObject();
        this.registerExistingElements();
        this.bindEditorStateEvents();
        this.bindFillControls();
        this.bindStrokeControls();
        this.bindTypographyControls();
        this.bindCanvasSelection();
        this.bindPlanControls();
        this.bindLayerControls();
        this.bindExportControls();
        this.bindHistoryControls();
        this.bindSizeSetModal();
        this.renderLayers();
        this.renderHistoryGrid();
        
        // Initialize editorState with default canvas size
        if (window.editorState) {
            window.editorState.updateCanvasSize(this.currentWidth, this.currentHeight);
        }
        
        // Initial state: auto-select background (like Figma - always have something selected)
        // Don't switch tab on initial load
        this.selectObject('background', { switchToDesignTab: false });
        
        // Apply initial size (Square 1:1) and content on page load
        this.applyInitialState();
    }
    
    applyInitialState() {
        // Ensure Square size is selected
        const squareCard = document.querySelector('#size-selector .size-card[data-size="1:1"]');
        if (squareCard) {
            document.querySelectorAll('#size-selector .size-card').forEach(c => c.classList.remove('active'));
            squareCard.classList.add('active');
        }
        
        // Apply canvas size (width, height, size)
        this.applyCanvasSize(1080, 1080, '1:1');
        
        // Apply initial content to canvas with default gradient background
        setTimeout(() => {
            this.applyContentToCanvas();
        }, 200);
    }
    
    // ============================================
    // TAB NAVIGATION
    // ============================================
    
    bindTabNavigation() {
        document.querySelectorAll('.panel-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const panelId = tab.dataset.panel;
                this.switchTab(panelId);
            });
        });
    }
    
    switchTab(tabId) {
        this.currentTab = tabId;
        localStorage.setItem('activeTab', tabId);
        
        // Update tab buttons
        document.querySelectorAll('.panel-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.panel === tabId);
        });
        
        // Update panels
        Object.entries(this.panels).forEach(([id, panel]) => {
            if (panel) {
                panel.style.display = id === tabId ? 'block' : 'none';
            }
        });
        
        // If switching to design tab, refresh panel state
        if (tabId === 'design') {
            this.updateDesignPanelVisibility();
            // Also refresh the panel for current active element
            const activeObj = window.editorState?.activeElement;
            this.updatePanelForActiveElement(activeObj);
        }
    }
    
    updateDesignPanelVisibility() {
        // Always show all property sections
        Object.values(this.sections).forEach(section => {
            if (section) {
                section.style.display = 'block';
            }
        });
    }
    
    // ============================================
    // PLAN TAB CONTROLS
    // ============================================
    
    bindPlanControls() {
        this.isGenerating = false;
        
        // Load saved values from localStorage
        this.loadPlanFromStorage();
        
        // Update brief when values change
        this.updateCreativeBrief();
        
        // Message input
        const messageInput = document.getElementById('message-input');
        messageInput?.addEventListener('input', () => {
            this.savePlanToStorage();
            window.editorState?.setKeyword(messageInput.value);
        });
        
        // Content Editor - Apply to Canvas
        document.getElementById('apply-content-btn')?.addEventListener('click', () => {
            this.applyContentToCanvas();
        });
        
        // Background image upload
        document.getElementById('edit-bg-image')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.customBgImage = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Clear background image
        document.getElementById('edit-bg-clear')?.addEventListener('click', () => {
            this.customBgImage = null;
            document.getElementById('edit-bg-image').value = '';
        });
        
        // Icon/Element add
        document.getElementById('edit-add-icon')?.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                Array.from(files).forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        this.addIconToCanvas(event.target.result, file.name);
                    };
                    reader.readAsDataURL(file);
                });
                e.target.value = '';
            }
        });
        
        // Clear all icons
        document.getElementById('edit-icon-clear')?.addEventListener('click', () => {
            this.clearAllIcons();
        });
        
        // Size card selector
        document.querySelectorAll('#size-selector .size-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('#size-selector .size-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                
                const width = parseInt(card.dataset.width) || 1080;
                const height = parseInt(card.dataset.height) || 1080;
                const size = card.dataset.size;
                
                this.applyCanvasSize(width, height, size);
                this.savePlanToStorage();
            });
        });
        
        // Persona selector (single select)
        document.querySelectorAll('#persona-selector .persona-card').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#persona-selector .persona-card').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateCreativeBrief();
                this.savePlanToStorage();
            });
        });
        
        // Brief edit button - scroll to message input
        document.getElementById('brief-edit-btn')?.addEventListener('click', () => {
            document.getElementById('step-template')?.scrollIntoView({ behavior: 'smooth' });
        });
        
        // AI Generate button - generates text and fills content editor
        const aiBtn = document.getElementById('ai-generate-btn');
        if (aiBtn) {
            aiBtn.addEventListener('click', async () => {
                if (this.isGenerating) return;
                
                this.isGenerating = true;
                aiBtn.classList.add('loading');
                aiBtn.disabled = true;
                
                try {
                    const message = document.getElementById('message-input')?.value || '';
                    
                    // Generate AI content based on message
                    const generatedContent = await this.generateAIContent(message);
                    
                    // Fill content editor with generated results
                    this.fillContentEditor(generatedContent);
                    
                    // Auto-apply to canvas
                    this.applyContentToCanvas();
                    
                } catch (error) {
                    console.error('[FigmaPanel] Generation error:', error);
                } finally {
                    this.isGenerating = false;
                    aiBtn.classList.remove('loading');
                    aiBtn.disabled = false;
                }
            });
        }
    }
    
    async generateAIContent(message) {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Get current context
        const platform = document.querySelector('#size-selector .size-card.active')?.dataset.size || '1:1';
        const creativeSeed = {
            keyword: message,
            platform: platform === '16:9' ? 'youtube' : platform === '9:16' ? 'story' : 'meta'
        };
        
        // STEP 1: Classify domain
        const domain = this.classifyDomain(message);
        
        // STEP 2: Extract intent
        const intent = this.extractIntent(message);
        
        // STEP 3: Build mini brief (internal)
        const brief = this.buildMiniBrief(message, domain, intent);
        
        // STEP 4-6: Generate 5 variants with platform adaptation
        const variants = this.generateVariants(message, domain, intent, brief, creativeSeed.platform);
        
        // Reset variant index if keyword changed
        if (message !== this.lastKeyword) {
            this.variantIndex = 0;
            this.lastKeyword = message;
        }
        
        // Get current variant and cycle through 5 variants
        const currentVariant = variants[this.variantIndex % variants.length];
        this.variantIndex = (this.variantIndex + 1) % 5;
        
        // Store all variants for potential future use
        this.generatedVariants = variants;
        
        return {
            headline: currentVariant.headline,
            subtext: currentVariant.subtext,
            tags: this.generateTags(domain, intent),
            cta: currentVariant.cta
        };
    }
    
    classifyDomain(keyword) {
        const kw = keyword.toLowerCase();
        const domainMap = [
            { domain: 'education', keywords: ['교육', '취업', '자격증', '학습', '강의', '커리어', '이직', '스킬', '부트캠프', '코딩'] },
            { domain: 'productivity', keywords: ['생산성', '효율', '업무', '협업', '시간', '관리', '자동화', '워크플로우'] },
            { domain: 'ai_automation', keywords: ['ai', '인공지능', '자동화', '챗봇', 'gpt', '머신러닝', '딥러닝'] },
            { domain: 'cost_saving', keywords: ['비용', '절감', '절약', '저렴', '가격', '예산', '무료', 'roi'] },
            { domain: 'marketing', keywords: ['마케팅', '광고', '매출', '전환', '리드', '브랜딩', '성과', 'roas'] },
            { domain: 'health', keywords: ['건강', '다이어트', '운동', '체중', '피트니스', '헬스', '영양', '웰빙'] },
            { domain: 'investment', keywords: ['부동산', '투자', '재테크', '수익', '주식', '자산', '금융', '펀드'] },
            { domain: 'ecommerce', keywords: ['할인', '세일', '특가', '배송', '쇼핑', '구매', '상품', '이벤트'] },
            { domain: 'saas', keywords: ['솔루션', '플랫폼', '서비스', 'saas', '툴', '소프트웨어', 'b2b', '기업용'] },
            { domain: 'app', keywords: ['앱', '다운로드', '설치', '모바일', '어플', '구독'] },
            { domain: 'event', keywords: ['이벤트', '모집', '신청', '마감', '세미나', '웨비나', '컨퍼런스', '참가'] },
            { domain: 'social_proof', keywords: ['후기', '리뷰', '고객', '만족', '추천', '평점', '검증', '사례'] },
            { domain: 'urgency', keywords: ['마감', '한정', '오늘만', '긴급', '선착순', '품절', '임박', '라스트'] }
        ];
        
        for (const { domain, keywords } of domainMap) {
            if (keywords.some(k => kw.includes(k))) return domain;
        }
        return 'general';
    }
    
    extractIntent(keyword) {
        const kw = keyword.toLowerCase();
        const intentMap = [
            { intent: 'learn', keywords: ['배우', '학습', '교육', '강의', '코스', '수업', '스킬'] },
            { intent: 'save_money', keywords: ['절약', '절감', '저렴', '할인', '무료', '비용'] },
            { intent: 'grow_revenue', keywords: ['매출', '수익', '성장', '확대', '증가', '성과'] },
            { intent: 'automate', keywords: ['자동화', '효율', '시간', '반복', '업무', 'ai'] },
            { intent: 'improve_life', keywords: ['건강', '다이어트', '운동', '삶', '개선', '향상'] },
            { intent: 'make_decision', keywords: ['비교', '선택', '결정', '추천', '베스트'] },
            { intent: 'act_now', keywords: ['마감', '한정', '지금', '오늘', '긴급', '신청'] }
        ];
        
        for (const { intent, keywords } of intentMap) {
            if (keywords.some(k => kw.includes(k))) return intent;
        }
        return 'explore';
    }
    
    buildMiniBrief(keyword, domain, intent) {
        const briefTemplates = {
            education: {
                problem: '스킬 부족으로 커리어 정체',
                promise: '실무 역량 확보 및 취업 성공',
                proofAngle: 'social',
                emotionalTone: 'hope',
                awarenessStage: 'warm'
            },
            productivity: {
                problem: '반복 업무로 시간 낭비',
                promise: '핵심 업무에 집중할 시간 확보',
                proofAngle: 'data',
                emotionalTone: 'relief',
                awarenessStage: 'warm'
            },
            ai_automation: {
                problem: '수작업으로 인한 비효율',
                promise: 'AI가 대신하는 업무 자동화',
                proofAngle: 'logic',
                emotionalTone: 'curiosity',
                awarenessStage: 'cold'
            },
            cost_saving: {
                problem: '높은 비용 부담',
                promise: '동일 성과, 낮은 비용',
                proofAngle: 'data',
                emotionalTone: 'relief',
                awarenessStage: 'hot'
            },
            marketing: {
                problem: '광고비 대비 낮은 전환',
                promise: 'ROAS 극대화',
                proofAngle: 'data',
                emotionalTone: 'urgency',
                awarenessStage: 'warm'
            },
            health: {
                problem: '건강 관리의 어려움',
                promise: '지속 가능한 건강한 습관',
                proofAngle: 'social',
                emotionalTone: 'hope',
                awarenessStage: 'warm'
            },
            investment: {
                problem: '자산 증식의 막막함',
                promise: '검증된 투자 수익',
                proofAngle: 'authority',
                emotionalTone: 'curiosity',
                awarenessStage: 'cold'
            },
            ecommerce: {
                problem: '합리적 소비 욕구',
                promise: '최저가 + 빠른 배송',
                proofAngle: 'data',
                emotionalTone: 'urgency',
                awarenessStage: 'hot'
            },
            saas: {
                problem: '복잡한 업무 프로세스',
                promise: '올인원 솔루션으로 단순화',
                proofAngle: 'logic',
                emotionalTone: 'relief',
                awarenessStage: 'warm'
            },
            urgency: {
                problem: '기회 상실 우려',
                promise: '한정된 혜택 확보',
                proofAngle: 'social',
                emotionalTone: 'urgency',
                awarenessStage: 'hot'
            }
        };
        
        return briefTemplates[domain] || {
            problem: '현재 상황의 불편함',
            promise: '더 나은 결과',
            proofAngle: 'logic',
            emotionalTone: 'curiosity',
            awarenessStage: 'cold'
        };
    }
    
    generateVariants(keyword, domain, intent, brief, platform) {
        const copyBank = {
            education: {
                conversion: {
                    headline: '비전공자도 3개월이면\n현업 개발자로',
                    subtext: '수료생 87% 취업 성공, 평균 연봉 4,200만원',
                    cta: '커리큘럼 보기'
                },
                information: {
                    headline: '실무 프로젝트로 배우는\n진짜 개발 교육',
                    subtext: '이론이 아닌 실전, 현업 멘토 1:1 코칭',
                    cta: '무료 자료 받기'
                },
                emotion: {
                    headline: '"나도 할 수 있을까?"\n그 고민, 3개월 전 저도 했어요',
                    subtext: '비전공 출신 수료생의 솔직한 이야기',
                    cta: '수료생 후기 보기'
                }
            },
            productivity: {
                conversion: {
                    headline: '하루 2시간\n업무 시간 단축',
                    subtext: '반복 작업 자동화로 핵심 업무에 집중',
                    cta: '무료 체험 시작'
                },
                information: {
                    headline: '상위 1% 팀이\n사용하는 업무 도구',
                    subtext: '협업, 자동화, 분석을 하나로',
                    cta: '기능 둘러보기'
                },
                emotion: {
                    headline: '매일 야근하던 팀이\n정시 퇴근하게 된 비결',
                    subtext: '업무 방식을 바꾸니 삶이 바뀌었습니다',
                    cta: '사례 확인하기'
                }
            },
            ai_automation: {
                conversion: {
                    headline: 'AI가 대신하는\n반복 업무 80%',
                    subtext: '설정 5분, 매일 2시간 절약',
                    cta: '지금 시작하기'
                },
                information: {
                    headline: 'ChatGPT보다 강력한\n업무 전용 AI',
                    subtext: '데이터 분석, 보고서, 이메일까지 자동화',
                    cta: '데모 신청'
                },
                emotion: {
                    headline: '단순 반복 업무에서\n해방되는 순간',
                    subtext: 'AI에게 맡기고, 당신은 창의적 일에 집중하세요',
                    cta: '무료 체험'
                }
            },
            cost_saving: {
                conversion: {
                    headline: '같은 성과\n비용은 50% 절감',
                    subtext: '이미 500개 기업이 선택한 이유',
                    cta: '견적 받기'
                },
                information: {
                    headline: '비용 절감\n어디서부터 시작할까?',
                    subtext: '숨은 비용 찾기 무료 진단',
                    cta: '무료 진단 받기'
                },
                emotion: {
                    headline: '예산은 줄이고\n성과는 그대로',
                    subtext: '스마트한 선택이 만드는 차이',
                    cta: '상담 신청'
                }
            },
            marketing: {
                conversion: {
                    headline: 'ROAS 300%\n광고 최적화 전략',
                    subtext: '데이터 기반 타겟팅으로 전환율 극대화',
                    cta: '전략 받기'
                },
                information: {
                    headline: '광고비는 그대로\n전환은 2배로',
                    subtext: '성과형 마케팅의 핵심 노하우',
                    cta: '가이드 다운로드'
                },
                emotion: {
                    headline: '광고비만 나가고\n매출은 제자리?',
                    subtext: '문제는 타겟이 아니라 메시지입니다',
                    cta: '무료 분석 받기'
                }
            },
            health: {
                conversion: {
                    headline: '4주 만에\n체지방 5kg 감량',
                    subtext: '검증된 프로그램, 전담 코치 관리',
                    cta: '프로그램 보기'
                },
                information: {
                    headline: '다이어트 실패하는\n진짜 이유',
                    subtext: '식단이 아니라 습관의 문제입니다',
                    cta: '무료 가이드'
                },
                emotion: {
                    headline: '올해는 진짜\n바뀌고 싶다면',
                    subtext: '작심삼일 끝내는 과학적 방법',
                    cta: '시작하기'
                }
            },
            ecommerce: {
                conversion: {
                    headline: '오늘만 최대 70% OFF\n단 24시간',
                    subtext: '무료배송 + 추가 10% 쿠폰',
                    cta: '지금 구매'
                },
                information: {
                    headline: '2024 베스트셀러\n총정리',
                    subtext: '가장 많이 팔린 인기 상품 TOP 10',
                    cta: '상품 보기'
                },
                emotion: {
                    headline: '이 가격 다시 없습니다\n진심으로',
                    subtext: '연중 최저가 보장',
                    cta: '혜택 받기'
                }
            },
            saas: {
                conversion: {
                    headline: '올인원 솔루션\n한 달 무료 체험',
                    subtext: '도입 기업 92% 정식 전환',
                    cta: '무료 시작'
                },
                information: {
                    headline: '엑셀 지옥에서\n벗어나는 방법',
                    subtext: '데이터 관리, 자동화, 협업을 하나로',
                    cta: '기능 보기'
                },
                emotion: {
                    headline: '팀원들이 먼저\n도입해달라고 했습니다',
                    subtext: '업무 스트레스를 줄여주는 도구',
                    cta: '데모 신청'
                }
            },
            urgency: {
                conversion: {
                    headline: '마감 임박\n선착순 100명',
                    subtext: '지금 신청 시 50% 할인 + 특별 혜택',
                    cta: '자리 확보하기'
                },
                information: {
                    headline: '오늘 자정 마감\n놓치면 1년 기다려야',
                    subtext: '연 1회 진행되는 특별 프로모션',
                    cta: '상세 보기'
                },
                emotion: {
                    headline: '고민하는 사이\n기회는 사라집니다',
                    subtext: '이미 80% 마감, 잔여 20석',
                    cta: '지금 신청'
                }
            }
        };
        
        // General fallback for unknown domains
        const generalCopy = {
            conversion: {
                headline: '지금 시작하면\n달라지는 내일',
                subtext: '수천 명이 선택한 검증된 서비스',
                cta: '시작하기'
            },
            information: {
                headline: '더 나은 방법이\n있습니다',
                subtext: '전문가가 알려주는 핵심 노하우',
                cta: '자세히 보기'
            },
            emotion: {
                headline: '변화는\n작은 결심에서 시작됩니다',
                subtext: '오늘의 선택이 내일을 바꿉니다',
                cta: '알아보기'
            },
            question: {
                headline: '아직도 고민 중이신가요?',
                subtext: '시작하지 않으면 아무것도 변하지 않습니다',
                cta: '무료 상담'
            },
            social: {
                headline: '이미 10,000명이\n선택했습니다',
                subtext: '검증된 서비스, 높은 만족도',
                cta: '후기 보기'
            }
        };
        
        const domainCopy = copyBank[domain] || generalCopy;
        
        // Generate additional variants for domains that only have 3
        const extraVariants = this.generateExtraVariants(domain, keyword);
        
        // Apply platform tone adjustments - 5 variants total
        const variants = [
            { type: 'conversion', ...domainCopy.conversion },
            { type: 'information', ...domainCopy.information },
            { type: 'emotion', ...domainCopy.emotion },
            { type: 'question', ...(domainCopy.question || extraVariants.question) },
            { type: 'social', ...(domainCopy.social || extraVariants.social) }
        ];
        
        // Platform-specific adjustments
        if (platform === 'youtube') {
            variants[0].headline = variants[0].headline.replace('\n', ' ');
            variants[0].subtext = '영상에서 자세히 알려드립니다';
        }
        
        return variants;
    }
    
    generateExtraVariants(domain, keyword) {
        // Domain-specific extra variants (question & social proof)
        const extraBank = {
            education: {
                question: {
                    headline: '비전공자도\n정말 가능할까요?',
                    subtext: '궁금한 점, 전문가가 직접 답해드립니다',
                    cta: '무료 상담 받기'
                },
                social: {
                    headline: '수료생 2,000명 돌파\n취업률 87%',
                    subtext: '실제 수료생들의 생생한 후기',
                    cta: '후기 확인하기'
                }
            },
            productivity: {
                question: {
                    headline: '매일 야근하시나요?',
                    subtext: '업무 방식을 바꾸면 삶이 바뀝니다',
                    cta: '해결책 보기'
                },
                social: {
                    headline: '500개 기업이 선택한\n업무 자동화',
                    subtext: '평균 업무 시간 40% 단축',
                    cta: '도입 사례 보기'
                }
            },
            ai_automation: {
                question: {
                    headline: 'AI가 정말\n일을 대신할 수 있을까요?',
                    subtext: '직접 경험해보세요',
                    cta: '무료 체험'
                },
                social: {
                    headline: '1,000개 팀이 도입한\nAI 업무 자동화',
                    subtext: '만족도 94%, 재구독률 89%',
                    cta: '데모 보기'
                }
            },
            cost_saving: {
                question: {
                    headline: '비용 절감,\n어디서부터 시작할까요?',
                    subtext: '무료 진단으로 시작하세요',
                    cta: '무료 진단'
                },
                social: {
                    headline: '평균 연간\n2,400만원 절감',
                    subtext: '도입 기업 실제 데이터',
                    cta: '절감 사례 보기'
                }
            },
            marketing: {
                question: {
                    headline: '광고비만 나가고\n성과는 없으신가요?',
                    subtext: '문제점을 정확히 진단해드립니다',
                    cta: '무료 분석'
                },
                social: {
                    headline: 'ROAS 300% 달성\n실제 사례',
                    subtext: '마케팅 전문가의 성과 노하우',
                    cta: '사례 보기'
                }
            },
            health: {
                question: {
                    headline: '이번에도\n작심삼일로 끝날까요?',
                    subtext: '과학적 방법으로 습관을 바꾸세요',
                    cta: '프로그램 보기'
                },
                social: {
                    headline: '참가자 92%가\n목표 달성',
                    subtext: '4주 만에 평균 5kg 감량',
                    cta: '후기 보기'
                }
            },
            ecommerce: {
                question: {
                    headline: '이 가격\n다시 볼 수 있을까요?',
                    subtext: '역대 최저가 보장',
                    cta: '가격 확인'
                },
                social: {
                    headline: '누적 판매\n100만 개 돌파',
                    subtext: '별점 4.9 / 리뷰 5,000+',
                    cta: '베스트 상품 보기'
                }
            },
            saas: {
                question: {
                    headline: '아직도 엑셀로\n관리하시나요?',
                    subtext: '더 스마트한 방법이 있습니다',
                    cta: '기능 둘러보기'
                },
                social: {
                    headline: '도입 기업 92%가\n정식 전환',
                    subtext: '무료 체험 후 만족도 조사 결과',
                    cta: '무료 시작'
                }
            },
            urgency: {
                question: {
                    headline: '기회를 놓치면\n언제 다시 올까요?',
                    subtext: '지금이 최적의 타이밍입니다',
                    cta: '바로 신청'
                },
                social: {
                    headline: '이미 80% 마감\n잔여 20석',
                    subtext: '선착순 조기 마감 예정',
                    cta: '자리 확보'
                }
            }
        };
        
        return extraBank[domain] || {
            question: {
                headline: '고민만 하고 계신가요?',
                subtext: '시작이 반입니다',
                cta: '시작하기'
            },
            social: {
                headline: '많은 분들이\n이미 시작했습니다',
                subtext: '만족도 95% 이상',
                cta: '자세히 보기'
            }
        };
    }
    
    generateTags(domain, intent) {
        const tagMap = {
            education: '취업성공, 실무교육, 포트폴리오',
            productivity: '업무효율, 자동화, 협업도구',
            ai_automation: 'AI자동화, 업무혁신, 시간절약',
            cost_saving: '비용절감, ROI, 효율화',
            marketing: '마케팅, ROAS, 전환최적화',
            health: '다이어트, 건강관리, 바디프로필',
            investment: '투자, 자산관리, 재테크',
            ecommerce: '특가, 무료배송, 한정세일',
            saas: 'SaaS, 올인원, 기업솔루션',
            urgency: '마감임박, 선착순, 한정혜택'
        };
        return tagMap[domain] || '혜택, 시작하기, 무료체험';
    }
    
    fillContentEditor(content) {
        const headlineEl = document.getElementById('edit-headline');
        const subtextEl = document.getElementById('edit-subtext');
        const tagsEl = document.getElementById('edit-tags');
        const ctaEl = document.getElementById('edit-cta');
        
        if (headlineEl) headlineEl.value = content.headline;
        if (subtextEl) subtextEl.value = content.subtext;
        if (tagsEl) tagsEl.value = content.tags;
        if (ctaEl) ctaEl.value = content.cta;
    }
    
    loadPlanFromStorage() {
        try {
            const saved = localStorage.getItem('planSettings');
            if (!saved) return;
            
            const settings = JSON.parse(saved);
            
            // Message
            const messageInput = document.getElementById('message-input');
            if (messageInput && settings.message) {
                messageInput.value = settings.message;
            }
            
            // Template
            if (settings.template) {
                document.querySelectorAll('#template-selector .strategy-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.template === settings.template);
                });
            }
            
            // Platform
            if (settings.platform) {
                document.querySelectorAll('#platform-selector .platform-card').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.platform === settings.platform);
                });
            }
            
            // Size - 항상 Square(1:1)로 시작, 저장된 사이즈 로드하지 않음
            // (applyInitialState에서 Square로 설정)
            
            // Target
            if (settings.target) {
                document.querySelectorAll('#persona-selector .persona-card').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.target === settings.target);
                });
            }
        } catch (e) {
            console.warn('[FigmaPanel] Could not load plan settings:', e);
        }
    }
    
    savePlanToStorage() {
        try {
            const settings = {
                message: document.getElementById('message-input')?.value || '',
                template: document.querySelector('#template-selector .strategy-btn.active')?.dataset.template || 'benefit',
                size: document.querySelector('#size-selector .size-card.active')?.dataset.size || '1:1',
                target: document.querySelector('#persona-selector .persona-card.active')?.dataset.target || 'b2c'
            };
            localStorage.setItem('planSettings', JSON.stringify(settings));
        } catch (e) {
            console.warn('[FigmaPanel] Could not save plan settings:', e);
        }
    }
    
    updateCreativeBrief() {
        const platformBtn = document.querySelector('#platform-selector .platform-card.active');
        const templateBtn = document.querySelector('#template-selector .strategy-btn.active');
        const personaBtn = document.querySelector('#persona-selector .persona-card.active');
        const sizeSelect = document.getElementById('aspect-ratio');
        
        // Platform names mapping
        const platformNames = {
            meta: 'Meta 광고',
            google: 'Google 디스플레이',
            youtube: 'YouTube',
            mobion: 'Mobion',
            landing: 'Landing Page'
        };
        
        // Target names mapping
        const targetNames = {
            b2c: '일반 소비자',
            b2b: '기업 담당자',
            enterprise: '엔터프라이즈'
        };
        
        // Update brief card
        const briefPlatform = document.querySelector('#brief-platform .brief-value');
        const briefTarget = document.querySelector('#brief-target .brief-value');
        const briefSize = document.querySelector('#brief-size .brief-value');
        const briefTemplate = document.querySelector('#brief-template .brief-value');
        
        if (briefPlatform && platformBtn) {
            briefPlatform.textContent = platformNames[platformBtn.dataset.platform] || 'Meta 광고';
        }
        
        if (briefTarget && personaBtn) {
            briefTarget.textContent = targetNames[personaBtn.dataset.target] || '일반 소비자';
        }
        
        if (briefSize && sizeSelect) {
            const option = sizeSelect.options[sizeSelect.selectedIndex];
            briefSize.textContent = option?.textContent?.trim() || '1080×1080';
        }
        
        if (briefTemplate && templateBtn) {
            const templateName = templateBtn.querySelector('.strategy-name')?.textContent || '혜택형';
            briefTemplate.textContent = templateName;
        }
    }
    
    applyCanvasSize(width, height, size) {
        const canvas = document.getElementById('ad-canvas');
        if (!canvas) return;
        
        const canvasWrapper = canvas.parentElement;
        const availableWidth = (canvasWrapper?.clientWidth || 800) - 100;
        const availableHeight = (canvasWrapper?.clientHeight || 600) - 150;
        
        // Calculate scale to fit within available space (no scroll)
        const scaleX = availableWidth / width;
        const scaleY = availableHeight / height;
        const scale = Math.min(scaleX, scaleY, 0.5);
        
        // Set original canvas size and use transform to scale (maintains internal proportions)
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.style.transform = `scale(${scale})`;
        canvas.style.transformOrigin = 'center center';
        
        // Store current scale, size, and dimensions
        this.currentScale = scale;
        this.currentSize = size;
        this.currentWidth = width;
        this.currentHeight = height;
        
        // Apply size-specific preview image to canvas background
        const sizeImageMap = {
            '1:1': 'assets/size-square.png',
            '16:9': 'assets/size-landscape.png',
            '9:16': 'assets/size-portrait.png'
        };
        
        const imageSrc = sizeImageMap[size];
        if (imageSrc) {
            canvas.style.backgroundImage = `url('${imageSrc}')`;
            canvas.style.backgroundSize = 'cover';
            canvas.style.backgroundPosition = 'center';
            
            // Hide existing canvas content when applying template image
            const adContent = canvas.querySelector('.ad-content');
            if (adContent) {
                adContent.style.visibility = 'hidden';
            }
        }
        
        if (window.editorState) {
            window.editorState.updateCanvasSize(width, height);
            window.editorState.canvasWidth = width;
            window.editorState.canvasHeight = height;
            window.editorState.canvasScale = scale;
        }
        
        const statusSize = document.getElementById('status-canvas-size');
        if (statusSize) {
            statusSize.textContent = `${width} × ${height}`;
        }
        
        const exportSize = document.getElementById('export-current-size');
        if (exportSize) {
            exportSize.textContent = `${width} × ${height}`;
        }
        
        // Update new export size display
        const exportSingleSize = document.getElementById('export-single-size');
        if (exportSingleSize) {
            exportSingleSize.textContent = `${width} × ${height}`;
        }
    }
    
    applyContentToCanvas() {
        const canvas = document.getElementById('ad-canvas');
        if (!canvas) return;
        
        // Get values from editor
        const headline = document.getElementById('edit-headline')?.value || '';
        const subtext = document.getElementById('edit-subtext')?.value || '';
        const cta = document.getElementById('edit-cta')?.value || '';
        
        // Apply background: custom image or default gradient
        if (this.customBgImage) {
            canvas.style.backgroundImage = `url('${this.customBgImage}')`;
            canvas.style.backgroundSize = 'cover';
            canvas.style.backgroundPosition = 'center';
            canvas.style.background = '';
        } else {
            // Apply default gradient background
            const gradStartEl = document.getElementById('gradient-start-color');
            const gradEndEl = document.getElementById('gradient-end-color');
            const gradAngleEl = document.getElementById('gradient-angle');
            
            const gradStart = gradStartEl?.value || '#001D61';
            const gradEnd = gradEndEl?.value || '#003C8A';
            const gradAngle = gradAngleEl?.value || 135;
            
            canvas.style.backgroundImage = '';
            canvas.style.background = `linear-gradient(${gradAngle}deg, ${gradStart}, ${gradEnd})`;
        }
        
        // Show ad-content and update elements
        const adContent = canvas.querySelector('.ad-content');
        if (adContent) {
            adContent.style.visibility = 'visible';
            adContent.style.opacity = '1';
        }
        
        // ========================================
        // SAFE ZONE DEFINITION
        // ========================================
        const canvasWidth = this.currentWidth;
        const canvasHeight = this.currentHeight;
        
        const safeZone = {
            left: canvasWidth * 0.08,
            right: canvasWidth * 0.08,
            top: canvasHeight * 0.10,
            bottom: canvasHeight * 0.12
        };
        
        const maxTextWidth = canvasWidth - safeZone.left - safeZone.right;
        const centerX = canvasWidth / 2;
        
        // Fixed Y positions (center anchor)
        const HEADLINE_Y = canvasHeight * 0.35;
        const SUBTEXT_Y = canvasHeight * 0.55;
        const CTA_Y = canvasHeight * 0.75;
        
        // Font settings
        const HEADLINE_FONT_INITIAL = 50;
        const HEADLINE_FONT_MIN = 28;
        const SUBTEXT_FONT_INITIAL = 32;
        const SUBTEXT_FONT_MIN = 18;
        
        // ========================================
        // HELPER: Apply text element with measure-fit-clamp
        // ========================================
        const applyTextElement = (el, text, config) => {
            if (!el) return;
            
            // Set content
            if (config.useInnerHTML) {
                el.innerHTML = text.replace(/\n/g, '<br>');
            } else {
                el.textContent = text;
            }
            
            // Reset and apply base styles
            el.style.cssText = '';
            el.style.display = text ? 'block' : 'none';
            el.style.position = 'absolute';
            el.style.fontFamily = "'Inter', 'Noto Sans KR', sans-serif";
            el.style.fontWeight = config.fontWeight;
            el.style.color = '#ffffff';
            el.style.textAlign = 'center';
            el.style.lineHeight = config.lineHeight;
            el.style.whiteSpace = 'normal';
            el.style.overflowWrap = 'anywhere';
            el.style.wordBreak = 'keep-all';
            el.style.width = `${maxTextWidth}px`;
            el.style.maxWidth = `${maxTextWidth}px`;
            el.style.boxSizing = 'border-box';
            el.style.padding = '8px';
            
            // Set initial font size
            let fontSize = config.initialFontSize;
            el.style.fontSize = `${fontSize}px`;
            
            // Position at center (will be refined after measurement)
            el.style.left = `${centerX}px`;
            el.style.top = `${config.targetY}px`;
            el.style.transform = 'translate(-50%, -50%)';
            
            // Double requestAnimationFrame ensures DOM is fully rendered
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (!text) return;
                    
                    // Measure and fit font size
                    const maxHeight = config.maxHeightRatio * canvasHeight;
                    
                    while (fontSize > config.minFontSize && el.scrollHeight > maxHeight) {
                        fontSize -= 2;
                        el.style.fontSize = `${fontSize}px`;
                    }
                    
                    // Get final measured height
                    const measuredHeight = el.offsetHeight;
                    
                    // Clamp Y position within safe zone
                    let finalY = config.targetY;
                    const minY = safeZone.top + measuredHeight / 2;
                    const maxY = canvasHeight - safeZone.bottom - measuredHeight / 2;
                    finalY = Math.max(minY, Math.min(maxY, finalY));
                    
                    el.style.top = `${finalY}px`;
                });
            });
        };
        
        // ========================================
        // HEADLINE: Measure → Fit → Clamp
        // ========================================
        const headlineEl = document.getElementById('ad-headline');
        applyTextElement(headlineEl, headline, {
            useInnerHTML: true,
            fontWeight: '700',
            lineHeight: '1.3',
            initialFontSize: HEADLINE_FONT_INITIAL,
            minFontSize: HEADLINE_FONT_MIN,
            targetY: HEADLINE_Y,
            maxHeightRatio: 0.25
        });
        
        // ========================================
        // SUBTEXT: Measure → Fit → Clamp
        // ========================================
        const subtextEl = document.getElementById('ad-subtext');
        applyTextElement(subtextEl, subtext, {
            useInnerHTML: false,
            fontWeight: '400',
            lineHeight: '1.4',
            initialFontSize: SUBTEXT_FONT_INITIAL,
            minFontSize: SUBTEXT_FONT_MIN,
            targetY: SUBTEXT_Y,
            maxHeightRatio: 0.15
        });
        
        // ========================================
        // CTA: Clamp within safe zone
        // ========================================
        const ctaEl = document.getElementById('ad-cta');
        if (ctaEl) {
            ctaEl.textContent = cta;
            ctaEl.style.cssText = '';
            ctaEl.style.display = cta ? 'flex' : 'none';
            ctaEl.style.alignItems = 'center';
            ctaEl.style.justifyContent = 'center';
            ctaEl.style.fontFamily = "'Inter', 'Noto Sans KR', sans-serif";
            ctaEl.style.padding = '18px 48px';
            ctaEl.style.background = 'var(--cta-bg)';
            ctaEl.style.color = 'var(--cta-text)';
            ctaEl.style.borderRadius = '8px';
            ctaEl.style.fontSize = '18px';
            ctaEl.style.fontWeight = '600';
            ctaEl.style.whiteSpace = 'nowrap';
            ctaEl.style.maxWidth = `${maxTextWidth}px`;
            ctaEl.style.boxSizing = 'border-box';
            ctaEl.style.position = 'absolute';
            ctaEl.style.left = `${centerX}px`;
            ctaEl.style.top = `${CTA_Y}px`;
            ctaEl.style.transform = 'translate(-50%, -50%)';
            
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (!cta) return;
                    
                    const measuredHeight = ctaEl.offsetHeight;
                    const maxY = canvasHeight - safeZone.bottom - measuredHeight / 2;
                    
                    let finalY = Math.min(CTA_Y, maxY);
                    ctaEl.style.top = `${finalY}px`;
                });
            });
        }
    }
    
    updatePlatformSummary() {
        // Legacy - no longer needed
    }
    
    // Legacy method for backwards compatibility
    updatePlanSummary() {
        this.updateCreativeBrief();
        this.updatePlatformSummary();
        
        // Also update old summary elements if they exist
        const platformBtn = document.querySelector('#platform-selector .platform-card.active');
        const templateBtn = document.querySelector('#template-selector .strategy-btn.active');
        const sizeSelect = document.getElementById('aspect-ratio');
        
        const summaryPlatform = document.getElementById('summary-platform');
        const summarySize = document.getElementById('summary-size');
        const summaryTemplate = document.getElementById('summary-template');
        
        if (summaryPlatform && platformBtn) {
            summaryPlatform.textContent = platformBtn.querySelector('.platform-name')?.textContent || 'Meta';
        }
        
        if (summaryTemplate && templateBtn) {
            summaryTemplate.textContent = templateBtn.querySelector('.strategy-name')?.textContent || '혜택형';
        }
        
        if (summarySize && sizeSelect) {
            const option = sizeSelect.options[sizeSelect.selectedIndex];
            summarySize.textContent = option?.textContent?.replace(/\s+/g, '') || '1080×1080';
        }
    }
    
    // ============================================
    // OBJECT REGISTRATION
    // ============================================
    
    registerBackgroundAsObject() {
        if (!this.canvas) return;
        
        // Get initial background state
        const bgState = window.editorState.getBackground();
        
        window.editorState.registerObject('background', 'background', this.canvas, {
            fillType: bgState.type,
            fillColor: bgState.solidColor,
            gradientStart: bgState.gradient.start,
            gradientEnd: bgState.gradient.end,
            gradientAngle: bgState.gradient.angle,
            image: bgState.imageUrl,
            imageOverlay: bgState.imageOverlay ?? 0,
            imageBlur: bgState.imageBlur ?? 0,
            imageFit: bgState.imageFit || 'cover'
        });
        
        // Apply initial background
        const bgObj = window.editorState.getObject('background');
        if (bgObj) {
            window.editorState.applyStylesToElement(bgObj);
        }
    }
    
    registerExistingElements() {
        // Helper to get computed styles
        const getTextStyles = (el) => {
            const computed = window.getComputedStyle(el);
            return {
                fillColor: this.rgbToHex(computed.color) || '#ffffff',
                fillOpacity: 100,
                fontFamily: computed.fontFamily.split(',')[0].replace(/"/g, '').trim() || 'Pretendard',
                fontWeight: computed.fontWeight || '700',
                fontSize: parseInt(computed.fontSize) || 36,
                lineHeight: computed.lineHeight === 'normal' ? 1.4 : parseFloat(computed.lineHeight) / parseInt(computed.fontSize),
                letterSpacing: 0,
                textAlign: computed.textAlign || 'center'
            };
        };
        
        const getShapeStyles = (el) => {
            const computed = window.getComputedStyle(el);
            return {
                fillColor: this.rgbToHex(computed.backgroundColor) || '#3B82F6',
                fillOpacity: 100,
                strokeColor: '#ffffff',
                strokeWidth: 0,
                borderRadius: parseInt(computed.borderRadius) || 8
            };
        };
        
        // Helper to get position
        const getPosition = (el) => {
            return {
                x: parseInt(el.style.left) || 0,
                y: parseInt(el.style.top) || 0,
                width: el.offsetWidth,
                height: el.offsetHeight
            };
        };
        
        // Register headline
        const headline = this.canvas?.querySelector('.ad-headline');
        if (headline) {
            headline.dataset.layer = 'headline';
            window.editorState.registerObject('headline', 'text', headline, getTextStyles(headline), getPosition(headline));
        }
        
        // Register subtext
        const subtext = this.canvas?.querySelector('.ad-subtext');
        if (subtext) {
            subtext.dataset.layer = 'subtext';
            window.editorState.registerObject('subtext', 'text', subtext, getTextStyles(subtext), getPosition(subtext));
        }
        
        // Register CTA (as cta type with both background and text color)
        const cta = this.canvas?.querySelector('.ad-cta');
        if (cta) {
            cta.dataset.layer = 'cta';
            const computed = window.getComputedStyle(cta);
            const ctaStyles = {
                fillColor: this.rgbToHex(computed.backgroundColor) || '#3B82F6',
                textColor: this.rgbToHex(computed.color) || '#ffffff',
                fillOpacity: 100,
                fontFamily: computed.fontFamily.split(',')[0].replace(/"/g, '').trim() || 'Inter',
                fontWeight: computed.fontWeight || '600',
                fontSize: parseInt(computed.fontSize) || 18,
                borderRadius: parseInt(computed.borderRadius) || 8
            };
            window.editorState.registerObject('cta', 'cta', cta, ctaStyles, getPosition(cta));
        }
    }
    
    // Helper: RGB to Hex conversion
    rgbToHex(rgb) {
        if (!rgb || rgb === 'transparent') return '#ffffff';
        if (rgb.startsWith('#')) return rgb;
        
        const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return '#ffffff';
        
        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    }
    
    // ============================================
    // EVENT BINDINGS
    // ============================================
    
    bindEditorStateEvents() {
        window.editorState.on('activeElementChange', (obj) => {
            this.updatePanelForActiveElement(obj);
        });
        
        window.editorState.on('objectRegistered', () => {
            this.renderLayers();
        });
        
        window.editorState.on('objectUnregistered', () => {
            this.renderLayers();
        });
        
        window.editorState.on('layersChange', () => {
            this.renderLayers();
        });
        
        window.editorState.on('positionChange', (data) => {
            this.updatePositionPanel(data.object);
        });
    }
    
    updatePositionPanel(obj) {
        const posX = document.getElementById('position-x');
        const posY = document.getElementById('position-y');
        const posW = document.getElementById('position-width');
        const posH = document.getElementById('position-height');
        const posR = document.getElementById('position-rotation');
        
        if (!obj || obj.type === 'background') {
            if (posX) posX.value = 0;
            if (posY) posY.value = 0;
            if (posW) posW.value = this.currentWidth || 1080;
            if (posH) posH.value = this.currentHeight || 1080;
            if (posR) posR.value = 0;
            return;
        }
        
        // Get element from DOM
        const element = obj.element || document.querySelector(`[data-layer="${obj.id}"]`);
        if (!element) return;
        
        const x = parseInt(element.style.left) || 0;
        const y = parseInt(element.style.top) || 0;
        const w = element.offsetWidth || parseInt(element.style.width) || 0;
        const h = element.offsetHeight || parseInt(element.style.height) || 0;
        const r = obj.styles?.rotation || 0;
        
        if (posX) posX.value = Math.round(x);
        if (posY) posY.value = Math.round(y);
        if (posW) posW.value = Math.round(w);
        if (posH) posH.value = Math.round(h);
        if (posR) posR.value = Math.round(r);
    }
    
    updatePositionPanelForGroup() {
        const posX = document.getElementById('position-x');
        const posY = document.getElementById('position-y');
        const posW = document.getElementById('position-width');
        const posH = document.getElementById('position-height');
        
        const toolbarCtrl = window.toolbarController;
        if (!toolbarCtrl || !toolbarCtrl.selectedElements?.length) return;
        
        // Calculate bounding box of all selected elements
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        toolbarCtrl.selectedElements.forEach(el => {
            const x = parseInt(el.style.left) || 0;
            const y = parseInt(el.style.top) || 0;
            const w = el.offsetWidth || 0;
            const h = el.offsetHeight || 0;
            
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x + w);
            maxY = Math.max(maxY, y + h);
        });
        
        if (posX) posX.value = Math.round(minX);
        if (posY) posY.value = Math.round(minY);
        if (posW) posW.value = Math.round(maxX - minX);
        if (posH) posH.value = Math.round(maxY - minY);
    }
    
    bindCanvasSelection() {
        if (!this.canvas) return;
        
        // Click on canvas background
        this.canvas.addEventListener('click', (e) => {
            // If clicked directly on canvas (not on a child element)
            if (e.target === this.canvas || 
                e.target.classList.contains('ad-bg-image') || 
                e.target.classList.contains('ad-overlay')) {
                this.selectObject('background');
            }
        });
    }
    
    selectObject(id, options = {}) {
        const { switchToDesignTab = true, fromToolbar = false } = options;
        
        const obj = window.editorState.getObject(id);
        
        // Use toolbar's selectElement for canvas elements (handles resize handles, dragging, etc.)
        // But avoid infinite loop if called from toolbar
        if (obj?.element && id !== 'background' && window.toolbarController && !fromToolbar) {
            window.toolbarController.selectElement(obj.element);
        } else {
            // For background or when called from toolbar
            if (!fromToolbar) {
                this.canvas?.querySelectorAll('.selected').forEach(el => {
                    el.classList.remove('selected');
                });
            }
            window.editorState.setActiveElement(id);
        }
        
        // Auto-switch to Design tab when selecting an object (unless disabled)
        if (switchToDesignTab && this.currentTab !== 'design') {
            this.switchTab('design');
        }
    }
    
    // ============================================
    // PANEL VISIBILITY BASED ON TYPE
    // ============================================
    
    updatePanelForActiveElement(obj) {
        const { fill, stroke, typography } = this.sections;
        const selectionName = document.getElementById('selection-name');
        const selectionIcon = document.getElementById('selection-icon');
        
        // Always show all sections as active (no disabled state)
        if (fill) {
            fill.style.display = 'block';
            fill.classList.remove('disabled-section');
        }
        if (stroke) {
            stroke.style.display = 'block';
            stroke.classList.remove('disabled-section');
        }
        if (typography) {
            typography.style.display = 'block';
            typography.classList.remove('disabled-section');
        }
        
        if (!obj) {
            if (selectionName) selectionName.textContent = '선택된 요소 없음';
            return;
        }
        
        // Type names and icons
        const typeConfig = {
            background: { name: '배경', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>' },
            text: { name: '텍스트', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3"/><path d="M12 4v16"/></svg>' },
            cta: { name: 'CTA 버튼', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="8" rx="4"/></svg>' },
            shape: { name: '도형', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>' },
            image: { name: '이미지', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>' }
        };
        
        const config = typeConfig[obj.type] || { name: '요소', icon: typeConfig.shape.icon };
        if (selectionName) selectionName.textContent = config.name;
        if (selectionIcon) selectionIcon.innerHTML = config.icon;
        
        // Always show all sections (Figma style)
        // But configure them based on selected element type
        if (typography) typography.style.display = 'block';
        if (fill) fill.style.display = 'block';
        if (stroke) stroke.style.display = 'block';
        
        // Configure Fill section title based on type
        switch (obj.type) {
            case 'background':
                this.updateFillTitle('Background');
                this.showGradientControls(true);
                break;
                
            case 'text':
                this.updateFillTitle('Fill');
                this.showGradientControls(false);
                break;
                
            case 'shape':
                this.updateFillTitle('Fill');
                this.showGradientControls(true);
                break;
                
            case 'image':
                this.updateFillTitle('Opacity');
                this.showGradientControls(false);
                break;
        }
        
        // Sync panel values from object styles
        this.syncPanelFromObject(obj);
        
        // Update layers panel
        this.updateActiveLayerHighlight(obj.id);
    }
    
    updateFillTitle(title) {
        const section = this.sections.fill;
        if (section) {
            const titleEl = section.querySelector('.section-title');
            if (titleEl) titleEl.textContent = title;
        }
    }
    
    showGradientControls(show) {
        const tabs = document.querySelector('.fill-type-tabs');
        if (tabs) tabs.style.display = show ? 'flex' : 'none';
        
        // If hiding gradient, force solid mode
        if (!show) {
            document.querySelectorAll('.fill-editor').forEach(ed => ed.style.display = 'none');
            const solidEditor = document.getElementById('fill-solid-editor');
            if (solidEditor) solidEditor.style.display = 'block';
        }
    }
    
    // ============================================
    // SYNC PANEL FROM OBJECT
    // ============================================
    
    syncPanelFromObject(obj) {
        if (!obj) return;
        
        const s = obj.styles;
        
        // Position controls
        this.updatePositionPanel(obj);
        
        // Fill controls (always sync)
        const fillColor = document.getElementById('fill-color');
        const fillColorHex = document.getElementById('fill-color-hex');
        const fillOpacity = document.getElementById('fill-opacity');
        
        if (obj.type === 'background' || obj.type === 'shape') {
            // Sync gradient controls
            const gradStart = document.getElementById('gradient-start-color');
            const gradStartHex = document.getElementById('gradient-start-hex');
            const gradEnd = document.getElementById('gradient-end-color');
            const gradEndHex = document.getElementById('gradient-end-hex');
            const gradAngle = document.getElementById('gradient-angle');
            
            if (gradStart) gradStart.value = s.gradientStart || '#001D61';
            if (gradStartHex) gradStartHex.value = (s.gradientStart || '#001D61').replace('#', '').toUpperCase();
            if (gradEnd) gradEnd.value = s.gradientEnd || '#003C8A';
            if (gradEndHex) gradEndHex.value = (s.gradientEnd || '#003C8A').replace('#', '').toUpperCase();
            if (gradAngle) gradAngle.value = s.gradientAngle || 135;
            
            // Solid color for background/shape
            if (fillColor) fillColor.value = s.fillColor || s.gradientStart || '#00298A';
            if (fillColorHex) fillColorHex.value = (s.fillColor || s.gradientStart || '#00298A').replace('#', '').toUpperCase();
            
            // Update gradient bar
            this.updateGradientBar(s.gradientStart, s.gradientEnd);
            
            // Update fill type tabs
            document.querySelectorAll('.fill-tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.fillType === s.fillType);
            });
            this.showFillEditor(s.fillType || 'solid');
            
            // Image overlay and blur controls
            const fillOverlay = document.getElementById('fill-overlay');
            const fillBlur = document.getElementById('fill-blur');
            const fillImageFit = document.getElementById('fill-image-fit');
            
            if (fillOverlay) fillOverlay.value = s.imageOverlay ?? 0;
            if (fillBlur) fillBlur.value = s.imageBlur ?? 0;
            if (fillImageFit) fillImageFit.value = s.imageFit || 'cover';
            
        } else {
            // Non-background types: sync fillColor to fill controls
            const color = s.fillColor || '#ffffff';
            if (fillColor) fillColor.value = color;
            if (fillColorHex) fillColorHex.value = color.replace('#', '').toUpperCase();
        }
        
        // Opacity (all types)
        if (fillOpacity) fillOpacity.value = s.fillOpacity ?? 100;
        
        // Stroke controls (for shape/image)
        if (obj.type === 'shape' || obj.type === 'image') {
            const strokeColor = document.getElementById('stroke-color');
            const strokeColorHex = document.getElementById('stroke-color-hex');
            const strokeWidth = document.getElementById('stroke-width');
            const strokePosition = document.getElementById('stroke-position');
            
            if (strokeColor) strokeColor.value = s.strokeColor || '#ffffff';
            if (strokeColorHex) strokeColorHex.value = (s.strokeColor || '#ffffff').replace('#', '').toUpperCase();
            if (strokeWidth) strokeWidth.value = s.strokeWidth || 0;
            if (strokePosition) strokePosition.value = s.strokePosition || 'inside';
        }
        
        // CTA controls (background + text color)
        if (obj.type === 'cta') {
            // Background color in fill section
            const bgColor = s.fillColor || '#3B82F6';
            if (fillColor) fillColor.value = bgColor;
            if (fillColorHex) fillColorHex.value = bgColor.replace('#', '').toUpperCase();
            
            // Text color in text-color section
            const textColor = document.getElementById('text-color');
            const textColorHex = document.getElementById('text-color-hex');
            const txtColor = s.textColor || '#ffffff';
            if (textColor) textColor.value = txtColor;
            if (textColorHex) textColorHex.value = txtColor.replace('#', '').toUpperCase();
            
            // Font settings
            const fontSize = document.getElementById('font-size');
            const fontSizeSlider = document.getElementById('font-size-slider');
            if (fontSize) fontSize.value = s.fontSize || 18;
            if (fontSizeSlider) fontSizeSlider.value = s.fontSize || 18;
        }
        
        // Typography controls (for text)
        if (obj.type === 'text') {
            const fontFamily = document.getElementById('font-family');
            const fontWeight = document.getElementById('font-weight');
            const fontSize = document.getElementById('font-size');
            const fontSizeSlider = document.getElementById('font-size-slider');
            const lineHeight = document.getElementById('line-height');
            const letterSpacing = document.getElementById('letter-spacing');
            const textColor = document.getElementById('text-color');
            const textColorHex = document.getElementById('text-color-hex');
            
            if (fontFamily) fontFamily.value = s.fontFamily || 'Pretendard';
            if (fontWeight) fontWeight.value = s.fontWeight || '700';
            if (fontSize) fontSize.value = s.fontSize || 36;
            if (fontSizeSlider) fontSizeSlider.value = s.fontSize || 36;
            // Convert decimal line-height (1.3) to percentage (130)
            if (lineHeight) lineHeight.value = Math.round((s.lineHeight || 1.3) * 100);
            if (letterSpacing) letterSpacing.value = s.letterSpacing || 0;
            
            // Text color sync
            const textColorValue = s.fillColor || '#ffffff';
            if (textColor) textColor.value = textColorValue;
            if (textColorHex) textColorHex.value = textColorValue.replace('#', '').toUpperCase();
            
            // Also sync fill section color for text (for consistency)
            if (fillColor) fillColor.value = textColorValue;
            if (fillColorHex) fillColorHex.value = textColorValue.replace('#', '').toUpperCase();
            
            // Update align buttons
            document.querySelectorAll('[data-align]').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.align === s.textAlign);
            });
        }
    }
    
    
    
    
    // ============================================
    // FILL CONTROLS
    // ============================================
    
    bindFillControls() {
        // UNIFIED: Fill Type Tabs - same behavior for ALL types (background, shape, etc.)
        document.querySelectorAll('.fill-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                let activeObj = window.editorState.activeElement;
                
                // If no active element, auto-select background
                if (!activeObj) {
                    window.editorState.setActiveElement('background');
                    activeObj = window.editorState.activeElement;
                    if (!activeObj) return;
                }
                
                // Only background and shape support fill type tabs
                if (activeObj.type !== 'background' && activeObj.type !== 'shape') {
                    return;
                }
                
                document.querySelectorAll('.fill-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const type = tab.dataset.fillType;
                this.showFillEditor(type);
                
                // UNIFIED: All types use the same updateActiveStyle
                window.editorState.updateActiveStyle('fillType', type);
            });
        });
        
        // Solid/Text Color
        const fillColor = document.getElementById('fill-color');
        const fillColorHex = document.getElementById('fill-color-hex');
        
        // UNIFIED: Fill color - same for ALL types
        fillColor?.addEventListener('input', (e) => {
            const obj = window.editorState.activeElement;
            if (!obj) return;
            
            const color = e.target.value;
            fillColorHex.value = color.replace('#', '').toUpperCase();
            
            // UNIFIED: All types use updateActiveStyle
            window.editorState.updateActiveStyle('fillColor', color);
            
            // Sync text-color input if text type
            if (obj.type === 'text') {
                const textColor = document.getElementById('text-color');
                const textColorHex = document.getElementById('text-color-hex');
                if (textColor) textColor.value = color;
                if (textColorHex) textColorHex.value = color.replace('#', '').toUpperCase();
            }
        });
        
        // UNIFIED: Fill color hex - same for ALL types
        fillColorHex?.addEventListener('change', (e) => {
            const obj = window.editorState.activeElement;
            let val = e.target.value.replace('#', '');
            if (val.length === 6) {
                const color = '#' + val;
                fillColor.value = color;
                
                // UNIFIED: All types use updateActiveStyle
                window.editorState.updateActiveStyle('fillColor', color);
                
                // Sync text-color input if text type
                if (obj?.type === 'text') {
                    const textColor = document.getElementById('text-color');
                    const textColorHex = document.getElementById('text-color-hex');
                    if (textColor) textColor.value = color;
                    if (textColorHex) textColorHex.value = val.toUpperCase();
                }
            }
        });
        
        // Opacity
        document.getElementById('fill-opacity')?.addEventListener('input', (e) => {
            window.editorState.updateActiveStyle('fillOpacity', parseInt(e.target.value));
        });
        
        // Gradient Start
        const gradStart = document.getElementById('gradient-start-color');
        const gradStartHex = document.getElementById('gradient-start-hex');
        
        // UNIFIED: Gradient Start - same for ALL types
        gradStart?.addEventListener('input', (e) => {
            gradStartHex.value = e.target.value.replace('#', '').toUpperCase();
            window.editorState.updateActiveStyle('gradientStart', e.target.value);
            this.updateGradientBar(e.target.value, null);
        });
        
        // Gradient End
        const gradEnd = document.getElementById('gradient-end-color');
        const gradEndHex = document.getElementById('gradient-end-hex');
        
        // UNIFIED: Gradient End - same for ALL types
        gradEnd?.addEventListener('input', (e) => {
            gradEndHex.value = e.target.value.replace('#', '').toUpperCase();
            window.editorState.updateActiveStyle('gradientEnd', e.target.value);
            this.updateGradientBar(null, e.target.value);
        });
        
        // UNIFIED: Gradient Angle - same for ALL types
        document.getElementById('gradient-angle')?.addEventListener('input', (e) => {
            window.editorState.updateActiveStyle('gradientAngle', parseInt(e.target.value));
        });
        
        // Presets
        document.querySelectorAll('.preset-swatch').forEach(swatch => {
            swatch.addEventListener('click', () => {
                const obj = window.editorState.activeElement;
                if (!obj || (obj.type !== 'background' && obj.type !== 'shape')) return;
                
                const start = swatch.dataset.gradientStart;
                const end = swatch.dataset.gradientEnd;
                
                // Switch to gradient mode
                document.querySelectorAll('.fill-tab').forEach(t => t.classList.remove('active'));
                document.querySelector('.fill-tab[data-fill-type="gradient"]')?.classList.add('active');
                this.showFillEditor('gradient');
                
                window.editorState.updateActiveStyles({
                    fillType: 'gradient',
                    gradientStart: start,
                    gradientEnd: end
                });
                
                // Update inputs
                const gradStartInput = document.getElementById('gradient-start-color');
                const gradEndInput = document.getElementById('gradient-end-color');
                if (gradStartInput) gradStartInput.value = start;
                if (gradEndInput) gradEndInput.value = end;
                this.updateGradientBar(start, end);
            });
        });
        
        // Image upload
        const uploadZone = document.getElementById('fill-upload-zone');
        const imageInput = document.getElementById('fill-image-input');
        
        uploadZone?.addEventListener('click', () => imageInput?.click());
        
        imageInput?.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const obj = window.editorState.activeElement;
                    // UNIFIED: All types set fillType to 'image' and image data
                    window.editorState.updateActiveStyles({
                        fillType: 'image',
                        image: ev.target.result
                    });
                    this.showImagePreview(ev.target.result);
                    
                    // Update UI tabs to show image is selected
                    document.querySelectorAll('.fill-tab').forEach(t => t.classList.remove('active'));
                    document.querySelector('.fill-tab[data-fill-type="image"]')?.classList.add('active');
                    this.showFillEditor('image');
                };
                reader.readAsDataURL(file);
            }
        });
        
        document.getElementById('fill-remove-image')?.addEventListener('click', () => {
            const obj = window.editorState.activeElement;
            if (obj?.type === 'shape') {
                window.editorState.updateActiveStyles({
                    fillType: 'solid',
                    image: null
                });
            } else {
                window.editorState.updateActiveStyle('image', null);
            }
            this.hideImagePreview();
        });
        
        document.getElementById('fill-overlay')?.addEventListener('input', (e) => {
            window.editorState.updateActiveStyle('imageOverlay', parseInt(e.target.value) || 0);
        });
        
        document.getElementById('fill-blur')?.addEventListener('input', (e) => {
            window.editorState.updateActiveStyle('imageBlur', parseInt(e.target.value) || 0);
        });
        
        document.getElementById('fill-image-fit')?.addEventListener('change', (e) => {
            window.editorState.updateActiveStyle('imageFit', e.target.value);
        });
    }
    
    showFillEditor(type) {
        document.querySelectorAll('.fill-editor').forEach(ed => ed.style.display = 'none');
        const editorMap = {
            'solid': 'fill-solid-editor',
            'gradient': 'fill-gradient-editor',
            'image': 'fill-image-editor'
        };
        const editor = document.getElementById(editorMap[type]);
        if (editor) editor.style.display = 'block';
    }
    
    updateGradientBar(start, end) {
        const bar = document.getElementById('gradient-bar');
        if (!bar) return;
        
        const activeObj = window.editorState.activeElement;
        const s = activeObj?.styles || {};
        
        const actualStart = start || s.gradientStart || '#001D61';
        const actualEnd = end || s.gradientEnd || '#003C8A';
        
        bar.style.background = `linear-gradient(90deg, ${actualStart}, ${actualEnd})`;
    }
    
    showImagePreview(src) {
        const zone = document.getElementById('fill-upload-zone');
        const preview = document.getElementById('fill-image-preview');
        const img = document.getElementById('fill-preview-img');
        
        if (zone) zone.style.display = 'none';
        if (preview) preview.style.display = 'block';
        if (img) img.src = src;
    }
    
    hideImagePreview() {
        const zone = document.getElementById('fill-upload-zone');
        const preview = document.getElementById('fill-image-preview');
        
        if (zone) zone.style.display = 'flex';
        if (preview) preview.style.display = 'none';
    }
    
    // ============================================
    // STROKE CONTROLS
    // ============================================
    
    bindStrokeControls() {
        const strokeColor = document.getElementById('stroke-color');
        const strokeColorHex = document.getElementById('stroke-color-hex');
        
        strokeColor?.addEventListener('input', (e) => {
            strokeColorHex.value = e.target.value.replace('#', '').toUpperCase();
            window.editorState.updateActiveStyle('strokeColor', e.target.value);
        });
        
        strokeColorHex?.addEventListener('change', (e) => {
            let val = e.target.value.replace('#', '');
            if (val.length === 6) {
                strokeColor.value = '#' + val;
                window.editorState.updateActiveStyle('strokeColor', '#' + val);
            }
        });
        
        document.getElementById('stroke-width')?.addEventListener('input', (e) => {
            window.editorState.updateActiveStyle('strokeWidth', parseInt(e.target.value));
        });
        
        document.getElementById('stroke-position')?.addEventListener('change', (e) => {
            window.editorState.updateActiveStyle('strokePosition', e.target.value);
        });
    }
    
    // ============================================
    // TYPOGRAPHY CONTROLS
    // ============================================
    
    bindTypographyControls() {
        document.getElementById('font-family')?.addEventListener('change', (e) => {
            window.editorState.updateActiveStyle('fontFamily', e.target.value);
        });
        
        document.getElementById('font-weight')?.addEventListener('change', (e) => {
            window.editorState.updateActiveStyle('fontWeight', e.target.value);
        });
        
        document.getElementById('font-size')?.addEventListener('input', (e) => {
            window.editorState.updateActiveStyle('fontSize', parseInt(e.target.value));
        });
        
        document.getElementById('line-height')?.addEventListener('input', (e) => {
            const val = parseInt(e.target.value) || 130;
            // Convert percentage to decimal (130% = 1.3)
            window.editorState.updateActiveStyle('lineHeight', val / 100);
        });
        
        document.getElementById('letter-spacing')?.addEventListener('input', (e) => {
            window.editorState.updateActiveStyle('letterSpacing', parseInt(e.target.value));
        });
        
        document.getElementById('text-color')?.addEventListener('input', (e) => {
            const obj = window.editorState.activeElement;
            
            // CTA uses textColor for text, fillColor for background
            if (obj?.type === 'cta') {
                window.editorState.updateActiveStyle('textColor', e.target.value);
            } else {
                window.editorState.updateActiveStyle('fillColor', e.target.value);
                
                // Also update fill panel for text elements
                const fillColor = document.getElementById('fill-color');
                const fillColorHex = document.getElementById('fill-color-hex');
                if (fillColor) fillColor.value = e.target.value;
                if (fillColorHex) fillColorHex.value = e.target.value.replace('#', '').toUpperCase();
            }
        });
        
        // Text Align
        document.querySelectorAll('[data-align]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-align]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                window.editorState.updateActiveStyle('textAlign', btn.dataset.align);
            });
        });
    }
    
    // ============================================
    // LAYERS
    // ============================================
    
    renderLayers() {
        const list = document.getElementById('layers-list');
        const empty = document.getElementById('layers-empty');
        
        if (!list) return;
        
        const objects = window.editorState.getAllObjects()
            .filter(obj => obj.type !== 'background');
        
        if (objects.length === 0) {
            list.innerHTML = '';
            if (empty) empty.style.display = 'flex';
            return;
        }
        
        if (empty) empty.style.display = 'none';
        
        const activeId = window.editorState.activeElement?.id;
        const selectedIds = this.getSelectedLayerIds();
        
        list.innerHTML = objects.map((obj, index) => `
            <div class="figma-layer-item ${selectedIds.includes(obj.id) ? 'active' : ''} ${!obj.visible ? 'hidden' : ''}" 
                 data-layer-id="${obj.id}" data-layer-index="${index}">
                <div class="figma-layer-icon">
                    ${this.getLayerIcon(obj.type)}
                </div>
                <span class="figma-layer-name">${obj.id}</span>
                <div class="figma-layer-actions">
                    <button class="figma-layer-btn visibility" data-action="toggle">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            ${obj.visible 
                                ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
                                : '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/>'
                            }
                        </svg>
                    </button>
                    <button class="figma-layer-btn delete" data-action="delete">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Bind click events
        list.querySelectorAll('.figma-layer-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.closest('.figma-layer-btn')) return;
                
                const layerId = item.dataset.layerId;
                const isMultiSelect = e.ctrlKey || e.metaKey || e.shiftKey;
                
                if (isMultiSelect) {
                    this.toggleLayerSelection(layerId);
                } else {
                    this.selectObject(layerId);
                }
            });
        });
        
        
        list.querySelectorAll('.figma-layer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.closest('.figma-layer-item').dataset.layerId;
                const action = btn.dataset.action;
                
                if (action === 'toggle') {
                    window.editorState.toggleLayerVisibility(id);
                    this.renderLayers();
                } else if (action === 'delete') {
                    window.editorState.removeLayer(id);
                }
            });
        });
    }
    
    
    getLayerIcon(type) {
        const icons = {
            text: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3"/><path d="M12 4v16"/></svg>',
            shape: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>',
            image: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>'
        };
        return icons[type] || icons.shape;
    }
    
    updateActiveLayerHighlight(activeId) {
        const selectedIds = this.getSelectedLayerIds();
        document.querySelectorAll('.figma-layer-item').forEach(item => {
            item.classList.toggle('active', selectedIds.includes(item.dataset.layerId));
        });
    }
    
    getSelectedLayerIds() {
        const activeId = window.editorState.activeElement?.id;
        const selectedElements = window.toolbarController?.selectedElements || [];
        
        if (window.toolbarController?.isGroupMode && selectedElements.length > 0) {
            return selectedElements.map(el => {
                const obj = window.editorState.getAllObjects().find(o => o.element === el);
                return obj?.id;
            }).filter(Boolean);
        }
        
        return activeId ? [activeId] : [];
    }
    
    toggleLayerSelection(layerId) {
        const obj = window.editorState.getObject(layerId);
        if (!obj || !obj.element) return;
        
        const toolbarCtrl = window.toolbarController;
        if (!toolbarCtrl) return;
        
        // Initialize multi-select mode if not already
        if (!toolbarCtrl.selectedElements) {
            toolbarCtrl.selectedElements = [];
        }
        
        const isAlreadySelected = toolbarCtrl.selectedElements.includes(obj.element);
        
        if (isAlreadySelected) {
            // Remove from selection
            toolbarCtrl.selectedElements = toolbarCtrl.selectedElements.filter(el => el !== obj.element);
            obj.element.classList.remove('selected');
        } else {
            // Add to selection
            toolbarCtrl.selectedElements.push(obj.element);
            obj.element.classList.add('selected');
        }
        
        // Update group mode
        if (toolbarCtrl.selectedElements.length > 1) {
            toolbarCtrl.isGroupMode = true;
            toolbarCtrl.showGroupBorder();
            this.updatePositionPanelForGroup();
        } else if (toolbarCtrl.selectedElements.length === 1) {
            toolbarCtrl.isGroupMode = false;
            toolbarCtrl.hideGroupBorder();
            toolbarCtrl.selectElement(toolbarCtrl.selectedElements[0]);
        } else {
            toolbarCtrl.isGroupMode = false;
            toolbarCtrl.hideGroupBorder();
            this.selectObject('background');
        }
        
        this.renderLayers();
    }
    
    // ============================================
    // LAYER ORDER CONTROLS
    // ============================================
    
    bindLayerControls() {
        // Select all button
        document.getElementById('layer-select-all')?.addEventListener('click', () => this.selectAllLayers());
    }
    
    moveLayerUp() {
        const activeId = window.editorState.activeElement?.id;
        if (!activeId || activeId === 'background') return;
        
        const objects = window.editorState.getAllObjects().filter(o => o.type !== 'background');
        const index = objects.findIndex(o => o.id === activeId);
        
        if (index > 0) {
            this.swapLayerOrder(index, index - 1);
        }
    }
    
    moveLayerDown() {
        const activeId = window.editorState.activeElement?.id;
        if (!activeId || activeId === 'background') return;
        
        const objects = window.editorState.getAllObjects().filter(o => o.type !== 'background');
        const index = objects.findIndex(o => o.id === activeId);
        
        if (index < objects.length - 1) {
            this.swapLayerOrder(index, index + 1);
        }
    }
    
    moveLayerToTop() {
        const activeId = window.editorState.activeElement?.id;
        if (!activeId || activeId === 'background') return;
        
        const obj = window.editorState.getObject(activeId);
        if (!obj?.element) return;
        
        const container = obj.element.parentElement;
        container.insertBefore(obj.element, container.firstChild);
        window.editorState.emit('layersChange');
    }
    
    moveLayerToBottom() {
        const activeId = window.editorState.activeElement?.id;
        if (!activeId || activeId === 'background') return;
        
        const obj = window.editorState.getObject(activeId);
        if (!obj?.element) return;
        
        const container = obj.element.parentElement;
        container.appendChild(obj.element);
        window.editorState.emit('layersChange');
    }
    
    swapLayerOrder(indexA, indexB) {
        const objects = window.editorState.getAllObjects().filter(o => o.type !== 'background');
        const objA = objects[indexA];
        const objB = objects[indexB];
        
        if (!objA?.element || !objB?.element) return;
        
        const container = objA.element.parentElement;
        const nextSibling = objA.element.nextSibling === objB.element ? objA.element : objA.element.nextSibling;
        
        container.insertBefore(objA.element, objB.element);
        container.insertBefore(objB.element, nextSibling);
        
        window.editorState.emit('layersChange');
    }
    
    deleteSelectedLayers() {
        const selectedIds = this.getSelectedLayerIds();
        if (selectedIds.length === 0) return;
        
        selectedIds.forEach(id => {
            if (id !== 'background') {
                window.editorState.removeLayer(id);
            }
        });
        
        this.selectObject('background');
    }
    
    selectAllLayers() {
        const objects = window.editorState.getAllObjects().filter(o => o.type !== 'background');
        const toolbarCtrl = window.toolbarController;
        
        if (!toolbarCtrl || objects.length === 0) return;
        
        toolbarCtrl.selectedElements = objects.map(o => o.element).filter(Boolean);
        toolbarCtrl.isGroupMode = true;
        
        objects.forEach(obj => {
            if (obj.element) {
                obj.element.classList.add('selected');
            }
        });
        
        toolbarCtrl.showGroupBorder();
        this.renderLayers();
    }
    
    // ============================================
    // ICON ADD TO CANVAS
    // ============================================
    
    addIconToCanvas(dataUrl, fileName) {
        const canvas = document.getElementById('ad-canvas');
        const elementsContainer = document.getElementById('ad-elements');
        if (!canvas || !elementsContainer) return;
        
        const iconId = `icon-${Date.now()}`;
        
        // Create icon element
        const iconEl = document.createElement('div');
        iconEl.className = 'ad-element draggable';
        iconEl.id = iconId;
        iconEl.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 100px;
            height: 100px;
            cursor: move;
            z-index: 10;
        `;
        
        const img = document.createElement('img');
        img.src = dataUrl;
        img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: contain;
            pointer-events: none;
        `;
        
        iconEl.appendChild(img);
        elementsContainer.appendChild(iconEl);
        
        // Register with editorState
        window.editorState.registerObject({
            id: iconId,
            type: 'image',
            element: iconEl,
            x: 50,
            y: 50,
            width: 100,
            height: 100,
            visible: true,
            locked: false
        });
        
        // Add to preview panel
        this.updateIconsPreview();
        
        // Make draggable
        this.makeElementDraggable(iconEl);
        
        // Select the new icon
        this.selectObject(iconId);
    }
    
    makeElementDraggable(element) {
        let isDragging = false;
        let hasMoved = false;
        let startX, startY, initialX, initialY;
        
        element.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            if (e.target.classList.contains('resize-handle')) return;
            
            isDragging = true;
            hasMoved = false;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = element.getBoundingClientRect();
            const canvasRect = this.canvas.getBoundingClientRect();
            const scale = this.currentScale || 0.5;
            
            initialX = (rect.left - canvasRect.left) / scale;
            initialY = (rect.top - canvasRect.top) / scale;
            
            element.style.transform = 'none';
            element.style.left = `${initialX}px`;
            element.style.top = `${initialY}px`;
            
            // Select the element
            if (window.toolbarController) {
                window.toolbarController.selectElement(element);
            }
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            
            e.preventDefault();
            e.stopPropagation();
        });
        
        const onMouseMove = (e) => {
            if (!isDragging) return;
            
            const scale = this.currentScale || 0.5;
            const dx = (e.clientX - startX) / scale;
            const dy = (e.clientY - startY) / scale;
            
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                hasMoved = true;
            }
            
            let newX = initialX + dx;
            let newY = initialY + dy;
            
            // Apply snap if toolbar controller exists
            if (window.toolbarController?.snapEnabled) {
                const snapped = window.toolbarController.calculateSnap(
                    newX, newY,
                    element.offsetWidth, element.offsetHeight,
                    element
                );
                newX = snapped.x;
                newY = snapped.y;
            }
            
            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
            
            // Real-time position update
            const obj = window.editorState.getAllObjects().find(o => o.element === element);
            if (obj) {
                obj.x = Math.round(newX);
                obj.y = Math.round(newY);
                this.updatePositionPanel(obj);
            }
        };
        
        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            
            // Hide snap guides
            window.toolbarController?.hideGuides();
            
            // Update editorState
            const obj = window.editorState.getAllObjects().find(o => o.element === element);
            if (obj) {
                obj.x = parseInt(element.style.left) || 0;
                obj.y = parseInt(element.style.top) || 0;
                window.editorState.emit('positionChange', { object: obj });
            }
        };
    }
    
    
    updateIconsPreview() {
        const preview = document.getElementById('added-icons-preview');
        if (!preview) return;
        
        const icons = window.editorState.getAllObjects().filter(o => o.type === 'image');
        
        preview.innerHTML = icons.map(icon => {
            const img = icon.element?.querySelector('img');
            return `
                <div class="added-icon-item" data-icon-id="${icon.id}">
                    <img src="${img?.src || ''}" alt="${icon.id}">
                    <button class="icon-remove" data-remove-id="${icon.id}">&times;</button>
                </div>
            `;
        }).join('');
        
        // Bind remove buttons
        preview.querySelectorAll('.icon-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const iconId = btn.dataset.removeId;
                window.editorState.removeLayer(iconId);
                this.updateIconsPreview();
            });
        });
    }
    
    clearAllIcons() {
        const icons = window.editorState.getAllObjects().filter(o => o.type === 'image');
        icons.forEach(icon => {
            window.editorState.removeLayer(icon.id);
        });
        this.updateIconsPreview();
        document.getElementById('edit-add-icon').value = '';
    }
    
    // ============================================
    // EXPORT FUNCTIONALITY
    // ============================================
    
    bindExportControls() {
        // Single image export
        document.getElementById('export-single-btn')?.addEventListener('click', () => {
            this.exportSingleImage();
        });
        
        // Update size display when canvas changes
        this.updateExportSizeDisplay();
    }
    
    updateExportSizeDisplay() {
        const sizeDisplay = document.getElementById('export-single-size');
        if (sizeDisplay) {
            sizeDisplay.textContent = `${this.currentWidth} × ${this.currentHeight}`;
        }
    }
    
    getExportSettings() {
        const scale = parseInt(document.getElementById('export-scale')?.value) || 2;
        const format = document.getElementById('export-format')?.value || 'png';
        return { scale, format };
    }
    
    showProgress(show = true) {
        const progress = document.getElementById('export-progress');
        if (progress) {
            progress.style.display = show ? 'block' : 'none';
        }
    }
    
    updateProgress(current, total, text = '') {
        const fill = document.getElementById('export-progress-fill');
        const textEl = document.getElementById('export-progress-text');
        
        if (fill) {
            fill.style.width = `${(current / total) * 100}%`;
        }
        if (textEl) {
            textEl.textContent = text || `${current} / ${total} 완료`;
        }
    }
    
    async captureCanvas(filename) {
        const { scale, format } = this.getExportSettings();
        const canvas = document.getElementById('ad-canvas');
        
        if (!canvas) {
            console.error('Canvas not found');
            return null;
        }
        
        try {
            const capturedCanvas = await html2canvas(canvas, {
                scale: scale,
                backgroundColor: null,
                logging: false,
                useCORS: true
            });
            
            const mimeType = format === 'jpeg' ? 'image/jpeg' : 
                            format === 'webp' ? 'image/webp' : 'image/png';
            const quality = format === 'jpeg' ? 0.92 : undefined;
            
            return {
                dataUrl: capturedCanvas.toDataURL(mimeType, quality),
                filename: `${filename}.${format}`
            };
        } catch (error) {
            console.error('Capture failed:', error);
            return null;
        }
    }
    
    downloadImage(dataUrl, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
    }
    
    async exportSingleImage() {
        const keyword = document.getElementById('message-input')?.value || 'ad';
        const timestamp = Date.now();
        const filename = `${keyword}_${this.currentWidth}x${this.currentHeight}_${timestamp}`;
        
        this.showProgress(true);
        this.updateProgress(0, 1, '이미지 생성 중...');
        
        const result = await this.captureCanvas(filename);
        
        if (result) {
            this.downloadImage(result.dataUrl, result.filename);
            this.updateProgress(1, 1, '완료!');
        } else {
            this.updateProgress(0, 1, '실패');
        }
        
        setTimeout(() => this.showProgress(false), 1500);
    }
    
    async exportSizeSet() {
        const keyword = document.getElementById('message-input')?.value || 'ad';
        const timestamp = Date.now();
        
        const sizes = [
            { ratio: '1:1', width: 1080, height: 1080 },
            { ratio: '16:9', width: 1920, height: 1080 },
            { ratio: '9:16', width: 1080, height: 1920 }
        ];
        
        // Store original size
        const originalWidth = this.currentWidth;
        const originalHeight = this.currentHeight;
        const originalRatio = document.querySelector('#size-selector .size-card.active')?.dataset.size;
        
        this.showProgress(true);
        this.disableExportButtons(true);
        
        for (let i = 0; i < sizes.length; i++) {
            const size = sizes[i];
            this.updateProgress(i, sizes.length, `${size.ratio} 생성 중...`);
            
            // Apply size
            this.applyCanvasSize(size.width, size.height, size.ratio);
            
            // Wait for render
            await this.delay(500);
            
            // Capture
            const filename = `${keyword}_${size.ratio.replace(':', 'x')}_${timestamp}`;
            const result = await this.captureCanvas(filename);
            
            if (result) {
                this.downloadImage(result.dataUrl, result.filename);
            }
            
            // Small delay between downloads
            await this.delay(300);
        }
        
        // Restore original size
        this.applyCanvasSize(originalWidth, originalHeight, originalRatio || '1:1');
        
        // Update size card selection
        if (originalRatio) {
            document.querySelectorAll('#size-selector .size-card').forEach(c => {
                c.classList.toggle('active', c.dataset.size === originalRatio);
            });
        }
        
        this.updateProgress(sizes.length, sizes.length, '3장 다운로드 완료!');
        this.disableExportButtons(false);
        
        setTimeout(() => this.showProgress(false), 2000);
    }
    
    async exportAllVariants() {
        const keyword = document.getElementById('message-input')?.value || 'ad';
        const timestamp = Date.now();
        
        // Store original content
        const originalHeadline = document.getElementById('edit-headline')?.value || '';
        const originalSubtext = document.getElementById('edit-subtext')?.value || '';
        const originalCta = document.getElementById('edit-cta')?.value || '';
        const originalTags = document.getElementById('edit-tags')?.value || '';
        
        // Store original size
        const originalWidth = this.currentWidth;
        const originalHeight = this.currentHeight;
        const originalRatio = document.querySelector('#size-selector .size-card.active')?.dataset.size || '1:1';
        
        // Reset variant index to start from beginning
        const savedIndex = this.variantIndex;
        this.variantIndex = 0;
        this.lastKeyword = ''; // Force reset
        
        const variantCount = 5;
        const sizes = [
            { ratio: '1:1', width: 1080, height: 1080 },
            { ratio: '16:9', width: 1920, height: 1080 },
            { ratio: '9:16', width: 1080, height: 1920 }
        ];
        
        const totalCount = variantCount * sizes.length; // 15장
        let currentProgress = 0;
        
        this.showProgress(true);
        this.disableExportButtons(true);
        
        // Generate 5 variants first
        const variants = [];
        for (let i = 0; i < variantCount; i++) {
            const generatedContent = await this.generateAIContent(keyword);
            variants.push(generatedContent);
        }
        
        // Export each variant in each size
        for (let v = 0; v < variantCount; v++) {
            const content = variants[v];
            
            // Fill content editor with this variant
            this.fillContentEditor(content);
            
            for (let s = 0; s < sizes.length; s++) {
                const size = sizes[s];
                currentProgress++;
                
                this.updateProgress(currentProgress, totalCount, `변형 ${v + 1} / ${size.ratio} 생성 중...`);
                
                // Apply size
                this.applyCanvasSize(size.width, size.height, size.ratio);
                
                // Apply content to canvas
                this.applyContentToCanvas();
                
                // Wait for render
                await this.delay(400);
                
                // Capture
                const filename = `${keyword}_v${v + 1}_${size.ratio.replace(':', 'x')}_${timestamp}`;
                const result = await this.captureCanvas(filename);
                
                if (result) {
                    this.downloadImage(result.dataUrl, result.filename);
                }
                
                // Small delay between downloads
                await this.delay(200);
            }
        }
        
        // Restore original content
        const headlineEl = document.getElementById('edit-headline');
        const subtextEl = document.getElementById('edit-subtext');
        const ctaEl = document.getElementById('edit-cta');
        const tagsEl = document.getElementById('edit-tags');
        
        if (headlineEl) headlineEl.value = originalHeadline;
        if (subtextEl) subtextEl.value = originalSubtext;
        if (ctaEl) ctaEl.value = originalCta;
        if (tagsEl) tagsEl.value = originalTags;
        
        // Restore original size
        this.applyCanvasSize(originalWidth, originalHeight, originalRatio);
        
        // Update size card selection
        document.querySelectorAll('#size-selector .size-card').forEach(c => {
            c.classList.toggle('active', c.dataset.size === originalRatio);
        });
        
        // Restore variant index
        this.variantIndex = savedIndex;
        
        // Reapply original content
        this.applyContentToCanvas();
        
        this.updateProgress(totalCount, totalCount, '15장 다운로드 완료!');
        this.disableExportButtons(false);
        
        setTimeout(() => this.showProgress(false), 2000);
    }
    
    disableExportButtons(disabled) {
        const buttons = [
            'export-single-btn',
            'export-set-btn',
            'export-all-btn'
        ];
        
        buttons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.disabled = disabled;
            }
        });
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // ============================================
    // HISTORY MANAGEMENT
    // ============================================
    
    bindHistoryControls() {
        // Save work button
        document.getElementById('save-work-btn')?.addEventListener('click', () => {
            this.saveCurrentWork();
        });
        
        // Export selected button
        document.getElementById('export-selected-btn')?.addEventListener('click', () => {
            this.exportSelectedWorks();
        });
    }
    
    loadSavedWorks() {
        try {
            const saved = localStorage.getItem('savedWorks');
            this.savedWorks = saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.warn('Could not load saved works:', e);
            this.savedWorks = [];
        }
    }
    
    saveSavedWorks() {
        try {
            localStorage.setItem('savedWorks', JSON.stringify(this.savedWorks));
        } catch (e) {
            console.warn('Could not save works to storage:', e);
        }
    }
    
    async saveCurrentWork() {
        const saveBtn = document.getElementById('save-work-btn');
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<span>저장 중...</span>';
        }
        
        try {
            // Capture thumbnail
            const thumbnail = await this.captureCanvas(`thumb_${Date.now()}`);
            
            // Get current content
            const work = {
                id: Date.now(),
                thumbnail: thumbnail?.dataUrl || null,
                content: {
                    headline: document.getElementById('edit-headline')?.value || '',
                    subtext: document.getElementById('edit-subtext')?.value || '',
                    cta: document.getElementById('edit-cta')?.value || '',
                    tags: document.getElementById('edit-tags')?.value || ''
                },
                background: this.captureBackgroundState(),
                canvasSize: {
                    width: this.currentWidth,
                    height: this.currentHeight,
                    ratio: this.currentSize || '1:1'
                },
                createdAt: new Date().toISOString()
            };
            
            this.savedWorks.unshift(work);
            
            // Limit to 20 items
            if (this.savedWorks.length > 20) {
                this.savedWorks = this.savedWorks.slice(0, 20);
            }
            
            this.saveSavedWorks();
            this.renderHistoryGrid();
            
            // Show success feedback
            if (saveBtn) {
                saveBtn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span>저장됨!</span>
                `;
                setTimeout(() => {
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = `
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                            <polyline points="17 21 17 13 7 13 7 21"/>
                            <polyline points="7 3 7 8 15 8"/>
                        </svg>
                        <span>작업 저장</span>
                    `;
                }, 1500);
            }
        } catch (error) {
            console.error('Save failed:', error);
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <polyline points="17 21 17 13 7 13 7 21"/>
                        <polyline points="7 3 7 8 15 8"/>
                    </svg>
                    <span>작업 저장</span>
                `;
            }
        }
    }
    
    captureBackgroundState() {
        const bgState = window.editorState?.getBackground() || {};
        return {
            type: bgState.type || 'gradient',
            solidColor: bgState.solidColor,
            gradient: bgState.gradient,
            imageUrl: bgState.imageUrl,
            imageOverlay: bgState.imageOverlay,
            imageBlur: bgState.imageBlur
        };
    }
    
    renderHistoryGrid() {
        const grid = document.getElementById('history-grid');
        const empty = document.getElementById('history-empty');
        const countEl = document.getElementById('history-count');
        
        if (countEl) {
            countEl.textContent = this.savedWorks.length;
        }
        
        if (!grid) return;
        
        if (this.savedWorks.length === 0) {
            grid.style.display = 'none';
            if (empty) empty.style.display = 'flex';
            return;
        }
        
        grid.style.display = 'grid';
        if (empty) empty.style.display = 'none';
        
        grid.innerHTML = this.savedWorks.map(work => {
            const isSelected = this.selectedWorkIds.has(work.id);
            const time = new Date(work.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
            
            return `
                <div class="history-item ${isSelected ? 'selected' : ''}" data-id="${work.id}">
                    <img class="history-item-thumb" src="${work.thumbnail || ''}" alt="Saved work">
                    <div class="history-item-checkbox">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                    </div>
                    <button class="history-item-delete" data-delete-id="${work.id}">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                    <div class="history-item-info">${work.canvasSize.ratio} · ${time}</div>
                </div>
            `;
        }).join('');
        
        // Bind click events
        grid.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.closest('.history-item-delete')) return;
                
                const id = parseInt(item.dataset.id);
                this.toggleWorkSelection(id);
            });
        });
        
        // Bind delete events
        grid.querySelectorAll('.history-item-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.deleteId);
                this.deleteWork(id);
            });
        });
    }
    
    toggleWorkSelection(id) {
        if (this.selectedWorkIds.has(id)) {
            this.selectedWorkIds.delete(id);
        } else {
            this.selectedWorkIds.add(id);
        }
        
        this.renderHistoryGrid();
        this.updateSelectedCount();
    }
    
    updateSelectedCount() {
        const count = this.selectedWorkIds.size;
        const btn = document.getElementById('export-selected-btn');
        const countEl = document.getElementById('export-selected-count');
        const descEl = document.getElementById('export-selected-desc');
        
        if (countEl) countEl.textContent = count;
        if (btn) btn.disabled = count === 0;
        if (descEl) {
            descEl.textContent = count > 0 ? `${count}개 선택됨` : '히스토리에서 선택하세요';
        }
    }
    
    deleteWork(id) {
        this.savedWorks = this.savedWorks.filter(w => w.id !== id);
        this.selectedWorkIds.delete(id);
        this.saveSavedWorks();
        this.renderHistoryGrid();
        this.updateSelectedCount();
    }
    
    async exportSelectedWorks() {
        const selectedWorks = this.savedWorks.filter(w => this.selectedWorkIds.has(w.id));
        if (selectedWorks.length === 0) return;
        
        this.showProgress(true);
        this.disableExportButtons(true);
        
        for (let i = 0; i < selectedWorks.length; i++) {
            const work = selectedWorks[i];
            this.updateProgress(i + 1, selectedWorks.length, `${i + 1}/${selectedWorks.length} 다운로드 중...`);
            
            if (work.thumbnail) {
                const filename = `saved_${work.canvasSize.ratio.replace(':', 'x')}_${work.id}`;
                const { format } = this.getExportSettings();
                this.downloadImage(work.thumbnail, `${filename}.${format}`);
                await this.delay(300);
            }
        }
        
        this.updateProgress(selectedWorks.length, selectedWorks.length, '다운로드 완료!');
        this.disableExportButtons(false);
        
        setTimeout(() => this.showProgress(false), 1500);
    }
    
    // ============================================
    // SIZE SET MODAL
    // ============================================
    
    bindSizeSetModal() {
        // Open modal
        document.getElementById('export-set-preview-btn')?.addEventListener('click', () => {
            this.openSizeSetModal();
        });
        
        // Close modal
        document.getElementById('size-set-modal-close')?.addEventListener('click', () => {
            this.closeSizeSetModal();
        });
        
        // Close on backdrop click
        document.getElementById('size-set-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'size-set-modal') {
                this.closeSizeSetModal();
            }
        });
        
        // Download selected sizes
        document.getElementById('size-set-download-btn')?.addEventListener('click', () => {
            this.downloadSelectedSizes();
        });
    }
    
    async openSizeSetModal() {
        const modal = document.getElementById('size-set-modal');
        if (!modal) return;
        
        modal.style.display = 'flex';
        
        // Generate previews for each size
        const sizes = [
            { ratio: '1:1', width: 1080, height: 1080, previewId: 'size-preview-1x1' },
            { ratio: '16:9', width: 1920, height: 1080, previewId: 'size-preview-16x9' },
            { ratio: '9:16', width: 1080, height: 1920, previewId: 'size-preview-9x16' }
        ];
        
        // Store original size
        const originalWidth = this.currentWidth;
        const originalHeight = this.currentHeight;
        const originalRatio = this.currentSize || '1:1';
        
        for (const size of sizes) {
            const previewEl = document.getElementById(size.previewId);
            if (previewEl) {
                previewEl.innerHTML = '<div class="size-preview-loading">생성 중...</div>';
            }
            
            // Apply size
            this.applyCanvasSize(size.width, size.height, size.ratio);
            await this.delay(300);
            
            // Capture
            const result = await this.captureCanvas(`preview_${size.ratio}`);
            
            if (result && previewEl) {
                previewEl.innerHTML = `<img src="${result.dataUrl}" alt="${size.ratio}">`;
                this.sizeSetPreviews[size.ratio] = result.dataUrl;
            }
        }
        
        // Restore original size
        this.applyCanvasSize(originalWidth, originalHeight, originalRatio);
        
        // Update size card selection
        document.querySelectorAll('#size-selector .size-card').forEach(c => {
            c.classList.toggle('active', c.dataset.size === originalRatio);
        });
    }
    
    closeSizeSetModal() {
        const modal = document.getElementById('size-set-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    async downloadSelectedSizes() {
        const checkboxes = {
            '1:1': document.getElementById('size-check-1x1')?.checked,
            '16:9': document.getElementById('size-check-16x9')?.checked,
            '9:16': document.getElementById('size-check-9x16')?.checked
        };
        
        const keyword = document.getElementById('message-input')?.value || 'ad';
        const timestamp = Date.now();
        const { format } = this.getExportSettings();
        
        let downloadCount = 0;
        
        for (const [ratio, checked] of Object.entries(checkboxes)) {
            if (checked && this.sizeSetPreviews[ratio]) {
                const filename = `${keyword}_${ratio.replace(':', 'x')}_${timestamp}.${format}`;
                this.downloadImage(this.sizeSetPreviews[ratio], filename);
                downloadCount++;
                await this.delay(300);
            }
        }
        
        if (downloadCount > 0) {
            this.closeSizeSetModal();
        }
    }
    
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.figmaPanelController = new FigmaPanelController();
});
