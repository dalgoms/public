/**
 * 팀벨 공통 헤더/푸터 컴포넌트
 * 수정 시 이 파일만 수정하면 모든 페이지에 반영됩니다.
 */

// 현재 페이지의 깊이에 따른 상대 경로 계산
function getBasePath() {
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length;
    
    // 로컬 파일 시스템 또는 서브폴더 감지
    if (path.includes('/company/') || path.includes('/products/') || 
        path.includes('/solutions/') || path.includes('/stenography/') || 
        path.includes('/resources/')) {
        return '../';
    }
    return '';
}

// 헤더 HTML 생성
function getHeaderHTML(basePath) {
    return `
    <header class="header" id="header">
        <div class="header-inner">
            <a href="${basePath}index.html" class="logo">
                <img src="${basePath}img/timbellogo.png" alt="팀벨" class="logo-img">
            </a>
            <nav class="nav">
                <!-- 1. 회사소개 -->
                <div class="nav-item">
                    <a href="#" class="nav-link">
                        회사소개
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </a>
                    <div class="mega-menu">
                        <div class="mega-menu-inner">
                            <div class="mega-menu-left">
                                <div class="mega-menu-column">
                                    <div class="mega-menu-column-title">회사 정보</div>
                                    <a href="${basePath}company/overview.html" class="mega-menu-link">
                                        <strong>회사개요</strong>
                                        <span>팀벨의 핵심 사업과 기술 방향</span>
                                    </a>
                                    <a href="${basePath}company/business.html" class="mega-menu-link">
                                        <strong>사업 영역</strong>
                                        <span>AI 기반 솔루션, 자막, 미디어, 데이터</span>
                                    </a>
                                    <a href="${basePath}company/history.html" class="mega-menu-link">
                                        <strong>연혁</strong>
                                        <span>2001년 설립, 20년 이상의 기술 축적</span>
                                    </a>
                                </div>
                                <div class="mega-menu-column">
                                    <div class="mega-menu-column-title">인증 & 채용</div>
                                    <a href="${basePath}company/certifications.html" class="mega-menu-link">
                                        <strong>인증 및 특허</strong>
                                        <span>GS인증 1등급 · 기술 특허 다수 보유</span>
                                    </a>
                                    <a href="${basePath}company/careers.html" class="mega-menu-link">
                                        <strong>채용</strong>
                                        <span>AI 기술로 함께 성장할 인재를 찾습니다</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 2. 제품 -->
                <div class="nav-item">
                    <a href="#" class="nav-link">
                        제품
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </a>
                    <div class="mega-menu">
                        <div class="mega-menu-inner">
                            <div class="mega-menu-left five-cols">
                                <div class="mega-menu-column">
                                    <div class="mega-menu-column-title">인공지능</div>
                                    <a href="${basePath}products/ai-core.html" class="mega-menu-link">
                                        <strong>LLM · RAG 기반 지식 AI 플랫폼</strong>
                                        <span>데이터베이스 기반 지능형 AI 에이전트</span>
                                    </a>
                                    <a href="${basePath}products/speech-language.html" class="mega-menu-link">
                                        <strong>음성인식 · 음성합성 AI 솔루션</strong>
                                        <span>3rd Party AI 연계 음성인식 및 합성 기술</span>
                                    </a>
                                    <a href="${basePath}products/llm-platform.html" class="mega-menu-link">
                                        <strong>초거대 언어모델 구축 플랫폼</strong>
                                        <span>정확하고 일관된 고품질 데이터 확보</span>
                                    </a>
                                    <a href="${basePath}products/sign-avatar.html" class="mega-menu-link">
                                        <strong>AI 메타휴먼 수어 아바타</strong>
                                        <span>접근성 향상 AI 수어 서비스 리나&바로</span>
                                    </a>
                                </div>
                                <div class="mega-menu-column">
                                    <div class="mega-menu-column-title">AICC 솔루션</div>
                                    <a href="${basePath}solutions/knowledge-management.html" class="mega-menu-link">
                                        <strong>차세대 문서 및 지식 관리 솔루션</strong>
                                        <span>계층형 플랜 에이전트 워크플로우</span>
                                    </a>
                                    <a href="${basePath}solutions/aicc-platform.html" class="mega-menu-link">
                                        <strong>AI 기반 컨택센터 통합 운영 플랫폼</strong>
                                        <span>AI 기능을 하나의 플랫폼으로 결합</span>
                                    </a>
                                    <a href="${basePath}solutions/callbot-chatbot.html" class="mega-menu-link">
                                        <strong>AI 상담·콜봇 및 챗봇 솔루션</strong>
                                        <span>24시간 자동 응대 기능</span>
                                    </a>
                                    <a href="${basePath}solutions/advisor-ta-qa.html" class="mega-menu-link">
                                        <strong>AI 상담·어드바이저 지원 시스템</strong>
                                        <span>실시간 상담 분석과 품질 제공</span>
                                    </a>
                                    <a href="${basePath}solutions/ivr-integration.html" class="mega-menu-link">
                                        <strong>AI IVR 연동 및 전화 시스템 통합</strong>
                                        <span>AI 상담 서비스 흐름 확장 지원</span>
                                    </a>
                                </div>
                                <div class="mega-menu-column">
                                    <div class="mega-menu-column-title">지능형 AI 회의록</div>
                                    <a href="${basePath}products/baronote.html" class="mega-menu-link">
                                        <strong>AI 기반 상담 녹취 회의록 솔루션</strong>
                                        <span>바로노트</span>
                                    </a>
                                    <a href="${basePath}products/timblo.html" class="mega-menu-link">
                                        <strong>화자분리 결합 지능형 AI 회의록</strong>
                                        <span>팀블로</span>
                                    </a>
                                </div>
                                <div class="mega-menu-column">
                                    <div class="mega-menu-column-title">AI 기록·자막</div>
                                    <a href="${basePath}stenography/soribaro.html" class="mega-menu-link">
                                        <strong>SORIBARO</strong>
                                        <span>AI 기반 녹취, 회의록, VOD 자막</span>
                                    </a>
                                    <a href="${basePath}stenography/textar.html" class="mega-menu-link">
                                        <strong>TEXTAR</strong>
                                        <span>AI 기반 자막·번역·실시간 문자 통역</span>
                                    </a>
                                    <a href="${basePath}stenography/sorizava.html" class="mega-menu-link">
                                        <strong>SORIZAVA</strong>
                                        <span>대한민국 대표 NO.1 AI 속기키보드</span>
                                    </a>
                                    <a href="${basePath}stenography/webfos.html" class="mega-menu-link">
                                        <strong>WEBFOS</strong>
                                        <span>전세계 어디서나 실시간 자막 송출</span>
                                    </a>
                                </div>
                                <div class="mega-menu-column">
                                    <div class="mega-menu-column-title">AI 미디어·교육·일자리</div>
                                    <a href="${basePath}products/clipdesk.html" class="mega-menu-link">
                                        <strong>CLIPDESK</strong>
                                        <span>기록전문가 기반 지능형 영상편집</span>
                                    </a>
                                    <a href="${basePath}products/worksfy.html" class="mega-menu-link">
                                        <strong>WORKSFY</strong>
                                        <span>AI 속기사 일자리 플랫폼</span>
                                    </a>
                                    <a href="${basePath}products/sorizava-academy.html" class="mega-menu-link">
                                        <strong>SORIZAVA ACADEMY</strong>
                                        <span>AI 속기사 양성 온라인 교육 기관</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 3. 자료 센터 -->
                <div class="nav-item">
                    <a href="#" class="nav-link">
                        자료 센터
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </a>
                    <div class="mega-menu">
                        <div class="mega-menu-inner">
                            <div class="mega-menu-left">
                                <div class="mega-menu-column">
                                    <div class="mega-menu-column-title">콘텐츠 허브</div>
                                    <a href="${basePath}resources/case-studies.html" class="mega-menu-link">
                                        <strong>고객 사례</strong>
                                        <span>도입 성공 사례 모음</span>
                                    </a>
                                    <a href="${basePath}resources/news.html" class="mega-menu-link">
                                        <strong>최신 소식</strong>
                                        <span>팀벨 뉴스 및 공지</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 4. 문의하기 -->
                <div class="nav-item">
                    <a href="${basePath}contact.html" class="nav-link">문의하기</a>
                </div>
            </nav>

            <div class="header-actions">
                <a href="${basePath}contact.html" class="btn btn-primary">도입 상담</a>
            </div>

            <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="메뉴 열기">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </header>

    <!-- Mobile Menu -->
    <div class="mobile-menu-overlay" id="mobileMenuOverlay">
        <div class="mobile-menu-container">
            <div class="mobile-menu-header">
                <a href="${basePath}index.html" class="logo">
                    <img src="${basePath}img/timbellogo.png" alt="팀벨" class="logo-img">
                </a>
                <button class="mobile-menu-close" id="mobileMenuClose" aria-label="메뉴 닫기">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <nav class="mobile-nav">
                <div class="mobile-nav-item">
                    <button class="mobile-nav-link" data-submenu="company">
                        회사소개
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                    <div class="mobile-submenu" id="submenu-company">
                        <a href="${basePath}company/overview.html">회사개요</a>
                        <a href="${basePath}company/business.html">사업 영역</a>
                        <a href="${basePath}company/history.html">연혁</a>
                        <a href="${basePath}company/certifications.html">인증 및 특허</a>
                        <a href="${basePath}company/careers.html">채용</a>
                    </div>
                </div>
                <div class="mobile-nav-item">
                    <button class="mobile-nav-link" data-submenu="products">
                        제품
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                    <div class="mobile-submenu" id="submenu-products">
                        <span class="mobile-submenu-title">인공지능</span>
                        <a href="${basePath}products/ai-core.html">LLM · RAG 기반 지식 AI 플랫폼</a>
                        <a href="${basePath}products/speech-language.html">음성인식 · 음성합성 AI 솔루션</a>
                        <a href="${basePath}products/llm-platform.html">초거대 언어모델 구축 플랫폼</a>
                        <a href="${basePath}products/sign-avatar.html">AI 메타휴먼 수어 아바타</a>
                        <span class="mobile-submenu-title">AICC 솔루션</span>
                        <a href="${basePath}solutions/knowledge-management.html">차세대 문서 및 지식 관리</a>
                        <a href="${basePath}solutions/aicc-platform.html">AI 기반 컨택센터 통합 플랫폼</a>
                        <a href="${basePath}solutions/callbot-chatbot.html">AI 콜봇 및 챗봇</a>
                        <a href="${basePath}solutions/advisor-ta-qa.html">AI 상담 어드바이저</a>
                        <a href="${basePath}solutions/ivr-integration.html">AI IVR 연동</a>
                        <span class="mobile-submenu-title">지능형 AI 회의록</span>
                        <a href="${basePath}products/baronote.html">바로노트</a>
                        <a href="${basePath}products/timblo.html">팀블로</a>
                        <span class="mobile-submenu-title">AI 기록·자막</span>
                        <a href="${basePath}stenography/soribaro.html">SORIBARO</a>
                        <a href="${basePath}stenography/textar.html">TEXTAR</a>
                        <a href="${basePath}stenography/sorizava.html">SORIZAVA</a>
                        <a href="${basePath}stenography/webfos.html">WEBFOS</a>
                        <span class="mobile-submenu-title">AI 미디어·교육·일자리</span>
                        <a href="${basePath}products/clipdesk.html">CLIPDESK</a>
                        <a href="${basePath}products/worksfy.html">WORKSFY</a>
                        <a href="${basePath}products/sorizava-academy.html">SORIZAVA ACADEMY</a>
                    </div>
                </div>
                <div class="mobile-nav-item">
                    <button class="mobile-nav-link" data-submenu="resources">
                        자료 센터
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                    <div class="mobile-submenu" id="submenu-resources">
                        <a href="${basePath}resources/case-studies.html">고객 사례</a>
                        <a href="${basePath}resources/news.html">최신 소식</a>
                    </div>
                </div>
                <div class="mobile-nav-item">
                    <a href="${basePath}contact.html" class="mobile-nav-link mobile-nav-link-direct">문의하기</a>
                </div>
            </nav>
            <div class="mobile-menu-cta">
                <a href="${basePath}contact.html" class="btn btn-primary">도입 상담 신청</a>
            </div>
        </div>
    </div>`;
}

