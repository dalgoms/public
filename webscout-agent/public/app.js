// Single source of truth for i18n
const TEXTS = {
  ko: {
    heroTitle: 'WebScout Agent', heroSubtitle: 'AI 웹에이전트가 자동으로 발견하고 분석하는 웹사이트 인텔리전스 플랫폼',
    heroFlow: ['발견', '정규화', '구조화', '내보내기'],
    placeholder: '예: https://webscout.demo (링크를 입력해주세요)', btnCollect: 'URL 수집', btnDemo: '데모 사이트 사용', btnCollecting: '수집 중…',
    emptyTitle: '웹사이트를 탐색할 준비가 되셨나요?', emptyText: '도메인을 붙여넣으면 WebScout Agent가 모든 페이지를 자동으로 매핑합니다.',
    toastLinkRequired: '링크를 입력해주세요', toastCollected: 'URL 수집 완료', toastCopied: '클립보드에 복사됨', toastCopyFailed: '복사 실패',
    toastNoUrlsSelected: '선택된 URL이 없습니다', toastNoUrlsToExport: '내보낼 URL이 없습니다',
    toastUrlsDownloaded: (n) => `${n}개 URL 다운로드됨`, toastCollectedCount: (n) => `${n}개 URL 수집 완료`,
    toastDiscoveryError: '탐색 오류가 발생했습니다', toastStreamParseError: '스트림 데이터 오류', toastCollectCancelled: '수집이 취소되었습니다', toastQaComplete: 'QA 검사 완료', toastCollectFirst: '먼저 URL을 수집해주세요', inputHelperText: '웹사이트 링크를 입력해주세요.', noUrlsToSelect: '선택할 URL이 없습니다', cancelCollect: '취소', ariaCancelCollect: '수집 취소',
    selectionInfo: (n) => `${n}개 URL 선택됨`, searchResults: (n) => `${n}개 결과`, moreItems: (n) => `+ ${n}개 더…`,
    linkRequired: '링크를 입력해주세요', collecting: '수집 중…', collected: 'URL 수집 완료',
    progressDiscovering: '사이트맵 탐색 중…', progressCrawling: '내부 링크 크롤링 중…', discoveryFailed: '탐색 실패',
    sitemap: '사이트맵', crawl: '크롤링',
    insights: '인사이트', generating: '생성 중…', siteSummary: '사이트 요약', funnelGuess: '퍼널 추정', aiSummary: 'AI 요약',
    missingElements: '누락된 요소', topRecommendations: '상위 제안', contentStrategyIdeas: '콘텐츠 전략 아이디어',
    recommendedPages: '추천 페이지', landingPageFeedback: '랜딩 페이지 피드백', qaStatus: 'QA 상태',
    generateContentStrategy: '콘텐츠 전략 생성', analyzeLandingPages: '랜딩 페이지 분석', runQACheck: 'QA 체크 실행',
    checking: '검사 중…', healthy: '양호', reviewNeeded: '검토 필요', pagesNeedingReview: '검토가 필요한 페이지',
    qaIssueQuery: '쿼리 파라미터 있음', qaIssueDeepPath: (n) => `깊은 경로 (${n}단계)`, qaIssueLongUrl: '긴 URL', qaIssueInvalidUrl: '잘못된 URL 형식',
    noRecommendations: '추천 항목이 없습니다.', recommendation: '권장사항:',
    kpiTitle: '마지막 실행 결과:', kpiTotalUrls: '총 URL 수', kpiSource: '소스', kpiMaxDepth: '최대 깊이', kpiExcluded: '제외됨',
    filterDepth: '깊이', filterMaxUrls: '최대 URL', filterQueryStrip: '쿼리 제거', filterWww: 'www/non-www', filterExclude: '제외 경로', filterExcludePlaceholder: '/admin,/api',
    tabAiInsights: 'AI 인사이트', tabSitemapView: '사이트맵 뷰', tabPageTypes: '페이지 유형', tabFigmaReady: 'Figma 준비', tabImportance: '중요도',
    strategistFunnelHealth: '퍼널 헬스', strategistDesignDebt: '디자인 부채', strategistContentCoverage: '콘텐츠 커버리지', strategistConversionReadiness: '전환 준비도',
    urlList: 'URL 목록', autoSelectDesign: '디자인 페이지 자동 선택', selectAll: '전체 선택', clear: '지우기', urlsTxt: 'urls.txt', urlsCsv: 'urls.csv',
    searchUrls: 'URL 검색…', pathDepth: '경로 깊이', query: '쿼리', external: '외부', selectAllUrls: '전체 선택', ariaLabelSelect: '선택', ariaLabelCopy: '복사', copyToClipboard: '클립보드에 복사',
    previous: '이전', next: '다음', retry: '재시도', figmaReady: '준비됨', figmaPartial: '부분적', figmaNeedsWork: '개선 필요',
    ariaThemeToggle: '테마 전환', ariaLangToggle: '언어 전환', ariaToastClose: '닫기',
    ariaLabelUrlList: 'URL 목록', ariaLabelInsights: '웹사이트 인사이트', ariaLabelDiscoveredUrls: '발견된 URL',
    ariaLabelDepth: '깊이', ariaLabelMaxUrls: '최대 URL 수', ariaLabelStripQuery: '쿼리 제거', ariaLabelWww: 'www/non-www 별칭', ariaLabelExclude: '제외 경로',
    pagesSuffix: ' 페이지', pageCount: (n) => n === 1 ? '1 페이지' : `${n} 페이지`, skipToContent: '본문으로 건너뛰기',
    emptyTabHint: 'URL을 수집하면 여기에 표시됩니다.', yes: '예',
    contentStrategySuccess: '콘텐츠 전략 생성 완료', contentStrategyError: '콘텐츠 전략 생성 실패: ',
    landingSuccess: '랜딩 페이지 분석 완료', landingError: '랜딩 페이지 분석 실패: ', analyzing: '분석 중…',
  },
  en: {
    heroTitle: 'WebScout Agent', heroSubtitle: 'AI web agent that automatically discovers and analyzes websites',
    heroFlow: ['Discover', 'Normalize', 'Structure', 'Export'],
    placeholder: 'e.g., https://webscout.demo (Enter a link)', btnCollect: 'Collect URLs', btnDemo: 'Use Demo Site', btnCollecting: 'Collecting…',
    emptyTitle: 'Ready to scout your website?', emptyText: 'Paste any domain and WebScout Agent will map every page automatically.',
    toastLinkRequired: 'Please enter a link', toastCollected: 'URLs collected', toastCopied: 'Copied to clipboard', toastCopyFailed: 'Copy failed',
    toastNoUrlsSelected: 'No URLs selected', toastNoUrlsToExport: 'No URLs to export',
    toastUrlsDownloaded: (n) => `${n} URLs downloaded`, toastCollectedCount: (n) => `${n} URL${n === 1 ? '' : 's'} collected`,
    toastDiscoveryError: 'Discovery error occurred', toastStreamParseError: 'Stream data error', toastCollectCancelled: 'Collection cancelled', toastQaComplete: 'QA check complete', toastCollectFirst: 'Please collect URLs first', inputHelperText: 'Please enter a website link.', noUrlsToSelect: 'No URLs to select', cancelCollect: 'Cancel', ariaCancelCollect: 'Cancel collection',
    selectionInfo: (n) => `${n} URL${n === 1 ? '' : 's'} selected`, searchResults: (n) => `${n} results`, moreItems: (n) => `+ ${n} more...`,
    linkRequired: 'Please enter a link', collecting: 'Collecting…', collected: 'URLs collected',
    progressDiscovering: 'Discovering sitemap…', progressCrawling: 'Crawling internal links…', discoveryFailed: 'Discovery failed',
    sitemap: 'Sitemap', crawl: 'Crawl',
    insights: 'Insights', generating: 'Generating...', siteSummary: 'Site Summary', funnelGuess: 'Funnel Guess', aiSummary: 'AI Summary',
    missingElements: 'Missing Elements', topRecommendations: 'Top Recommendations', contentStrategyIdeas: 'Content Strategy Ideas',
    recommendedPages: 'Recommended Pages', landingPageFeedback: 'Landing Page Feedback', qaStatus: 'QA Status',
    generateContentStrategy: 'Generate Content Strategy', analyzeLandingPages: 'Analyze Landing Pages', runQACheck: 'Run QA Check',
    checking: 'Checking...', healthy: 'Healthy', reviewNeeded: 'Review Needed', pagesNeedingReview: 'Pages Needing Review',
    qaIssueQuery: 'Has query parameters', qaIssueDeepPath: (n) => `Deep path (${n} levels)`, qaIssueLongUrl: 'Long URL', qaIssueInvalidUrl: 'Invalid URL format',
    noRecommendations: 'No recommendations available.', recommendation: 'Recommendation:',
    kpiTitle: 'Last run results:', kpiTotalUrls: 'Total URLs', kpiSource: 'Source', kpiMaxDepth: 'Max Depth', kpiExcluded: 'Excluded',
    filterDepth: 'Depth', filterMaxUrls: 'Max URLs', filterQueryStrip: 'Query Strip', filterWww: 'www/non-www', filterExclude: 'Exclude', filterExcludePlaceholder: '/admin,/api',
    tabAiInsights: 'AI Insights', tabSitemapView: 'Sitemap View', tabPageTypes: 'Page Types', tabFigmaReady: 'Figma Ready', tabImportance: 'Importance',
    strategistFunnelHealth: 'Funnel Health', strategistDesignDebt: 'Design Debt', strategistContentCoverage: 'Content Coverage', strategistConversionReadiness: 'Conversion Readiness',
    urlList: 'URL List', autoSelectDesign: 'Auto-select Design Pages', selectAll: 'Select All', clear: 'Clear', urlsTxt: 'urls.txt', urlsCsv: 'urls.csv',
    searchUrls: 'Search URLs…', pathDepth: 'Path Depth', query: 'Query', external: 'External', selectAllUrls: 'Select all URLs', ariaLabelSelect: 'Select', ariaLabelCopy: 'Copy', copyToClipboard: 'Copy to clipboard',
    previous: 'Previous', next: 'Next', retry: 'Retry', figmaReady: 'Ready', figmaPartial: 'Partial', figmaNeedsWork: 'Needs Work',
    ariaThemeToggle: 'Toggle theme', ariaLangToggle: 'Toggle language', ariaToastClose: 'Close',
    ariaLabelUrlList: 'URL List', ariaLabelInsights: 'Website Insights', ariaLabelDiscoveredUrls: 'Discovered URLs',
    ariaLabelDepth: 'Depth', ariaLabelMaxUrls: 'Max URLs', ariaLabelStripQuery: 'Strip query', ariaLabelWww: 'www/non-www alias', ariaLabelExclude: 'Exclude paths',
    pagesSuffix: ' Pages', pageCount: (n) => `${n} page${n === 1 ? '' : 's'}`, skipToContent: 'Skip to main content',
    emptyTabHint: 'Content will appear here after collecting URLs.', yes: 'Yes',
    contentStrategySuccess: 'Content strategy generated', contentStrategyError: 'Failed to generate content strategy: ',
    landingSuccess: 'Landing page analysis complete', landingError: 'Failed to analyze landing pages: ', analyzing: 'Analyzing...',
  }
};

