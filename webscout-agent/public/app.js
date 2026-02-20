// DOM Elements
const baseEl = document.getElementById("base");
const depthEl = document.getElementById("depth");
const maxEl = document.getElementById("max");
const btnStart = document.getElementById("btnStart");
const btnStartSpinner = document.getElementById("btnStartSpinner");
const btnStartText = document.getElementById("btnStartText");
const progressStatus = document.getElementById("progressStatus");
const progressText = document.getElementById("progressText");
const filterSection = document.getElementById("filterSection");
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
const insightContents = document.querySelectorAll(".insight-content");
const sitemapTree = document.getElementById("sitemapTree");
const pageTypesList = document.getElementById("pageTypesList");
const figmaReadiness = document.getElementById("figmaReadiness");
const importanceList = document.getElementById("importanceList");

// State
let rawUrls = [];
let filteredUrls = [];
let currentSource = null;
let currentSort = { field: null, direction: 'asc' };
let currentPage = 1;
let startTime = null;
let excludedCount = 0;
let urlMetadata = {}; // { url: { links: [], type, figmaScore, linkCount } }
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
    searchCount.textContent = `${filteredUrls.length} results`;
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
  kpiSource.textContent = currentSource === "sitemap" ? "Sitemap" : currentSource === "crawl" ? "Crawl" : "-";
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
    selectionInfo.textContent = `${selected} URL${selected === 1 ? '' : 's'} selected`;
    selectionInfo.style.display = 'inline';
    btnClearSelection.style.display = 'inline-flex';
  } else {
    selectionInfo.style.display = 'none';
    btnClearSelection.style.display = 'none';
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("Copied to clipboard", "success");
  }).catch(() => {
    showToast("Copy failed", "error");
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
  
  tableBody.innerHTML = paginated.map((r) => {
    return `<tr tabindex="0" role="row">
      <td><input type="checkbox" class="row-check" data-url="${escapeAttr(r.url)}" aria-label="Select"></td>
      <td class="url-cell">
        <a href="${escapeHtml(r.url)}" target="_blank" rel="noopener" class="url-link" title="${escapeAttr(r.url)}">
          <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;">${escapeHtml(r.url)}</span>
          <button class="copy-btn" data-url="${escapeAttr(r.url)}" aria-label="Copy" title="Copy to clipboard">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </button>
        </a>
      </td>
      <td style="text-align:right;"><span class="depth-badge">${r.pathDepth}</span></td>
      <td>${r.hasQuery ? '<span style="color:#10B981;font-weight:500;">Yes</span>' : '<span style="color:#9CA3AF;">-</span>'}</td>
      <td>${r.external ? '<span style="color:#EF4444;font-weight:500;">Yes</span>' : '<span style="color:#9CA3AF;">-</span>'}</td>
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
    showToast("링크를 입력해주세요", "error");
    inputHelper.textContent = "웹사이트 링크를 입력해주세요.";
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
  btnStartText.textContent = 'Collecting…';
  updateProgressStatus("Discovering sitemap…");
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
              updateProgressStatus("Discovering sitemap…");
            } else if (obj.msg.includes("crawl") || obj.msg.includes("Fallback")) {
              updateProgressStatus("Crawling internal links…");
            }
          } else if (obj.type === "done") {
            rawUrls = obj.urls || [];
            currentSource = obj.source || null;
            urlMetadata = obj.metadata || {};
            updateProgressStatus(null);
            applyFilters();
            updateKPI();
            updateInsights();
            tableSection.style.display = "block";
            insightsSection.style.display = "block";
            if (rawUrls.length === 0) {
              emptyState.style.display = "block";
            }
            showToast(`${rawUrls.length} URL${rawUrls.length === 1 ? '' : 's'} collected`, "success");
          } else if (obj.type === "error") {
            updateProgressStatus(null);
            errorTitle.textContent = "Discovery failed";
            errorMessage.textContent = obj.msg;
            errorState.style.display = "block";
            showToast("Discovery error occurred", "error");
          }
        } catch {}
      }
    }
    if (buf.trim()) {
      try {
        const obj = JSON.parse(buf);
        if (obj.type === "done") {
          rawUrls = obj.urls || [];
          currentSource = obj.source || null;
          urlMetadata = obj.metadata || {};
          updateProgressStatus(null);
          applyFilters();
          updateKPI();
          updateInsights();
          tableSection.style.display = "block";
          insightsSection.style.display = "block";
          if (rawUrls.length === 0) {
            emptyState.style.display = "block";
          }
          showToast(`${rawUrls.length} URLs discovered`, "success");
        }
      } catch {}
    }
  } catch (err) {
    updateProgressStatus(null);
    errorTitle.textContent = "Discovery failed";
    errorMessage.textContent = err.message;
    errorState.style.display = "block";
    showToast("Discovery failed: " + err.message, "error");
  } finally {
    btnStart.disabled = false;
    btnStartSpinner.style.display = 'none';
    btnStartText.textContent = 'Collect URLs';
  }
});

btnTxt.addEventListener("click", () => {
  const urls = getSelectedUrls();
  if (!urls.length) {
    showToast("No URLs selected", "error");
    return;
  }
  download(urls.join("\n") + "\n", "urls.txt");
  showToast(`${urls.length} URLs downloaded`, "success");
});

btnCsv.addEventListener("click", () => {
  const urls = getDisplayUrls();
  if (!urls.length) {
    showToast("No URLs to export", "error");
    return;
  }
  const csv = "url\n" + urls.map(u => `"${u.replace(/"/g, '""')}"`).join("\n") + "\n";
  download(csv, "urls.csv");
  showToast(`${urls.length} URLs downloaded`, "success");
});