// 푸터 HTML 생성
function getFooterHTML(basePath) {
    return `
    <footer class="footer">
        <div class="footer-inner">
            <div class="footer-top">
                <div class="footer-brand">
                    <img src="${basePath}img/timbellogo.png" alt="TIMBEL" class="footer-logo">
                    <p class="footer-tagline">AI 기술을 실제 운영 가능한<br>솔루션으로 제공합니다.</p>
                </div>
                <div class="footer-nav">
                    <div class="footer-column">
                        <h4>제품</h4>
                        <div class="footer-links">
                            <a href="${basePath}products/ai-core.html">AI CORE 플랫폼</a>
                            <a href="${basePath}products/speech-language.html">음성인식/음성합성</a>
                            <a href="${basePath}solutions/aicc-platform.html">AICC 플랫폼</a>
                            <a href="${basePath}products/baronote.html">AI 회의록</a>
                        </div>
                    </div>
                    <div class="footer-column">
                        <h4>회사소개</h4>
                        <div class="footer-links">
                            <a href="${basePath}company/overview.html">회사개요</a>
                            <a href="${basePath}company/business.html">사업 영역</a>
                            <a href="${basePath}company/history.html">연혁</a>
                            <a href="${basePath}company/certifications.html">인증 및 특허</a>
                            <a href="${basePath}company/careers.html">채용</a>
                        </div>
                    </div>
                    <div class="footer-column">
                        <h4>자료 센터</h4>
                        <div class="footer-links">
                            <a href="${basePath}resources/case-studies.html">고객 사례</a>
                            <a href="${basePath}resources/news.html">최신 소식</a>
                        </div>
                    </div>
                    <div class="footer-column">
                        <h4>문의</h4>
                        <div class="footer-links">
                            <a href="${basePath}contact.html">도입 상담</a>
                            <a href="${basePath}contact.html">기술 문의</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <div class="footer-info-row">
                    <span class="footer-company-name">(주) TIMBEL</span>
                    <span class="footer-divider">|</span>
                    <span>대표이사: 윤종후</span>
                    <span class="footer-divider">|</span>
                    <span>사업자등록번호: 206-81-58545</span>
                    <span class="footer-divider">|</span>
                    <span>서울 강남구 강남대로94길 66 산돌빌딩 3층</span>
                </div>
                <div class="footer-info-row">
                    <span>Tel: 02-561-8182</span>
                    <span class="footer-divider">|</span>
                    <span>Email: <a href="mailto:sales@timbel.net">sales@timbel.net</a></span>
                </div>
                <div class="footer-legal-row">
                    <span class="footer-copyright">© 2026 Timbel Co.,Ltd. All Rights Reserved.</span>
                    <div class="footer-legal">
                        <a href="#">개인정보 처리방침</a>
                        <a href="#">이용약관</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>`;
}