function t(key, ...args) {
  const lang = window.currentLang || 'ko';
  const val = (TEXTS[lang] || TEXTS.en)[key];
  if (val === undefined) return key;
  return typeof val === 'function' ? val(...args) : val;
}

// Theme & Language Management
const themeToggle = document.getElementById("themeToggle");
const themeIconLight = document.getElementById("themeIconLight");
const themeIconDark = document.getElementById("themeIconDark");
const langToggle = document.getElementById("langToggle");
const langText = document.getElementById("langText");

// Load saved preferences
const savedTheme = localStorage.getItem('theme') || 'light';
const savedLang = localStorage.getItem('language') || 'ko';

// Apply theme
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  if (theme === 'dark') {
    themeIconLight.style.display = 'none';
    themeIconDark.style.display = 'inline-block';
  } else {
    themeIconLight.style.display = 'inline-block';
    themeIconDark.style.display = 'none';
  }
}

// Apply language
function applyLanguage(lang) {
  document.documentElement.setAttribute('lang', lang);
  localStorage.setItem('language', lang);
  
  if (lang === 'en') {
    langText.textContent = 'EN';
    updateUITexts('en');
  } else {
    langText.textContent = '한글';
    updateUITexts('ko');
  }
}

// Update UI texts based on language
function updateUITexts(lang) {
  window.currentLang = lang;
  const tx = TEXTS[lang] || TEXTS.en;

  // Update key UI elements
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroFlow = document.querySelectorAll('.hero-flow span');
  const baseInput = document.getElementById('base');
  const btnStartText = document.getElementById('btnStartText');
  const btnDemoEl = document.getElementById('btnDemo');
  const emptyStateTitle = document.querySelector('.empty-state-title');
  const emptyStateText = document.querySelector('.empty-state-text');
  const insightsTitle = document.querySelector('.insights-title');
  if (heroTitle) heroTitle.textContent = tx.heroTitle;
  if (heroSubtitle) heroSubtitle.textContent = tx.heroSubtitle;
  if (baseInput) baseInput.placeholder = tx.placeholder;
  if (btnStartText && btnStartText.textContent !== tx.btnCollecting) btnStartText.textContent = tx.btnCollect;
  if (btnDemoEl) btnDemoEl.textContent = tx.btnDemo;
  if (emptyStateTitle) emptyStateTitle.textContent = tx.emptyTitle;
  if (emptyStateText) emptyStateText.textContent = tx.emptyText;
  if (insightsTitle) insightsTitle.textContent = tx.insights;
  
  // Update AI section titles
  const aiSiteSummaryTitle = document.querySelector('#aiSiteSummary .ai-section-title');
  const aiFunnelTitle = document.querySelector('#aiFunnel .ai-section-title');
  const aiSummaryTitle = document.querySelector('#aiSummary .ai-section-title');
  const aiGapsTitle = document.querySelector('#aiGaps .ai-section-title');
  const aiRecommendationsTitle = document.querySelector('#aiRecommendations .ai-section-title');
  const aiContentIdeasTitle = document.querySelector('#aiContentIdeas .ai-section-title');
  const aiContentStrategyTitle = document.querySelector('#aiContentStrategy .ai-section-title');
  const aiLandingInsightsTitle = document.querySelector('#aiLandingInsights .ai-section-title');
  const aiQAMonitorTitle = document.querySelector('#aiQAMonitor .ai-section-title');
  const btnGenerateContentStrategyEl = document.getElementById('btnGenerateContentStrategy');
  const btnGenerateLandingInsightsEl = document.getElementById('btnGenerateLandingInsights');
  const btnRunQAEl = document.getElementById('btnRunQA');
  
  if (aiSiteSummaryTitle) aiSiteSummaryTitle.textContent = tx.siteSummary;
  if (aiFunnelTitle) aiFunnelTitle.textContent = tx.funnelGuess;
  if (aiSummaryTitle) aiSummaryTitle.textContent = tx.aiSummary;
  if (aiGapsTitle) aiGapsTitle.textContent = tx.missingElements;
  if (aiRecommendationsTitle) aiRecommendationsTitle.textContent = tx.topRecommendations;
  if (aiContentIdeasTitle) aiContentIdeasTitle.textContent = tx.contentStrategyIdeas;
  if (aiContentStrategyTitle) aiContentStrategyTitle.textContent = tx.recommendedPages;
  if (aiLandingInsightsTitle) aiLandingInsightsTitle.textContent = tx.landingPageFeedback;
  if (aiQAMonitorTitle) aiQAMonitorTitle.textContent = tx.qaStatus;
  if (btnGenerateContentStrategyEl) btnGenerateContentStrategyEl.textContent = tx.generateContentStrategy;
  if (btnGenerateLandingInsightsEl) btnGenerateLandingInsightsEl.textContent = tx.analyzeLandingPages;
  if (btnRunQAEl) btnRunQAEl.textContent = tx.runQACheck;
  
  if (heroFlow.length >= 4 && tx.heroFlow) {
    heroFlow[0].textContent = tx.heroFlow[0];
    heroFlow[2].textContent = tx.heroFlow[1];
    heroFlow[4].textContent = tx.heroFlow[2];
    heroFlow[6].textContent = tx.heroFlow[3];
  }

  const kpiTitleEl = document.querySelector('.kpi-section-title');
  const kpiLabels = document.querySelectorAll('.kpi-label');
  if (kpiTitleEl) kpiTitleEl.textContent = tx.kpiTitle;
  kpiLabels.forEach((el, i) => {
    const labels = [tx.kpiTotalUrls, tx.kpiSource, tx.kpiMaxDepth, tx.kpiExcluded];
    if (labels[i]) el.textContent = labels[i];
  });

  // Filter bar
  const depthLabel = document.querySelector('#depthChip span');
  const maxLabel = document.querySelector('#maxChip span');
  const queryLabel = document.querySelector('#queryChip span');
  const wwwLabel = document.querySelector('#wwwChip span');
  const excludeLabel = document.querySelector('#excludeChip span');
  if (depthLabel) depthLabel.textContent = tx.filterDepth;
  if (maxLabel) maxLabel.textContent = tx.filterMaxUrls;
  if (queryLabel) queryLabel.textContent = tx.filterQueryStrip;
  if (wwwLabel) wwwLabel.textContent = tx.filterWww;
  if (excludeLabel) excludeLabel.textContent = tx.filterExclude;
  const excludeInput = document.getElementById('excludePaths');
  if (excludeInput) excludeInput.placeholder = tx.filterExcludePlaceholder;
  [document.getElementById('depth'), document.getElementById('max'), document.getElementById('stripQuery'), document.getElementById('allowWwwAlias'), document.getElementById('excludePaths')].forEach((el, i) => {
    if (el) el.setAttribute('aria-label', [tx.ariaLabelDepth, tx.ariaLabelMaxUrls, tx.ariaLabelStripQuery, tx.ariaLabelWww, tx.ariaLabelExclude][i]);
  });

  const tabs = document.querySelectorAll('.insight-tab');
  const tabKeys = ['tabAiInsights', 'tabSitemapView', 'tabPageTypes', 'tabFigmaReady', 'tabImportance'];
  tabs.forEach((tab, i) => { if (tx[tabKeys[i]]) tab.textContent = tx[tabKeys[i]]; });

  const strategistTitles = document.querySelectorAll('.strategist-section-title');
  const strategistKeys = ['strategistFunnelHealth', 'strategistDesignDebt', 'strategistContentCoverage', 'strategistConversionReadiness'];
  strategistTitles.forEach((el, i) => { if (tx[strategistKeys[i]]) el.textContent = tx[strategistKeys[i]]; });

  const tableTitleSpan = document.querySelector('.table-title span:first-child');
  if (tableTitleSpan) tableTitleSpan.textContent = tx.urlList;
  const btnAutoSelect = document.getElementById('btnAutoSelectDesign');
  const btnSelectAllEl = document.getElementById('btnSelectAll');
  const btnClearEl = document.getElementById('btnClearSelection');
  const btnTxtEl = document.getElementById('btnTxt');
  const btnCsvEl = document.getElementById('btnCsv');
  const searchInput = document.getElementById('search');
  if (btnAutoSelect) btnAutoSelect.textContent = tx.autoSelectDesign;
  if (btnSelectAllEl) btnSelectAllEl.textContent = tx.selectAll;
  if (btnClearEl) btnClearEl.textContent = tx.clear;
  if (btnTxtEl?.querySelector('span')) btnTxtEl.querySelector('span').textContent = tx.urlsTxt;
  if (btnCsvEl?.querySelector('span')) btnCsvEl.querySelector('span').textContent = tx.urlsCsv;
  if (searchInput) searchInput.placeholder = tx.searchUrls;

  const pathDepthTh = document.querySelector('th.sortable[data-sort="depth"]');
  const queryTh = document.querySelector('thead tr th:nth-child(4)');
  const externalTh = document.querySelector('thead tr th:nth-child(5)');
  if (pathDepthTh) pathDepthTh.textContent = tx.pathDepth;
  if (queryTh) queryTh.textContent = tx.query;
  if (externalTh) externalTh.textContent = tx.external;
  const checkAllInput = document.getElementById('checkAll');
  if (checkAllInput) {
    checkAllInput.setAttribute('aria-label', tx.selectAllUrls);
    checkAllInput.setAttribute('title', tx.selectAllUrls);
  }
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  if (prevBtn) prevBtn.textContent = tx.previous;
  if (nextBtn) nextBtn.textContent = tx.next;

  const errorTitleEl = document.getElementById('errorTitle');
  const errorRetryBtn = document.getElementById('errorRetry');
  if (errorTitleEl) errorTitleEl.textContent = tx.discoveryFailed;
  if (errorRetryBtn) errorRetryBtn.textContent = tx.retry;

  const aiLoadingTextEl = document.getElementById('aiLoadingText');
  if (aiLoadingTextEl) aiLoadingTextEl.textContent = tx.generating;

  const themeToggleBtn = document.getElementById('themeToggle');
  const langToggleBtn = document.getElementById('langToggle');
  const toastCloseBtn = document.getElementById('toastClose');
  if (themeToggleBtn) themeToggleBtn.setAttribute('aria-label', tx.ariaThemeToggle);
  if (langToggleBtn) langToggleBtn.setAttribute('aria-label', tx.ariaLangToggle);
  if (toastCloseBtn) {
    toastCloseBtn.setAttribute('aria-label', tx.ariaToastClose);
    toastCloseBtn.setAttribute('title', tx.ariaToastClose);
  }
  const cancelCollectBtn = document.getElementById('btnCancelCollect');
  if (cancelCollectBtn) {
    cancelCollectBtn.textContent = tx.cancelCollect;
    cancelCollectBtn.setAttribute('aria-label', tx.ariaCancelCollect);
  }

  const tableSectionEl = document.getElementById('tableSection');
  const insightsSectionEl = document.getElementById('insightsSection');
  const tableEl = document.querySelector('table[aria-label]');
  if (tableSectionEl) tableSectionEl.setAttribute('aria-label', tx.ariaLabelUrlList);
  if (insightsSectionEl) insightsSectionEl.setAttribute('aria-label', tx.ariaLabelInsights);
  if (tableEl) tableEl.setAttribute('aria-label', tx.ariaLabelDiscoveredUrls);

  const skipLink = document.getElementById('skipToContent');
  if (skipLink) skipLink.textContent = tx.skipToContent;
}

