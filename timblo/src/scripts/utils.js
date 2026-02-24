/**
 * TIMBLO Utility Functions
 * 공통 유틸리티 함수
 */

/**
 * 날짜 포맷 (YYYY-MM-DD → MM월 DD일)
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
}

/**
 * 시간 포맷 (초 → HH:MM:SS)
 */
function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  if (h > 0) {
    return [h, m, s].map(n => n.toString().padStart(2, '0')).join(':');
  }
  return [m, s].map(n => n.toString().padStart(2, '0')).join(':');
}

/**
 * 상대 시간 (방금, 5분 전, 어제 등)
 */
function getRelativeTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return '방금';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays === 1) return '어제';
  if (diffDays < 7) return `${diffDays}일 전`;
  return formatDate(dateStr);
}

/**
 * 기한 임박 여부 확인 (3일 이내)
 */
function isDueSoon(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((date - now) / 86400000);
  return diffDays >= 0 && diffDays <= 3;
}

/**
 * 과거 날짜인지 확인
 */
function isPastDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * 오늘 날짜인지 확인
 */
function isToday(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * 디바운스 함수
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 스로틀 함수
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * DOM 요소 생성 헬퍼
 */
function createElement(tag, className, innerHTML) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}

/**
 * 쿼리 파라미터 파싱
 */
function getQueryParams() {
  const params = {};
  const searchParams = new URLSearchParams(window.location.search);
  for (const [key, value] of searchParams) {
    params[key] = value;
  }
  return params;
}

/**
 * 로컬 스토리지 헬퍼
 */
const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  },
  
  remove(key) {
    localStorage.removeItem(key);
  }
};

// Export functions
window.formatDate = formatDate;
window.formatDuration = formatDuration;
window.getRelativeTime = getRelativeTime;
window.isDueSoon = isDueSoon;
window.isPastDate = isPastDate;
window.isToday = isToday;
window.debounce = debounce;
window.throttle = throttle;
window.createElement = createElement;
window.storage = storage;