// 공통 스타일 (헤더/푸터용)
function getCommonStyles() {
    return `
    <style id="common-styles">
        /* Header */
        .header { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: #000000; transition: all 0.3s ease; }
        .header.scrolled { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); }
        .header-inner { max-width: 1600px; margin: 0 auto; padding: 0 60px; height: 80px; display: flex; align-items: center; justify-content: space-between; gap: 40px; }
        .logo { display: flex; align-items: center; text-decoration: none; }
        .logo-img { height: 32px; filter: brightness(0) invert(1); }
        
        /* Navigation */
        .nav { display: flex; align-items: center; gap: 4px; }
        .nav-item { position: relative; }
        .nav-link { display: flex; align-items: center; gap: 6px; padding: 12px 24px; font-size: 17px; font-weight: 500; color: rgba(255,255,255,0.85); text-decoration: none; transition: all 0.2s; cursor: pointer; white-space: nowrap; position: relative; }
        .nav-link:hover { color: #fff; }
        .nav-link svg { width: 16px; height: 16px; color: rgba(255,255,255,0.5); transition: transform 0.2s; }
        .nav-item:hover .nav-link svg { transform: rotate(180deg); color: var(--primary-light, #6AABFF); }
        .nav-item:hover .nav-link { color: #fff; }
        .nav-item:hover .nav-link::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--primary, #4593FC); }

        /* Mega Menu */
        .mega-menu { position: fixed; top: 80px; left: 0; right: 0; background: var(--white, #fff); box-shadow: 0 20px 60px -12px rgba(0,0,0,0.2); padding: 60px 0; opacity: 0; visibility: hidden; transition: all 0.3s; z-index: 100; }
        .nav-item:hover .mega-menu { opacity: 1; visibility: visible; }
        .mega-menu-inner { max-width: 1600px; margin: 0 auto; padding: 0 80px; }
        .mega-menu-left { display: flex; gap: 32px; }
        .mega-menu-left.five-cols { display: flex; gap: 24px; }
        .mega-menu-column { min-width: 180px; flex: 1; max-width: 260px; }
        .mega-menu-column-title { font-size: 14px; font-weight: 700; color: var(--primary, #4593FC); margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid var(--primary, #4593FC); }
        .mega-menu-link { display: block; padding: 12px 0; text-decoration: none; border-bottom: 1px solid var(--gray-200, #F2F4F6); transition: all 0.2s; }
        .mega-menu-link:last-child { border-bottom: none; }
        .mega-menu-link:hover { padding-left: 8px; }
        .mega-menu-link:hover strong { color: var(--primary, #4593FC); }
        .mega-menu-link strong { display: block; font-size: 14px; font-weight: 600; color: var(--dark, #191F28); margin-bottom: 3px; transition: color 0.2s; }
        .mega-menu-link span { font-size: 12px; color: var(--gray-600, #8B95A1); line-height: 1.4; }

        /* Header Actions */
        .header-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .header .btn-primary { background: var(--white, #fff); color: #000; box-shadow: none; padding: 12px 28px; border-radius: 6px; font-size: 15px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; }
        .header .btn-primary:hover { background: var(--primary, #4593FC); color: #fff; }

        /* Mobile Menu Button */
        .mobile-menu-btn { display: none; background: none; border: none; padding: 8px; cursor: pointer; z-index: 1001; }
        .mobile-menu-btn span { display: block; width: 24px; height: 2px; background: var(--white, #fff); margin: 5px 0; border-radius: 2px; transition: all 0.3s; }
        .mobile-menu-btn.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .mobile-menu-btn.active span:nth-child(2) { opacity: 0; }
        .mobile-menu-btn.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

        /* Mobile Menu Overlay */
        .mobile-menu-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: #000; z-index: 999; opacity: 0; visibility: hidden; transition: all 0.3s; overflow-y: auto; }
        .mobile-menu-overlay.active { opacity: 1; visibility: visible; }
        .mobile-menu-container { min-height: 100vh; display: flex; flex-direction: column; padding: 0 16px 32px; }
        .mobile-menu-header { display: flex; justify-content: space-between; align-items: center; height: 60px; }
        .mobile-menu-close { background: none; border: none; padding: 8px; cursor: pointer; color: var(--white, #fff); }
        .mobile-nav { flex: 1; padding: 24px 0; }
        .mobile-nav-item { border-bottom: 1px solid rgba(255,255,255,0.1); }
        .mobile-nav-link { display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 16px 0; font-size: 18px; font-weight: 600; color: var(--white, #fff); background: none; border: none; text-align: left; cursor: pointer; text-decoration: none; }
        .mobile-nav-link svg { transition: transform 0.3s; }
        .mobile-nav-link.active svg { transform: rotate(90deg); }
        .mobile-submenu { display: none; padding: 0 0 16px 16px; }
        .mobile-submenu.active { display: block; }
        .mobile-submenu a { display: block; padding: 10px 0; font-size: 15px; color: rgba(255,255,255,0.7); text-decoration: none; }
        .mobile-submenu a:hover { color: var(--white, #fff); }
        .mobile-submenu-title { display: block; padding: 12px 0 6px; font-size: 12px; font-weight: 700; color: var(--primary, #4593FC); text-transform: uppercase; letter-spacing: 1px; }
        .mobile-menu-cta { padding: 24px 0 0; border-top: 1px solid rgba(255,255,255,0.1); }
        .mobile-menu-cta .btn { width: 100%; justify-content: center; padding: 16px; font-size: 16px; font-weight: 600; background: linear-gradient(135deg, var(--primary, #4593FC) 0%, var(--primary-dark, #2B7DE9) 100%); color: #fff; border-radius: 12px; text-decoration: none; display: flex; align-items: center; }

        /* Footer */
        .footer { background: var(--dark, #191F28); color: var(--gray-400, #D1D6DB); padding: 60px 24px 40px; }
        .footer-inner { max-width: 1200px; margin: 0 auto; }
        .footer-top { display: flex; justify-content: space-between; gap: 60px; margin-bottom: 48px; }
        .footer-brand { flex-shrink: 0; max-width: 220px; }
        .footer-logo { height: 28px; filter: brightness(0) invert(1); }
        .footer-tagline { font-size: 14px; line-height: 1.7; margin-top: 16px; }
        .footer-nav { display: flex; gap: 48px; flex-wrap: wrap; }
        .footer-column h4 { font-size: 14px; font-weight: 700; color: var(--white, #fff); margin-bottom: 20px; }
        .footer-links { display: flex; flex-direction: column; gap: 12px; }
        .footer-links a { font-size: 13px; color: var(--gray-400, #D1D6DB); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--white, #fff); }
        .footer-bottom { padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: rgba(255,255,255,0.5); }
        .footer-info-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 8px; }
        .footer-company-name { font-weight: 600; color: rgba(255,255,255,0.7); }
        .footer-divider { color: rgba(255,255,255,0.2); }
        .footer-info-row a { color: rgba(255,255,255,0.5); }
        .footer-legal-row { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.05); }
        .footer-legal { display: flex; gap: 24px; }
        .footer-legal a { color: rgba(255,255,255,0.5); text-decoration: none; font-size: 12px; }
        .footer-legal a:hover { color: var(--white, #fff); }

        /* Responsive */
        @media (max-width: 1200px) {
            .header-inner { padding: 0 40px; }
            .mega-menu-left.five-cols { flex-wrap: wrap; }
            .mega-menu-column { min-width: 200px; }
        }
        @media (max-width: 1024px) {
            .nav { display: none; }
            .header-actions { display: none; }
            .mobile-menu-btn { display: block; }
            .header-inner { padding: 0 24px; height: 70px; }
            .footer-top { flex-direction: column; gap: 48px; }
            .footer-brand { max-width: 100%; text-align: center; }
            .footer-logo { margin: 0 auto; }
            .footer-tagline { text-align: center; }
            .footer-nav { justify-content: center; gap: 40px; }
        }
        @media (max-width: 768px) {
            .header-inner { padding: 0 16px; height: 60px; }
            .logo-img { height: 28px; }
            .footer { padding: 48px 16px 32px; }
            .footer-nav { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; width: 100%; }
            .footer-column { text-align: center; }
            .footer-links { align-items: center; }
            .footer-bottom { text-align: center; }
            .footer-info-row { justify-content: center; flex-direction: column; gap: 4px; }
            .footer-divider { display: none; }
            .footer-legal-row { flex-direction: column; align-items: center; gap: 16px; }
        }
    </style>`;
}