// Theme toggle
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
});

// Language toggle
langToggle.addEventListener('click', () => {
  const currentLang = document.documentElement.getAttribute('lang') || 'ko';
  const newLang = currentLang === 'ko' ? 'en' : 'ko';
  applyLanguage(newLang);
  if (rawUrls.length > 0) updateKPI();
});

applyTheme(savedTheme);
applyLanguage(savedLang);

// DOM Elements
const baseEl = document.getElementById("base");
const depthEl = document.getElementById("depth");
const maxEl = document.getElementById("max");
const btnStart = document.getElementById("btnStart");
const btnStartSpinner = document.getElementById("btnStartSpinner");
const btnStartText = document.getElementById("btnStartText");
const progressStatus = document.getElementById("progressStatus");
const progressText = document.getElementById("progressText");
const btnCancelCollect = document.getElementById("btnCancelCollect");
const COLLECT_TIMEOUT_MS = 5 * 60 * 1000;
let collectAbortController = null;
let collectTimeoutId = null;
const tableSection = document.getElementById("tableSection");
const tableBody = document.getElementById("tableBody");
const urlCountEl = document.getElementById("urlCount");
const selectionInfo = document.getElementById("selectionInfo");
const checkAllEl = document.getElementById("checkAll");
const btnSelectAll = document.getElementById("btnSelectAll");
const btnClearSelection = document.getElementById("btnClearSelection");
const stripQueryEl = document.getElementById("stripQuery");
const allowWwwAliasEl = document.getElementById("allowWwwAlias");
const excludePathsEl = document.getElementById("excludePaths");
const searchEl = document.getElementById("search");
const searchCount = document.getElementById("searchCount");
const btnTxt = document.getElementById("btnTxt");
const btnCsv = document.getElementById("btnCsv");
const kpiSection = document.getElementById("kpiSection");
const kpiTotal = document.getElementById("kpiTotal");
const kpiSource = document.getElementById("kpiSource");
const kpiDepth = document.getElementById("kpiDepth");
const kpiExcluded = document.getElementById("kpiExcluded");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const toastIcon = document.getElementById("toastIcon");
const toastClose = document.getElementById("toastClose");
const emptyState = document.getElementById("emptyState");
const errorState = document.getElementById("errorState");
const errorTitle = document.getElementById("errorTitle");
const errorMessage = document.getElementById("errorMessage");
const errorRetry = document.getElementById("errorRetry");
const pagination = document.getElementById("pagination");
const paginationInfo = document.getElementById("paginationInfo");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
const btnDemo = document.getElementById("btnDemo");
const inputHelper = document.getElementById("inputHelper");
const insightsSection = document.getElementById("insightsSection");
const insightTabs = document.querySelectorAll(".insight-tab");
const insightContents = document.querySelectorAll("#insightsSection > .insight-content");
const sitemapTree = document.getElementById("sitemapTree");
const pageTypesList = document.getElementById("pageTypesList");
const figmaReadiness = document.getElementById("figmaReadiness");
const importanceList = document.getElementById("importanceList");
const aiInsightsContent = document.getElementById("aiInsightsContent");
const aiLoading = document.getElementById("aiLoading");
const aiLoadingText = document.getElementById("aiLoadingText");
const aiError = document.getElementById("aiError");
const aiErrorMessage = document.getElementById("aiErrorMessage");
const btnAutoSelectDesign = document.getElementById("btnAutoSelectDesign");
const btnGenerateContentStrategy = document.getElementById("btnGenerateContentStrategy");
const btnGenerateLandingInsights = document.getElementById("btnGenerateLandingInsights");
const btnRunQA = document.getElementById("btnRunQA");

// State
let rawUrls = [];
let filteredUrls = [];
let currentSource = null;
let currentSort = { field: null, direction: 'asc' };
let currentPage = 1;
let startTime = null;
let excludedCount = 0;
let urlMetadata = {}; // { url: { links: [], type, figmaScore, linkCount } }
let currentDomain = null;
let aiInsights = null;
const itemsPerPage = 20;

// Toast Notification
function showToast(message, type = 'success') {
  const iconPaths = {
    success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    error: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
    info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  };
  const iconColors = {
    success: '#10B981',
    error: '#EF4444',
    info: '#3B82F6'
  };
  
  // Toast icon removed - no icon display
  toastIcon.innerHTML = '';
  toastMessage.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

toastClose.addEventListener('click', () => {
  toast.classList.remove('show');
});

function updateProgressStatus(text) {
  if (text) {
    progressText.textContent = text;
    progressStatus.style.display = 'block';
  } else {
    progressStatus.style.display = 'none';
  }
}

function applyFilters() {
  const q = (searchEl.value || "").toLowerCase();
  const excludePaths = (excludePathsEl.value || "").split(",").map(s => s.trim()).filter(Boolean);
  
  filteredUrls = rawUrls.filter(r => {
    if (q && !r.url.toLowerCase().includes(q)) return false;
    if (excludePaths.length) {
      const pathname = new URL(r.url).pathname;
      if (excludePaths.some(p => pathname.startsWith(p) || pathname.startsWith(p.replace(/\/$/, "") + "/"))) {
        return false;
      }
    }
    return true;
  });
  
  excludedCount = rawUrls.length - filteredUrls.length;
  
  if (q) {
    searchCount.textContent = t('searchResults', filteredUrls.length);
    searchCount.style.display = 'block';
  } else {
    searchCount.style.display = 'none';
  }
  
  currentPage = 1;
  renderTable();
  updateKPI();
}

function sortUrls(field) {
  if (currentSort.field === field) {
    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.field = field;
    currentSort.direction = 'asc';
  }
  
  document.querySelectorAll('.sortable').forEach(th => th.classList.remove('active'));
  const activeHeader = document.querySelector(`[data-sort="${field}"]`);
  if (activeHeader) {
    activeHeader.classList.add('active');
    const icon = activeHeader.querySelector('.sort-icon');
    if (icon) {
      icon.style.transform = currentSort.direction === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)';
    }
  }
  
  renderTable();
}

function updateKPI() {
  kpiTotal.textContent = rawUrls.length.toLocaleString();
  kpiSource.textContent = currentSource === "sitemap" ? t('sitemap') : currentSource === "crawl" ? t('crawl') : "-";
  kpiDepth.textContent = depthEl.value || "-";
  kpiExcluded.textContent = excludedCount.toLocaleString();
  kpiSection.style.display = "block";
  
  // Add fade-in animation
  document.querySelectorAll('.kpi-card').forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('fade-in');
    }, index * 50);
  });
}

function updateSelectionInfo() {
  const selected = document.querySelectorAll(".row-check:checked").length;
  if (selected > 0) {
    selectionInfo.textContent = t('selectionInfo', selected);
    selectionInfo.style.display = 'inline';
    btnClearSelection.style.display = 'inline-flex';
  } else {
    selectionInfo.style.display = 'none';
    btnClearSelection.style.display = 'none';
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(t('toastCopied'), "success");
  }).catch(() => {
    showToast(t('toastCopyFailed'), "error");
  });
}

function renderTable() {
  let sorted = [...filteredUrls];
  
  if (currentSort.field) {
    sorted.sort((a, b) => {
      let aVal, bVal;
      if (currentSort.field === 'url') {
        aVal = a.url.toLowerCase();
        bVal = b.url.toLowerCase();
      } else if (currentSort.field === 'depth') {
        aVal = a.pathDepth;
        bVal = b.pathDepth;
      }
      
      if (aVal < bVal) return currentSort.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return currentSort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  } else {
    sorted.sort((a, b) => a.pathDepth - b.pathDepth || a.url.localeCompare(b.url));
  }
  
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginated = sorted.slice(start, end);
  
  urlCountEl.textContent = `(${sorted.length})`;
  
  if (sorted.length > itemsPerPage) {
    pagination.style.display = 'flex';
    paginationInfo.textContent = `${start + 1}-${Math.min(end, sorted.length)} / ${sorted.length}`;
    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages;
  } else {
    pagination.style.display = 'none';
  }
  
  const yesLabel = t('yes');
  const selLabel = t('ariaLabelSelect');
  const copyLabel = t('ariaLabelCopy');
  const copyTitle = t('copyToClipboard');
  tableBody.innerHTML = paginated.map((r) => {
    return `<tr tabindex="0" role="row">
      <td><input type="checkbox" class="row-check" data-url="${escapeAttr(r.url)}" aria-label="${escapeAttr(selLabel)}"></td>
      <td class="url-cell">
        <a href="${escapeAttr(safeHref(r.url))}" target="_blank" rel="noopener noreferrer" class="url-link" title="${escapeAttr(r.url)}">
          <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;">${escapeHtml(r.url)}</span>
          <button class="copy-btn" data-url="${escapeAttr(r.url)}" aria-label="${escapeAttr(copyLabel)}" title="${escapeAttr(copyTitle)}">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </button>
        </a>
      </td>
      <td style="text-align:right;"><span class="depth-badge">${r.pathDepth}</span></td>
      <td>${r.hasQuery ? `<span style="color:#10B981;font-weight:500;">${escapeHtml(yesLabel)}</span>` : '<span style="color:#9CA3AF;">-</span>'}</td>
      <td>${r.external ? `<span style="color:#EF4444;font-weight:500;">${escapeHtml(yesLabel)}</span>` : '<span style="color:#9CA3AF;">-</span>'}</td>
    </tr>`;
  }).join("");

  document.querySelectorAll(".row-check").forEach((cb) => {
    cb.addEventListener("change", () => { 
      updateCheckAll();
      updateSelectionInfo();
    });
  });
  
  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      copyToClipboard(btn.dataset.url);
    });
  });
  
  document.querySelectorAll("#tableBody tr").forEach((row) => {
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const checkbox = row.querySelector('.row-check');
        if (checkbox) checkbox.click();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = row.nextElementSibling;
        if (next) next.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = row.previousElementSibling;
        if (prev) prev.focus();
      }
    });
  });
  
  checkAllEl.checked = false;
  checkAllEl.indeterminate = false;
  updateSelectionInfo();
}

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

function escapeAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Only allow http/https for href to prevent XSS; otherwise use "#". */
function safeHref(urlStr) {
  if (!urlStr || typeof urlStr !== "string") return "#";
  const s = urlStr.trim().toLowerCase();
  if (s.startsWith("http://") || s.startsWith("https://")) return urlStr.trim();
  return "#";
}

function updateCheckAll() {
  const checks = document.querySelectorAll(".row-check");
  const checked = [...checks].filter(c => c.checked).length;
  checkAllEl.checked = checked === checks.length && checks.length > 0;
  checkAllEl.indeterminate = checked > 0 && checked < checks.length;
  updateSelectionInfo();
}

function getSelectedUrls() {
  return [...document.querySelectorAll(".row-check:checked")].map((c) => c.dataset.url).filter(Boolean);
}

function getDisplayUrls() {
  return filteredUrls.map(r => r.url);
}

function download(text, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

// Event Listeners
checkAllEl.addEventListener("change", () => {
  document.querySelectorAll(".row-check").forEach(c => { c.checked = checkAllEl.checked; });
  updateSelectionInfo();
});

btnSelectAll.addEventListener("click", () => {
  checkAllEl.checked = true;
  checkAllEl.dispatchEvent(new Event('change'));
});

btnClearSelection.addEventListener("click", () => {
  checkAllEl.checked = false;
  checkAllEl.dispatchEvent(new Event('change'));
});

document.querySelectorAll('.sortable').forEach(header => {
  header.addEventListener('click', () => {
    const field = header.getAttribute('data-sort');
    if (field) sortUrls(field);
  });
});

prevPage.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
});

nextPage.addEventListener('click', () => {
  const totalPages = Math.ceil(filteredUrls.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
});

searchEl.addEventListener("input", applyFilters);

// Filter chip active state management
stripQueryEl.addEventListener('change', () => {
  const chip = document.getElementById('queryChip');
  if (stripQueryEl.checked) {
    chip.classList.add('active');
  } else {
    chip.classList.remove('active');
  }
});

allowWwwAliasEl.addEventListener('change', () => {
  const chip = document.getElementById('wwwChip');
  if (allowWwwAliasEl.checked) {
    chip.classList.add('active');
  } else {
    chip.classList.remove('active');
  }
});

depthEl.addEventListener('input', () => {
  const chip = document.getElementById('depthChip');
  if (depthEl.value && depthEl.value !== '3') {
    chip.classList.add('active');
  } else {
    chip.classList.remove('active');
  }
});

maxEl.addEventListener('input', () => {
  const chip = document.getElementById('maxChip');
  if (maxEl.value && maxEl.value !== '5000') {
    chip.classList.add('active');
  } else {
    chip.classList.remove('active');
  }
});

excludePathsEl.addEventListener('input', () => {
  const chip = document.getElementById('excludeChip');
  if (excludePathsEl.value.trim()) {
    chip.classList.add('active');
  } else {
    chip.classList.remove('active');
  }
});

errorRetry.addEventListener('click', () => {
  errorState.style.display = 'none';
  btnStart.click();
});

// Demo button
btnDemo.addEventListener('click', () => {
  baseEl.value = 'https://webscout-demo.pages.dev';
  inputHelper.style.display = 'none';
  baseEl.focus();
});

// Hide helper text when user starts typing
baseEl.addEventListener('input', () => {
  if (baseEl.value.trim()) {
    inputHelper.style.display = 'none';
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    if (!btnStart.disabled) btnStart.click();
  }
  if (e.key === 'Escape' && document.activeElement === searchEl) {
    searchEl.value = '';
    applyFilters();
  }
  if (e.key === 'Enter' && document.activeElement === baseEl) {
    e.preventDefault();
    if (!btnStart.disabled) btnStart.click();
  }
});

btnStart.addEventListener("click", async () => {
  const base = baseEl.value?.trim();
  if (!base) {
    showToast(t('linkRequired'), "error");
    inputHelper.textContent = t('inputHelperText');
    inputHelper.style.display = 'inline';
    inputHelper.style.color = '#EF4444';
    baseEl.focus();
    setTimeout(() => {
      inputHelper.style.display = 'none';
    }, 3000);
    return;
  }
  
  inputHelper.style.display = 'none';

  btnStart.disabled = true;
  btnStartSpinner.style.display = 'inline-block';
  btnStartText.textContent = t('btnCollecting');
  updateProgressStatus(t('progressDiscovering'));
  tableSection.style.display = "none";
  insightsSection.style.display = "none";
  kpiSection.style.display = "none";
  emptyState.style.display = "none";
  errorState.style.display = "none";
  currentSource = null;
  currentPage = 1;
  currentSort = { field: null, direction: 'asc' };
  excludedCount = 0;
  startTime = Date.now();

  collectAbortController = new AbortController();
  collectTimeoutId = setTimeout(() => collectAbortController?.abort(), COLLECT_TIMEOUT_MS);

  try {
    const res = await fetch("/api/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        baseUrl: base,
        base,
        depth: +depthEl.value || 3,
        max: +maxEl.value || 5000,
        stripQuery: stripQueryEl.checked,
        allowWwwAlias: allowWwwAliasEl.checked,
        excludePaths: (excludePathsEl.value || "").split(",").map(s => s.trim()).filter(Boolean),
      }),
      signal: collectAbortController.signal,
    });
    if (!res.ok) throw new Error(res.statusText);

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() || "";
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const obj = JSON.parse(line);
          if (obj.type === "log") {
            if (obj.msg.includes("sitemap")) {
              updateProgressStatus(t('progressDiscovering'));
            } else if (obj.msg.includes("crawl") || obj.msg.includes("Fallback")) {
              updateProgressStatus(t('progressCrawling'));
            }
          } else if (obj.type === "done") {
            rawUrls = obj.urls || [];
            currentSource = obj.source || null;
            urlMetadata = obj.metadata || {};
            currentDomain = baseEl.value?.trim() || null;
            updateProgressStatus(null);
            applyFilters();
            updateKPI();
            updateInsights();
            tableSection.style.display = "block";
            insightsSection.style.display = "block";
            if (rawUrls.length === 0) {
              emptyState.style.display = "block";
            }
            showToast(t('toastCollectedCount', rawUrls.length), "success");
          } else if (obj.type === "error") {
            updateProgressStatus(null);
            errorTitle.textContent = t('discoveryFailed');
            errorMessage.textContent = obj.msg;
            errorState.style.display = "block";
            showToast(t('toastDiscoveryError'), "error");
            setTimeout(() => errorRetry.focus(), 100);
          }
        } catch (parseErr) {
          showToast(t('toastStreamParseError'), "error");
        }
      }
    }
    if (buf.trim()) {
      try {
        const obj = JSON.parse(buf);
        if (obj.type === "done") {
          rawUrls = obj.urls || [];
          currentSource = obj.source || null;
          urlMetadata = obj.metadata || {};
          currentDomain = baseEl.value?.trim() || null;
          updateProgressStatus(null);
          applyFilters();
          updateKPI();
          updateInsights();
          tableSection.style.display = "block";
          insightsSection.style.display = "block";
          if (rawUrls.length === 0) {
            emptyState.style.display = "block";
          }
          showToast(t('toastCollectedCount', rawUrls.length), "success");
        }
      } catch (parseErr) {
        showToast(t('toastStreamParseError'), "error");
      }
    }
  } catch (err) {
    updateProgressStatus(null);
    if (err.name === "AbortError") {
      showToast(t('toastCollectCancelled'), "info");
    } else {
      errorTitle.textContent = t('discoveryFailed');
      let errorMsg = err.message || "Unknown error";
      if (err.message === "Failed to fetch" || err.name === "TypeError") {
        errorMsg = "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요. (Server connection failed - please check if server is running)";
      } else if (err.message.includes("NetworkError") || err.message.includes("network")) {
        errorMsg = "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요. (Network error - please check your internet connection)";
      } else if (err.message.includes("CORS")) {
        errorMsg = "CORS 오류가 발생했습니다. 서버 설정을 확인해주세요. (CORS error - please check server configuration)";
      }
      errorMessage.textContent = errorMsg;
      errorState.style.display = "block";
      showToast(t('toastDiscoveryError'), "error");
      setTimeout(() => errorRetry.focus(), 100);
      console.error("Discovery error:", err);
    }
  } finally {
    if (collectTimeoutId) clearTimeout(collectTimeoutId);
    collectTimeoutId = null;
    collectAbortController = null;
    progressStatus.style.display = 'none';
    btnStart.disabled = false;
    btnStartSpinner.style.display = 'none';
    btnStartText.textContent = t('btnCollect');
  }
});

if (btnCancelCollect) {
  btnCancelCollect.addEventListener('click', () => {
    if (collectAbortController) collectAbortController.abort();
  });
}

btnTxt.addEventListener("click", () => {
  const urls = getSelectedUrls();
  if (!urls.length) {
    showToast(t('toastNoUrlsSelected'), "error");
    return;
  }
  download(urls.join("\n") + "\n", "urls.txt");
  showToast(t('toastUrlsDownloaded', urls.length), "success");
});

btnCsv.addEventListener("click", () => {
  const urls = getDisplayUrls();
  if (!urls.length) {
    showToast(t('toastNoUrlsToExport'), "error");
    return;
  }
  const csv = "url\n" + urls.map(u => `"${u.replace(/"/g, '""')}"`).join("\n") + "\n";
  download(csv, "urls.csv");
  showToast(t('toastUrlsDownloaded', urls.length), "success");
});

// Initialize filter chip states
if (allowWwwAliasEl.checked) {
  document.getElementById('wwwChip').classList.add('active');
}