// Initialize filter chip states
if (allowWwwAliasEl.checked) {
  document.getElementById('wwwChip').classList.add('active');
}

// Tab switching
insightTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    
    // Update active states
    insightTabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    
    // Show/hide content
    insightContents.forEach(content => {
      content.classList.remove('active');
      content.style.display = 'none';
    });
    
    const targetContent = document.getElementById(`insight${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
    if (targetContent) {
      targetContent.classList.add('active');
      targetContent.style.display = 'block';
    }
  });
});

// Insights rendering functions
function updateInsights() {
  if (!rawUrls.length) return;
  
  renderSitemapTree();
  renderPageTypes();
  renderFigmaReadiness();
  renderImportance();
}

function renderSitemapTree() {
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
    urlLink.href = node.url;
    urlLink.target = '_blank';
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
    label.appendChild(document.createTextNode(' Pages'));
    
    const count = document.createElement('span');
    count.className = 'type-count';
    count.textContent = `${urls.length} page${urls.length === 1 ? '' : 's'}`;
    
    header.appendChild(label);
    header.appendChild(count);
    
    const items = document.createElement('div');
    items.className = 'type-items';
    
    urls.slice(0, 20).forEach(url => {
      const item = document.createElement('div');
      item.className = 'type-item';
      
      const urlLink = document.createElement('a');
      urlLink.className = 'type-item-url';
      urlLink.href = url;
      urlLink.target = '_blank';
      urlLink.textContent = url;
      
      item.appendChild(urlLink);
      items.appendChild(item);
    });
    
    if (urls.length > 20) {
      const more = document.createElement('div');
      more.className = 'type-item';
      more.style.color = 'var(--text-muted)';
      more.style.fontSize = '12px';
      more.textContent = `+ ${urls.length - 20} more...`;
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
    label.textContent = type === 'ready' ? 'Ready' : type === 'partial' ? 'Partial' : 'Needs Work';
    
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
    urlLink.href = url;
    urlLink.target = '_blank';
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
    urlLink.href = item.url;
    urlLink.target = '_blank';
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

// Initial empty state
if (!rawUrls.length) {
  emptyState.style.display = "block";
}