// 이벤트 리스너 초기화
function initCommonEvents() {
    // Header scroll effect
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');

    function openMobileMenu() {
        if (mobileMenuBtn) mobileMenuBtn.classList.add('active');
        if (mobileMenuOverlay) mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
        if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            if (mobileMenuOverlay && mobileMenuOverlay.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    // Mobile Submenu Toggle
    document.querySelectorAll('.mobile-nav-link[data-submenu]').forEach(btn => {
        btn.addEventListener('click', function() {
            const submenuId = this.getAttribute('data-submenu');
            const submenu = document.getElementById('submenu-' + submenuId);
            if (submenu) {
                this.classList.toggle('active');
                submenu.classList.toggle('active');
            }
        });
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-submenu a, .mobile-nav-link-direct').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenuOverlay && mobileMenuOverlay.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close mobile menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024 && mobileMenuOverlay && mobileMenuOverlay.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// 헤더/푸터 렌더링
function renderCommon() {
    const basePath = getBasePath();
    
    // 공통 스타일 추가 (중복 방지)
    if (!document.getElementById('common-styles')) {
        document.head.insertAdjacentHTML('beforeend', getCommonStyles());
    }
    
    // 헤더 렌더링
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        headerPlaceholder.outerHTML = getHeaderHTML(basePath);
    }
    
    // 푸터 렌더링
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.outerHTML = getFooterHTML(basePath);
    }
    
    // 이벤트 초기화
    initCommonEvents();
}

// DOM 로드 시 실행
document.addEventListener('DOMContentLoaded', renderCommon);