// Tab switching - shared logic for click and keyboard
function switchToInsightTab(tab) {
  const tabName = tab.dataset.tab;
  insightTabs.forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  insightContents.forEach(content => {
    content.classList.remove('active');
    content.style.display = 'none';
  });
  const targetContent = document.getElementById(`insight${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
  if (targetContent) {
    targetContent.classList.add('active');
    targetContent.style.display = 'block';
    if (tabName === 'ai') {
      const aiContent = document.getElementById('aiInsightsContent');
      if (aiContent) {
        aiContent.style.display = 'block';
        aiContent.style.width = '100%';
        aiContent.style.overflow = 'visible';
      }
      const aiLoading = document.getElementById('aiLoading');
      const aiError = document.getElementById('aiError');
      if (aiLoading) aiLoading.style.display = 'none';
      if (aiError) aiError.style.display = 'none';
      if (rawUrls.length > 0) renderStrategistInsights();
    }
    void targetContent.offsetHeight;
    targetContent.setAttribute('tabindex', '-1');
    targetContent.focus({ preventScroll: false });
  }
}

insightTabs.forEach(tab => {
  tab.addEventListener('click', () => switchToInsightTab(tab));
});

// Keyboard navigation: Arrow Left/Right, Home, End for insight tabs
const tablistEl = document.querySelector('.insights-tabs[role="tablist"]');
if (tablistEl) {
  tablistEl.addEventListener('keydown', (e) => {
    const tabs = [...insightTabs];
    const idx = tabs.indexOf(document.activeElement);
    if (idx === -1) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIdx = e.key === 'ArrowLeft' ? (idx - 1 + tabs.length) % tabs.length : (idx + 1) % tabs.length;
      tabs[nextIdx].focus();
      switchToInsightTab(tabs[nextIdx]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      tabs[0].focus();
      switchToInsightTab(tabs[0]);
    } else if (e.key === 'End') {
      e.preventDefault();
      tabs[tabs.length - 1].focus();
      switchToInsightTab(tabs[tabs.length - 1]);
    }
  });
}

// Insights rendering functions
function updateInsights() {
  if (!rawUrls.length) return;
  
  // Strategist-oriented insights
  renderStrategistInsights();
  
  // Developer views (in Advanced section)
  renderSitemapTree();
  renderPageTypes();
  renderFigmaReadiness();
  renderImportance();
}

// Strategist-Oriented Insights
function renderStrategistInsights() {
  const isKorean = window.currentLang === 'ko';
  
  // Calculate metrics
  const funnelHealth = calculateFunnelHealth(isKorean);
  const designDebt = calculateDesignDebt(isKorean);
  const contentCoverage = calculateContentCoverage(isKorean);
  const conversionReadiness = calculateConversionReadiness(isKorean);
  
  // Render each section
  renderFunnelHealth(funnelHealth, isKorean);
  renderDesignDebt(designDebt, isKorean);
  renderContentCoverage(contentCoverage, isKorean);
  renderConversionReadiness(conversionReadiness, isKorean);
}

function calculateFunnelHealth(isKorean) {
  const urlStrings = rawUrls.map(u => typeof u === 'string' ? u : u.url);
  
  // Classify URLs
  const landing = urlStrings.filter(url => {
    const path = new URL(url).pathname.toLowerCase();
    return path === '/' || path === '/index' || path === '/home';
  });
  
  const product = urlStrings.filter(url => {
    const path = new URL(url).pathname.toLowerCase();
    return path.includes('/product') || path.includes('/app') || path.includes('/feature') || 
           path.includes('/solution') || path.includes('/dashboard');
  });
  
  const conversion = urlStrings.filter(url => {
    const path = new URL(url).pathname.toLowerCase();
    return path.includes('/pricing') || path.includes('/contact') || path.includes('/demo') ||
           path.includes('/signup') || path.includes('/trial') || path.includes('/buy');
  });
  
  // Calculate completeness score (0-10)
  let score = 0;
  if (landing.length > 0) score += 3;
  if (product.length > 0) score += 3;
  if (conversion.length > 0) score += 4;
  
  // Generate insights
  const insights = [];
  if (landing.length === 0) {
    insights.push(isKorean ? '랜딩 페이지가 없습니다' : 'No landing page found');
  } else {
    insights.push(isKorean ? `${landing.length}개의 랜딩 페이지 발견` : `${landing.length} landing page(s) found`);
  }
  
  if (product.length === 0) {
    insights.push(isKorean ? '제품 페이지가 없습니다' : 'No product pages found');
  } else {
    insights.push(isKorean ? `${product.length}개의 제품 페이지` : `${product.length} product pages`);
  }
  
  if (conversion.length === 0) {
    insights.push(isKorean ? '전환 페이지가 없습니다' : 'No conversion pages found');
  } else {
    insights.push(isKorean ? `${conversion.length}개의 전환 페이지` : `${conversion.length} conversion pages`);
  }
  
  // Recommendation
  let recommendation = '';
  if (score < 7) {
    recommendation = isKorean 
      ? '랜딩 → 제품 → 전환 경로를 명확히 구축하세요. 각 단계별로 최소 1개 이상의 페이지가 필요합니다.'
      : 'Build a clear Landing → Product → Conversion path. Each stage needs at least one page.';
  } else {
    recommendation = isKorean
      ? '퍼널 구조가 양호합니다. 각 단계 간 연결성을 강화하여 전환율을 높이세요.'
      : 'Funnel structure is good. Strengthen connections between stages to improve conversion.';
  }
  
  return {
    score,
    landing: landing.length,
    product: product.length,
    conversion: conversion.length,
    insights,
    recommendation
  };
}

function calculateDesignDebt(isKorean) {
  const urlStrings = rawUrls.map(u => typeof u === 'string' ? u : u.url);
  
  // Calculate Figma readiness
  const scores = urlStrings.map(url => {
    const metadata = urlMetadata[url] || {};
    return calculateFigmaScore(url, metadata);
  });
  
  const avgScore = scores.length > 0 
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
    : 0;
  
  // Calculate layout consistency (depth variance)
  const depths = urlStrings.map(url => {
    try {
      return new URL(url).pathname.split('/').filter(Boolean).length;
    } catch {
      return 0;
    }
  });
  
  const avgDepth = depths.length > 0 
    ? depths.reduce((a, b) => a + b, 0) / depths.length 
    : 0;
  
  const depthVariance = depths.length > 0
    ? depths.reduce((sum, d) => sum + Math.pow(d - avgDepth, 2), 0) / depths.length
    : 0;
  
  // Score (0-10): Higher score = less debt
  let score = Math.round((avgScore / 100) * 7); // 70% weight on Figma readiness
  if (depthVariance < 2) score += 2; // Low variance = consistent
  else if (depthVariance < 5) score += 1;
  score = Math.min(10, score);
  
  // Insights
  const insights = [];
  insights.push(isKorean 
    ? `Figma 준비도: ${avgScore}%`
    : `Figma readiness: ${avgScore}%`);
  
  const consistency = depthVariance < 2 ? (isKorean ? '일관적' : 'Consistent') :
                      depthVariance < 5 ? (isKorean ? '보통' : 'Moderate') :
                      (isKorean ? '불일치' : 'Inconsistent');
  insights.push(isKorean 
    ? `레이아웃 일관성: ${consistency}`
    : `Layout consistency: ${consistency}`);
  
  if (depthVariance > 0) {
    insights.push(isKorean
      ? `평균 경로 깊이: ${avgDepth.toFixed(1)}`
      : `Average path depth: ${avgDepth.toFixed(1)}`);
  }
  
  // Recommendation
  let recommendation = '';
  if (score < 6) {
    recommendation = isKorean
      ? 'URL 구조를 단순화하고 일관된 경로 깊이를 유지하세요. 쿼리 파라미터와 해시를 제거하면 Figma 준비도가 향상됩니다.'
      : 'Simplify URL structure and maintain consistent path depth. Remove query parameters and hashes to improve Figma readiness.';
  } else {
    recommendation = isKorean
      ? '디자인 부채가 낮습니다. 현재 구조를 유지하면서 점진적으로 개선하세요.'
      : 'Design debt is low. Maintain current structure while making incremental improvements.';
  }
  
  return {
    score,
    figmaReadiness: avgScore,
    depthVariance: depthVariance.toFixed(2),
    avgDepth: avgDepth.toFixed(1),
    insights,
    recommendation
  };
}

function calculateContentCoverage(isKorean) {
  const urlStrings = rawUrls.map(u => typeof u === 'string' ? u : u.url);
  
  // Classify content types
  const blog = urlStrings.filter(url => {
    const path = new URL(url).pathname.toLowerCase();
    return path.includes('/blog') || path.includes('/post') || path.includes('/article') ||
           path.includes('/news');
  });
  
  const product = urlStrings.filter(url => {
    const path = new URL(url).pathname.toLowerCase();
    return path.includes('/product') || path.includes('/feature') || path.includes('/solution');
  });
  
  const caseStudy = urlStrings.filter(url => {
    const path = new URL(url).pathname.toLowerCase();
    return path.includes('/case') || path.includes('/study') || path.includes('/success') ||
           path.includes('/customer');
  });
  
  // Score (0-10)
  let score = 0;
  if (blog.length > 0) score += 3;
  if (product.length > 0) score += 4;
  if (caseStudy.length > 0) score += 3;
  
  // Missing content types
  const missing = [];
  if (blog.length === 0) missing.push(isKorean ? '블로그' : 'Blog');
  if (product.length === 0) missing.push(isKorean ? '제품 페이지' : 'Product pages');
  if (caseStudy.length === 0) missing.push(isKorean ? '사례 연구' : 'Case studies');
  
  // Insights
  const insights = [];
  insights.push(isKorean 
    ? `블로그: ${blog.length}개, 제품: ${product.length}개, 사례: ${caseStudy.length}개`
    : `Blog: ${blog.length}, Product: ${product.length}, Case studies: ${caseStudy.length}`);
  
  if (missing.length > 0) {
    insights.push(isKorean
      ? `누락된 콘텐츠 유형: ${missing.join(', ')}`
      : `Missing content types: ${missing.join(', ')}`);
  } else {
    insights.push(isKorean
      ? '주요 콘텐츠 유형이 모두 포함되어 있습니다'
      : 'All major content types are present');
  }
  
  const totalContent = blog.length + product.length + caseStudy.length;
  const contentRatio = rawUrls.length > 0 ? (totalContent / rawUrls.length * 100).toFixed(0) : 0;
  insights.push(isKorean
    ? `콘텐츠 비율: ${contentRatio}%`
    : `Content ratio: ${contentRatio}%`);
  
  // Recommendation
  let recommendation = '';
  if (score < 7) {
    recommendation = isKorean
      ? `${missing.join(', ')} 콘텐츠를 추가하여 고객 여정을 지원하세요. 블로그는 SEO와 교육에, 사례 연구는 신뢰 구축에 도움이 됩니다.`
      : `Add ${missing.join(', ')} content to support customer journey. Blog helps with SEO and education, case studies build trust.`;
  } else {
    recommendation = isKorean
      ? '콘텐츠 커버리지가 양호합니다. 각 유형의 품질과 깊이를 높여 가치를 증대하세요.'
      : 'Content coverage is good. Increase quality and depth of each type to add value.';
  }
  
  return {
    score,
    blog: blog.length,
    product: product.length,
    caseStudy: caseStudy.length,
    missing,
    insights,
    recommendation
  };
}

function calculateConversionReadiness(isKorean) {
  const urlStrings = rawUrls.map(u => typeof u === 'string' ? u : u.url);
  
  // Check for pricing
  const hasPricing = urlStrings.some(url => {
    const path = new URL(url).pathname.toLowerCase();
    return path.includes('/pricing') || path.includes('/price') || path.includes('/plan');
  });
  
  // Check CTA depth (average depth of conversion pages)
  const conversionPages = urlStrings.filter(url => {
    const path = new URL(url).pathname.toLowerCase();
    return path.includes('/contact') || path.includes('/demo') || path.includes('/signup') ||
           path.includes('/trial') || path.includes('/buy') || path.includes('/pricing');
  });
  
  const ctaDepths = conversionPages.map(url => {
    try {
      return new URL(url).pathname.split('/').filter(Boolean).length;
    } catch {
      return 0;
    }
  });
  
  const avgCTADepth = ctaDepths.length > 0
    ? ctaDepths.reduce((a, b) => a + b, 0) / ctaDepths.length
    : 0;
  
  // Check contact accessibility (shallow depth = more accessible)
  const contactPages = urlStrings.filter(url => {
    const path = new URL(url).pathname.toLowerCase();
    return path.includes('/contact') || path.includes('/support');
  });
  
  const contactDepths = contactPages.map(url => {
    try {
      return new URL(url).pathname.split('/').filter(Boolean).length;
    } catch {
      return 0;
    }
  });
  
  const avgContactDepth = contactDepths.length > 0
    ? contactDepths.reduce((a, b) => a + b, 0) / contactDepths.length
    : 0;
  
  // Score (0-10)
  let score = 0;
  if (hasPricing) score += 4;
  if (avgCTADepth <= 2) score += 3;
  else if (avgCTADepth <= 3) score += 2;
  else score += 1;
  if (avgContactDepth <= 2) score += 3;
  else if (avgContactDepth <= 3) score += 2;
  else score += 1;
  
  // Insights
  const insights = [];
  insights.push(isKorean
    ? `가격 페이지: ${hasPricing ? '있음' : '없음'}`
    : `Pricing page: ${hasPricing ? 'Yes' : 'No'}`);
  
  if (conversionPages.length > 0) {
    insights.push(isKorean
      ? `CTA 평균 깊이: ${avgCTADepth.toFixed(1)} (${conversionPages.length}개 페이지)`
      : `Average CTA depth: ${avgCTADepth.toFixed(1)} (${conversionPages.length} pages)`);
  } else {
    insights.push(isKorean
      ? '전환 페이지가 없습니다'
      : 'No conversion pages found');
  }
  
  if (contactPages.length > 0) {
    insights.push(isKorean
      ? `연락처 접근성: ${avgContactDepth <= 2 ? '우수' : avgContactDepth <= 3 ? '양호' : '개선 필요'} (깊이 ${avgContactDepth.toFixed(1)})`
      : `Contact accessibility: ${avgContactDepth <= 2 ? 'Excellent' : avgContactDepth <= 3 ? 'Good' : 'Needs improvement'} (depth ${avgContactDepth.toFixed(1)})`);
  } else {
    insights.push(isKorean
      ? '연락처 페이지가 없습니다'
      : 'No contact page found');
  }
  
  // Recommendation
  let recommendation = '';
  if (!hasPricing) {
    recommendation = isKorean
      ? '가격 페이지를 추가하세요. 명확한 가격 정보는 전환율을 크게 향상시킵니다.'
      : 'Add a pricing page. Clear pricing information significantly improves conversion rates.';
  } else if (avgCTADepth > 3) {
    recommendation = isKorean
      ? 'CTA 페이지를 더 얕은 깊이로 이동하세요. 사용자가 2-3클릭 내에 도달할 수 있어야 합니다.'
      : 'Move CTA pages to shallower depth. Users should reach them within 2-3 clicks.';
  } else {
    recommendation = isKorean
      ? '전환 준비도가 양호합니다. A/B 테스트를 통해 CTA 효과를 최적화하세요.'
      : 'Conversion readiness is good. Optimize CTA effectiveness through A/B testing.';
  }
  
  return {
    score,
    hasPricing,
    avgCTADepth: avgCTADepth.toFixed(1),
    avgContactDepth: avgContactDepth.toFixed(1),
    conversionPages: conversionPages.length,
    contactPages: contactPages.length,
    insights,
    recommendation
  };
}

function renderFunnelHealth(data, isKorean) {
  const section = document.getElementById('strategistFunnelHealth');
  const scoreEl = document.getElementById('funnelHealthScore');
  const vizEl = document.getElementById('funnelHealthViz');
  const insightsEl = document.getElementById('funnelHealthInsights');
  const recEl = document.getElementById('funnelHealthRecommendation');
  
  scoreEl.textContent = `${data.score}/10`;
  scoreEl.className = `strategist-score ${data.score >= 7 ? 'good' : data.score >= 4 ? 'moderate' : 'poor'}`;
  
  // Funnel visualization
  vizEl.innerHTML = `
    <div class="funnel-stage">
      <div class="funnel-stage-label">${isKorean ? '랜딩' : 'Landing'}</div>
      <div class="funnel-stage-bar ${data.landing > 0 ? 'active' : ''}" style="width: ${data.landing > 0 ? 100 : 0}%"></div>
      <div class="funnel-stage-count">${data.landing}</div>
    </div>
    <div class="funnel-arrow">→</div>
    <div class="funnel-stage">
      <div class="funnel-stage-label">${isKorean ? '제품' : 'Product'}</div>
      <div class="funnel-stage-bar ${data.product > 0 ? 'active' : ''}" style="width: ${data.product > 0 ? 100 : 0}%"></div>
      <div class="funnel-stage-count">${data.product}</div>
    </div>
    <div class="funnel-arrow">→</div>
    <div class="funnel-stage">
      <div class="funnel-stage-label">${isKorean ? '전환' : 'Conversion'}</div>
      <div class="funnel-stage-bar ${data.conversion > 0 ? 'active' : ''}" style="width: ${data.conversion > 0 ? 100 : 0}%"></div>
      <div class="funnel-stage-count">${data.conversion}</div>
    </div>
  `;
  
  insightsEl.innerHTML = data.insights.map(insight => `<li>${escapeHtml(insight)}</li>`).join('');
  recEl.innerHTML = `<strong>${t('recommendation')}</strong> ${escapeHtml(data.recommendation)}`;
  
  section.style.display = 'block';
}

function renderDesignDebt(data, isKorean) {
  const section = document.getElementById('strategistDesignDebt');
  const scoreEl = document.getElementById('designDebtScore');
  const insightsEl = document.getElementById('designDebtInsights');
  const recEl = document.getElementById('designDebtRecommendation');
  
  scoreEl.textContent = `${data.score}/10`;
  scoreEl.className = `strategist-score ${data.score >= 7 ? 'good' : data.score >= 4 ? 'moderate' : 'poor'}`;
  
  insightsEl.innerHTML = data.insights.map(insight => `<li>${escapeHtml(insight)}</li>`).join('');
  recEl.innerHTML = `<strong>${t('recommendation')}</strong> ${escapeHtml(data.recommendation)}`;
  
  section.style.display = 'block';
}

function renderContentCoverage(data, isKorean) {
  const section = document.getElementById('strategistContentCoverage');
  const scoreEl = document.getElementById('contentCoverageScore');
  const insightsEl = document.getElementById('contentCoverageInsights');
  const recEl = document.getElementById('contentCoverageRecommendation');
  
  scoreEl.textContent = `${data.score}/10`;
  scoreEl.className = `strategist-score ${data.score >= 7 ? 'good' : data.score >= 4 ? 'moderate' : 'poor'}`;
  
  insightsEl.innerHTML = data.insights.map(insight => `<li>${escapeHtml(insight)}</li>`).join('');
  recEl.innerHTML = `<strong>${t('recommendation')}</strong> ${escapeHtml(data.recommendation)}`;
  
  section.style.display = 'block';
}

function renderConversionReadiness(data, isKorean) {
  const section = document.getElementById('strategistConversionReadiness');
  const scoreEl = document.getElementById('conversionReadinessScore');
  const insightsEl = document.getElementById('conversionReadinessInsights');
  const recEl = document.getElementById('conversionReadinessRecommendation');
  
  scoreEl.textContent = `${data.score}/10`;
  scoreEl.className = `strategist-score ${data.score >= 7 ? 'good' : data.score >= 4 ? 'moderate' : 'poor'}`;
  
  insightsEl.innerHTML = data.insights.map(insight => `<li>${escapeHtml(insight)}</li>`).join('');
  recEl.innerHTML = `<strong>${t('recommendation')}</strong> ${escapeHtml(data.recommendation)}`;
  
  section.style.display = 'block';
}

function renderSitemapTree() {
  if (!rawUrls.length) {
    sitemapTree.innerHTML = `<p class="empty-tab-hint">${t('emptyTabHint')}</p>`;
    return;
  }
  const urlStrings = rawUrls.map(u => typeof u === 'string' ? u : u.url);
  const tree = buildUrlTree(urlStrings);
  sitemapTree.innerHTML = '';
  
  function renderNode(node, level = 0) {
    const div = document.createElement('div');
    div.className = `tree-node tree-node-level-${Math.min(level, 5)}`;
    
    const line = document.createElement('div');
    line.className = 'tree-line';
    
    const indent = document.createElement('span');
    indent.className = 'tree-indent';
    if (level > 0) {
      indent.textContent = '│'.repeat(Math.min(level, 5)) + '├─';
    }
    
    const icon = document.createElement('span');
    icon.className = 'tree-icon';
    icon.innerHTML = level === 0 ? '📄' : '📄';
    
    const urlLink = document.createElement('a');
    urlLink.className = 'tree-url';
    urlLink.href = safeHref(node.url);
    urlLink.target = '_blank';
    urlLink.rel = 'noopener noreferrer';
    urlLink.textContent = node.path || node.url;
    
    const count = document.createElement('span');
    count.className = 'tree-count';
    count.textContent = node.children ? node.children.length : '';
    
    line.appendChild(indent);
    line.appendChild(icon);
    line.appendChild(urlLink);
    if (node.children && node.children.length > 0) {
      line.appendChild(count);
    }
    div.appendChild(line);
    sitemapTree.appendChild(div);
    
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => renderNode(child, level + 1));
    }
  }
  
  tree.forEach(root => renderNode(root, 0));
}

function buildUrlTree(urls) {
  const tree = [];
  const nodes = {};
  
  urls.forEach(url => {
    try {
      const urlObj = new URL(url);
      const parts = urlObj.pathname.split('/').filter(Boolean);
      
      let current = tree;
      let path = '';
      
      parts.forEach((part, idx) => {
        path += '/' + part;
        const fullUrl = urlObj.origin + path + (idx === parts.length - 1 ? urlObj.search : '');
        
        if (!nodes[fullUrl]) {
          const node = {
            url: fullUrl,
            path: '/' + part,
            children: []
          };
          nodes[fullUrl] = node;
          current.push(node);
        }
        
        current = nodes[fullUrl].children;
      });
    } catch {}
  });
  
  return tree;
}

function renderPageTypes() {
  if (!rawUrls.length) {
    pageTypesList.innerHTML = `<p class="empty-tab-hint">${t('emptyTabHint')}</p>`;
    return;
  }
  const types = {
    marketing: [],
    product: [],
    support: [],
    other: []
  };
  
  const urlStrings = rawUrls.map(u => typeof u === 'string' ? u : u.url);
  urlStrings.forEach(url => {
    const type = classifyPageType(url);
    types[type].push(url);
  });
  
  pageTypesList.innerHTML = '';
  
  Object.entries(types).forEach(([type, urls]) => {
    if (urls.length === 0) return;
    
    const group = document.createElement('div');
    group.className = 'type-group';
    
    const header = document.createElement('div');
    header.className = 'type-header';
    
    const label = document.createElement('div');
    label.className = 'type-label';
    const badge = document.createElement('span');
    badge.className = `type-badge ${type}`;
    badge.textContent = type;
    label.appendChild(badge);
    label.appendChild(document.createTextNode(t('pagesSuffix')));
    
    const count = document.createElement('span');
    count.className = 'type-count';
    count.textContent = t('pageCount', urls.length);
    
    header.appendChild(label);
    header.appendChild(count);
    
    const items = document.createElement('div');
    items.className = 'type-items';
    
    urls.slice(0, 20).forEach(url => {
      const item = document.createElement('div');
      item.className = 'type-item';
      
      const urlLink = document.createElement('a');
      urlLink.className = 'type-item-url';
      urlLink.href = safeHref(url);
      urlLink.target = '_blank';
      urlLink.rel = 'noopener noreferrer';
      urlLink.textContent = url;
      
      item.appendChild(urlLink);
      items.appendChild(item);
    });
    
    if (urls.length > 20) {
      const more = document.createElement('div');
      more.className = 'type-item';
      more.style.color = 'var(--text-muted)';
      more.style.fontSize = '12px';
      more.textContent = t('moreItems', urls.length - 20);
      items.appendChild(more);
    }
    
    group.appendChild(header);
    group.appendChild(items);
    pageTypesList.appendChild(group);
  });
}

function classifyPageType(url) {
  const lower = url.toLowerCase();
  const path = new URL(url).pathname.toLowerCase();
  
  if (path.includes('/blog') || path.includes('/news') || path.includes('/press') || 
      path.includes('/about') || path.includes('/contact') || path.includes('/pricing') ||
      path.includes('/features') || path.includes('/product')) {
    return 'marketing';
  }
  
  if (path.includes('/docs') || path.includes('/documentation') || path.includes('/guide') ||
      path.includes('/help') || path.includes('/support') || path.includes('/faq') ||
      path.includes('/tutorial')) {
    return 'support';
  }
  
  if (path.includes('/dashboard') || path.includes('/app') || path.includes('/account') ||
      path.includes('/settings') || path.includes('/admin')) {
    return 'product';
  }
  
  return 'other';
}

function renderFigmaReadiness() {
  if (!rawUrls.length) {
    figmaReadiness.innerHTML = `<p class="empty-tab-hint">${t('emptyTabHint')}</p>`;
    return;
  }
  const urlStrings = rawUrls.map(u => typeof u === 'string' ? u : u.url);
  const scores = urlStrings.map(url => {
    const metadata = urlMetadata[url] || {};
    const score = calculateFigmaScore(url, metadata);
    return { url, score };
  }).sort((a, b) => b.score - a.score);
  
  const ready = scores.filter(s => s.score >= 80).length;
  const partial = scores.filter(s => s.score >= 40 && s.score < 80).length;
  const notReady = scores.filter(s => s.score < 40).length;
  
  figmaReadiness.innerHTML = '';
  
  // Summary stats
  const summary = document.createElement('div');
  summary.className = 'readiness-summary';
  
  ['ready', 'partial', 'notReady'].forEach((type, idx) => {
    const stat = document.createElement('div');
    stat.className = 'readiness-stat';
    
    const label = document.createElement('div');
    label.className = 'readiness-stat-label';
    label.textContent = type === 'ready' ? t('figmaReady') : type === 'partial' ? t('figmaPartial') : t('figmaNeedsWork');
    
    const value = document.createElement('div');
    value.className = 'readiness-stat-value';
    value.textContent = type === 'ready' ? ready : type === 'partial' ? partial : notReady;
    
    stat.appendChild(label);
    stat.appendChild(value);
    summary.appendChild(stat);
  });
  
  figmaReadiness.appendChild(summary);
  
  // List
  const list = document.createElement('div');
  list.className = 'readiness-list';
  
  scores.slice(0, 30).forEach(({ url, score }) => {
    const item = document.createElement('div');
    item.className = 'readiness-item';
    
    const status = document.createElement('div');
    status.className = `readiness-status ${score >= 80 ? 'ready' : score >= 40 ? 'partial' : 'not-ready'}`;
    
    const urlLink = document.createElement('a');
    urlLink.className = 'readiness-url';
    urlLink.href = safeHref(url);
    urlLink.target = '_blank';
    urlLink.rel = 'noopener noreferrer';
    urlLink.textContent = url;
    
    const scoreEl = document.createElement('span');
    scoreEl.className = 'readiness-score';
    scoreEl.textContent = `${score}%`;
    
    item.appendChild(status);
    item.appendChild(urlLink);
    item.appendChild(scoreEl);
    list.appendChild(item);
  });
  
  figmaReadiness.appendChild(list);
}

function calculateFigmaScore(url, metadata) {
  let score = 50; // Base score
  
  try {
    const urlObj = new URL(url);
    
    // Clean URL (no query params) +10
    if (!urlObj.search) score += 10;
    
    // Short path +10
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    if (pathParts.length <= 2) score += 10;
    
    // No hash +5
    if (!urlObj.hash) score += 5;
    
    // Has metadata +15
    if (metadata && Object.keys(metadata).length > 0) score += 15;
    
    // Common page patterns +10
    const path = urlObj.pathname.toLowerCase();
    if (path === '/' || path.match(/^\/[a-z-]+$/)) score += 10;
    
  } catch {}
  
  return Math.min(100, score);
}

function renderImportance() {
  if (!rawUrls.length) {
    importanceList.innerHTML = `<p class="empty-tab-hint">${t('emptyTabHint')}</p>`;
    return;
  }
  const urlStrings = rawUrls.map(u => typeof u === 'string' ? u : u.url);
  const importances = urlStrings.map(url => {
    const metadata = urlMetadata[url] || {};
    const linkCount = metadata.linkCount || 0;
    return { url, linkCount };
  }).sort((a, b) => b.linkCount - a.linkCount);
  
  const maxLinks = Math.max(...importances.map(i => i.linkCount), 1);
  
  importanceList.innerHTML = '';
  
  importances.slice(0, 50).forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'importance-item';
    
    const rank = document.createElement('div');
    rank.className = 'importance-rank';
    rank.textContent = `#${idx + 1}`;
    
    const heat = document.createElement('div');
    heat.className = 'importance-heat';
    const bar = document.createElement('div');
    bar.className = 'importance-heat-bar';
    const percentage = (item.linkCount / maxLinks) * 100;
    bar.style.width = `${percentage}%`;
    
    if (percentage >= 70) bar.classList.add('high');
    else if (percentage >= 30) bar.classList.add('medium');
    else bar.classList.add('low');
    
    heat.appendChild(bar);
    
    const urlLink = document.createElement('a');
    urlLink.className = 'importance-url';
    urlLink.href = safeHref(item.url);
    urlLink.target = '_blank';
    urlLink.rel = 'noopener noreferrer';
    urlLink.textContent = item.url;
    
    const count = document.createElement('span');
    count.className = 'importance-count';
    count.textContent = item.linkCount;
    
    div.appendChild(rank);
    div.appendChild(heat);
    div.appendChild(urlLink);
    div.appendChild(count);
    importanceList.appendChild(div);
  });
}

// AI Insights Generation - Removed button, insights are auto-generated when URLs are collected

function renderAIInsights(insights, isCompetitor, lang = 'ko') {
  const isKorean = lang === 'ko';
  
  // Site Summary
  if (insights.pageDistribution) {
    const summaryGrid = document.getElementById('aiSiteSummaryContent');
    summaryGrid.innerHTML = `
      <div class="ai-summary-item">
        <div class="ai-summary-label">${isKorean ? '제품 페이지' : 'Product Pages'}</div>
        <div class="ai-summary-value">${insights.pageDistribution.product || 0}</div>
      </div>
      <div class="ai-summary-item">
        <div class="ai-summary-label">${isKorean ? '콘텐츠 페이지' : 'Content Pages'}</div>
        <div class="ai-summary-value">${insights.pageDistribution.content || 0}</div>
      </div>
      <div class="ai-summary-item">
        <div class="ai-summary-label">${isKorean ? '전환 페이지' : 'Conversion Pages'}</div>
        <div class="ai-summary-value">${insights.pageDistribution.conversion || 0}</div>
      </div>
      <div class="ai-summary-item">
        <div class="ai-summary-label">${isKorean ? '회사 페이지' : 'Company Pages'}</div>
        <div class="ai-summary-value">${insights.pageDistribution.company || 0}</div>
      </div>
    `;
    document.getElementById('aiSiteSummary').style.display = 'block';
  }

  // Show funnel, gaps, recommendations, content ideas
  if (insights.funnel) {
    document.getElementById('aiFunnelContent').textContent = insights.funnel;
    document.getElementById('aiFunnel').style.display = 'block';
  }

  if (insights.summary) {
    document.getElementById('aiSummaryContent').textContent = insights.summary;
    document.getElementById('aiSummary').style.display = 'block';
  }

  if (insights.gaps && insights.gaps.length > 0) {
    const list = document.getElementById('aiGapsList');
    list.innerHTML = insights.gaps.map(g => `<li>${escapeHtml(g)}</li>`).join('');
    document.getElementById('aiGaps').style.display = 'block';
  }

  if (insights.recommendations && insights.recommendations.length > 0) {
    const grid = document.getElementById('aiRecommendationsList');
    grid.innerHTML = insights.recommendations.slice(0, 5).map(rec => `
      <div class="ai-recommendation-card">
        <div class="ai-recommendation-title">${escapeHtml(rec.title || rec)}</div>
        ${rec.description ? `<div class="ai-recommendation-desc">${escapeHtml(rec.description)}</div>` : ''}
      </div>
    `).join('');
    document.getElementById('aiRecommendations').style.display = 'block';
  }

  if (insights.contentIdeas && insights.contentIdeas.length > 0) {
    const list = document.getElementById('aiContentIdeasList');
    list.innerHTML = insights.contentIdeas.map(idea => `<li>${escapeHtml(idea)}</li>`).join('');
    document.getElementById('aiContentIdeas').style.display = 'block';
  }
}

// Auto-select Design Pages
btnAutoSelectDesign.addEventListener('click', () => {
  if (!rawUrls.length) {
    showToast(t('noUrlsToSelect'), "error");
    return;
  }

  // Sort by importance (linkCount) descending
  const sorted = [...rawUrls].map(u => ({
    url: typeof u === 'string' ? u : u.url,
    importance: urlMetadata[u.url]?.linkCount || 0,
    figmaScore: calculateFigmaScore(typeof u === 'string' ? u : u.url, urlMetadata[u.url] || {})
  })).sort((a, b) => {
    // Prioritize by importance, then figma score
    if (b.importance !== a.importance) return b.importance - a.importance;
    return b.figmaScore - a.figmaScore;
  });

  // Select top 10
  const top10 = sorted.slice(0, 10).map(u => u.url);
  
  // Clear all selections first
  document.querySelectorAll('.row-check').forEach(cb => cb.checked = false);
  
  // Select top 10
  top10.forEach(url => {
    const checkbox = document.querySelector(`.row-check[data-url="${escapeAttr(url)}"]`);
    if (checkbox) checkbox.checked = true;
  });

  updateCheckAll();
  updateSelectionInfo();
  const lang = window.currentLang || 'ko';
  const toastMsg = lang === 'ko' 
    ? `상위 ${top10.length}개 디자인 페이지 선택됨` 
    : `Selected top ${top10.length} design pages`;
  showToast(toastMsg, "success");
  
  // Scroll to table
  tableSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Generate Content Strategy
btnGenerateContentStrategy.addEventListener('click', async () => {
  if (!rawUrls.length || !currentDomain) {
    showToast(t('toastCollectFirst'), "error");
    return;
  }
  const lang = window.currentLang || 'ko';
  btnGenerateContentStrategy.disabled = true;
  btnGenerateContentStrategy.textContent = t('generating');
  const aiOverlay = document.getElementById('aiLoadingOverlay');
  if (aiOverlay) {
    aiOverlay.removeAttribute('hidden');
    aiOverlay.setAttribute('aria-busy', 'true');
  }

  try {
    const response = await fetch('/api/content-strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: currentDomain,
        urls: rawUrls,
        language: lang
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate content strategy');
    }

    const strategy = await response.json();
    renderContentStrategy(strategy);
    document.getElementById('aiContentStrategy').style.display = 'block';
    showToast(t('contentStrategySuccess'), "success");
  } catch (err) {
    showToast(t('contentStrategyError') + (err.message || ''), "error");
  } finally {
    if (aiOverlay) {
      aiOverlay.setAttribute('hidden', '');
      aiOverlay.setAttribute('aria-busy', 'false');
    }
    btnGenerateContentStrategy.disabled = false;
    btnGenerateContentStrategy.textContent = t('generateContentStrategy');
  }
});

function renderContentStrategy(strategy) {
  const list = document.getElementById('aiContentStrategyList');
  if (strategy.recommendedPages && strategy.recommendedPages.length > 0) {
    list.innerHTML = strategy.recommendedPages.map(page => `
      <div class="ai-content-strategy-item">
        <div class="ai-content-strategy-header">
          <span class="ai-content-strategy-title">${escapeHtml(page.title || 'Untitled')}</span>
          <span class="ai-content-strategy-type">${escapeHtml(page.type || 'page')}</span>
        </div>
        <div class="ai-content-strategy-reason">${escapeHtml(page.reason || '')}</div>
      </div>
    `).join('');
  } else {
    list.innerHTML = `<p style="color:var(--text-muted);">${t('noRecommendations')}</p>`;
  }
}

// Generate Landing Page Insights
btnGenerateLandingInsights.addEventListener('click', async () => {
  if (!rawUrls.length) {
    showToast(t('toastCollectFirst'), "error");
    return;
  }
  const lang = window.currentLang || 'ko';
  btnGenerateLandingInsights.disabled = true;
  btnGenerateLandingInsights.textContent = t('analyzing');
  const aiOverlayLanding = document.getElementById('aiLoadingOverlay');
  if (aiOverlayLanding) {
    aiOverlayLanding.removeAttribute('hidden');
    aiOverlayLanding.setAttribute('aria-busy', 'true');
  }

  try {
    const response = await fetch('/api/landing-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        urls: rawUrls,
        language: lang
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to analyze landing pages');
    }

    const insights = await response.json();
    renderLandingInsights(insights);
    document.getElementById('aiLandingInsights').style.display = 'block';
    showToast(t('landingSuccess'), "success");
  } catch (err) {
    showToast(t('landingError') + (err.message || ''), "error");
  } finally {
    if (aiOverlayLanding) {
      aiOverlayLanding.setAttribute('hidden', '');
      aiOverlayLanding.setAttribute('aria-busy', 'false');
    }
    btnGenerateLandingInsights.disabled = false;
    btnGenerateLandingInsights.textContent = t('analyzeLandingPages');
  }
});

function renderLandingInsights(insights) {
  const content = document.getElementById('aiLandingInsightsContent');
  const lang = window.currentLang || 'ko';
  const isKorean = lang === 'ko';
  let html = '';

  if (insights.ctaIssues && insights.ctaIssues.length > 0) {
    html += `
      <div class="ai-landing-section">
        <h4>${isKorean ? 'CTA 문제점' : 'CTA Issues'}</h4>
        <ul class="ai-list">
          ${insights.ctaIssues.map(issue => `<li>${escapeHtml(issue)}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (insights.pricingVisibility) {
    html += `
      <div class="ai-landing-section">
        <h4>${isKorean ? '가격 가시성' : 'Pricing Visibility'}</h4>
        <p>${escapeHtml(insights.pricingVisibility)}</p>
      </div>
    `;
  }

  if (insights.contactDepth) {
    html += `
      <div class="ai-landing-section">
        <h4>${isKorean ? '연락처 깊이' : 'Contact Depth'}</h4>
        <p>${escapeHtml(insights.contactDepth)}</p>
      </div>
    `;
  }

  if (insights.suggestions && insights.suggestions.length > 0) {
    html += `
      <div class="ai-landing-section">
        <h4>${isKorean ? '제안사항' : 'Suggestions'}</h4>
        <ul class="ai-list">
          ${insights.suggestions.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  const noInsightsMsg = isKorean ? '인사이트가 없습니다.' : 'No insights available.';
  content.innerHTML = html || `<p style="color:var(--text-muted);">${noInsightsMsg}</p>`;
}

btnRunQA.addEventListener('click', () => {
  if (!rawUrls.length) {
    showToast(t('toastCollectFirst'), "error");
    return;
  }
  btnRunQA.disabled = true;
  btnRunQA.textContent = t('checking');
  setTimeout(() => {
    const qaResults = runQACheck();
    renderQAResults(qaResults);
    document.getElementById('aiQAMonitor').style.display = 'block';
    showToast(t('toastQaComplete'), "success");
    btnRunQA.disabled = false;
    btnRunQA.textContent = t('runQACheck');
  }, 500);
});

function runQACheck() {
  const urlStrings = rawUrls.map(u => typeof u === 'string' ? u : u.url);
  const results = { healthy: [], review: [] };
  urlStrings.forEach(url => {
    try {
      const urlObj = new URL(url);
      const hasQuery = !!urlObj.search;
      const pathDepth = urlObj.pathname.split('/').filter(Boolean).length;
      const isLong = url.length > 100;
      if (hasQuery || pathDepth > 4 || isLong) {
        results.review.push({
          url,
          issues: [
            hasQuery ? t('qaIssueQuery') : null,
            pathDepth > 4 ? t('qaIssueDeepPath', pathDepth) : null,
            isLong ? t('qaIssueLongUrl') : null
          ].filter(Boolean)
        });
      } else {
        results.healthy.push({ url });
      }
    } catch (e) {
      results.review.push({ url, issues: [t('qaIssueInvalidUrl')] });
    }
  });
  return results;
}

function renderQAResults(results) {
  const content = document.getElementById('aiQAContent');
  let html = `
    <div class="ai-qa-summary">
      <div class="ai-qa-stat">
        <div class="ai-qa-stat-label">${t('healthy')}</div>
        <div class="ai-qa-stat-value healthy">${results.healthy.length}</div>
      </div>
      <div class="ai-qa-stat">
        <div class="ai-qa-stat-label">${t('reviewNeeded')}</div>
        <div class="ai-qa-stat-value review">${results.review.length}</div>
      </div>
    </div>
  `;
  if (results.review.length > 0) {
    html += `
      <div class="ai-qa-review-list">
        <h4>${t('pagesNeedingReview')}</h4>
        ${results.review.slice(0, 20).map(item => `
          <div class="ai-qa-item">
            <a href="${escapeAttr(safeHref(item.url))}" target="_blank" rel="noopener noreferrer" class="ai-qa-url">${escapeHtml(item.url)}</a>
            <div class="ai-qa-issues">
              ${item.issues.map(issue => `<span class="ai-qa-issue">${escapeHtml(issue)}</span>`).join('')}
            </div>
          </div>
        `).join('')}
        ${results.review.length > 20 ? `<p style="color:var(--text-muted);margin-top:var(--space-md);">${t('moreItems', results.review.length - 20)}</p>` : ''}
      </div>
    `;
  }
  content.innerHTML = html;
}

// Note: Content strategy and QA sections are shown when their respective buttons are clicked
// They are hidden by default and only shown when content is generated

// Initial empty state
if (!rawUrls.length) {
  emptyState.style.display = "block";
}

// Service Worker registration for offline support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js', { scope: './' }).catch(() => {});
}
