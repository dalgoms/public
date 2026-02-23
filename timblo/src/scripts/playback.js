/**
 * TIMBLO Playback Module
 * 재생 기능 관련 로직
 */

// State
let isPlaying = false;
let currentPlaybackTime = 0;
let playbackSpeed = 1.0;
let animationFrameId = null;
let lastTimestamp = 0;

const TOTAL_DURATION = 32 * 60; // 32분 (초 단위)

/**
 * 재생/정지 토글
 */
function togglePlay() {
  isPlaying = !isPlaying;
  const playBtn = document.getElementById('playBtn');
  const playIcon = document.getElementById('playIcon');
  
  if (isPlaying) {
    playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
    lastTimestamp = performance.now();
    animatePlayback(lastTimestamp);
  } else {
    playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
    cancelAnimationFrame(animationFrameId);
  }
}

/**
 * requestAnimationFrame 기반 부드러운 재생 애니메이션
 */
function animatePlayback(timestamp) {
  if (!isPlaying) return;
  
  const elapsed = timestamp - lastTimestamp;
  lastTimestamp = timestamp;
  
  // 경과 시간만큼 재생 위치 증가 (속도 반영)
  currentPlaybackTime += (elapsed / 1000) * playbackSpeed;
  
  // 끝에 도달하면 정지
  if (currentPlaybackTime >= TOTAL_DURATION) {
    currentPlaybackTime = TOTAL_DURATION;
    togglePlay();
    showToast('재생이 완료되었습니다');
    return;
  }
  
  updateTimelineUI(currentPlaybackTime);
  updateCurrentSpeaker(currentPlaybackTime);
  
  animationFrameId = requestAnimationFrame(animatePlayback);
}

/**
 * 타임라인 UI 업데이트
 */
function updateTimelineUI(time) {
  const progress = (time / TOTAL_DURATION) * 100;
  const progressBar = document.getElementById('timelineProgress');
  const handle = document.getElementById('timelineHandle');
  const currentTimeEl = document.getElementById('currentTime');
  
  if (progressBar) progressBar.style.width = progress + '%';
  if (handle) handle.style.left = progress + '%';
  if (currentTimeEl) currentTimeEl.textContent = formatTime(time);
}

/**
 * 시간 포맷 (초 → mm:ss)
 */
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return [m, s].map(n => n.toString().padStart(2, '0')).join(':');
}

/**
 * 현재 화자 하이라이트
 */
function updateCurrentSpeaker(time) {
  const messages = document.querySelectorAll('.meeting-doc-message');
  messages.forEach(msg => {
    const msgTime = parseTimeToSeconds(msg.dataset.time || '0:00');
    const nextMsg = msg.nextElementSibling;
    const nextMsgTime = nextMsg ? parseTimeToSeconds(nextMsg.dataset.time || '99:99') : TOTAL_DURATION;
    
    if (time >= msgTime && time < nextMsgTime) {
      msg.classList.add('current');
      msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      msg.classList.remove('current');
    }
  });
}

/**
 * 시간 문자열을 초로 변환
 */
function parseTimeToSeconds(timeStr) {
  const parts = timeStr.split(':').map(Number);
  return parts[0] * 60 + parts[1];
}

/**
 * 특정 위치로 이동
 */
function seekToPosition(event) {
  const bar = document.getElementById('timelineBar');
  const rect = bar.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const progress = Math.max(0, Math.min(1, x / rect.width));
  
  currentPlaybackTime = progress * TOTAL_DURATION;
  updateTimelineUI(currentPlaybackTime);
  updateCurrentSpeaker(currentPlaybackTime);
}

/**
 * 앞으로 건너뛰기
 */
function skipForward(seconds = 10) {
  currentPlaybackTime = Math.min(TOTAL_DURATION, currentPlaybackTime + seconds);
  updateTimelineUI(currentPlaybackTime);
  updateCurrentSpeaker(currentPlaybackTime);
}

/**
 * 뒤로 건너뛰기
 */
function skipBackward(seconds = 10) {
  currentPlaybackTime = Math.max(0, currentPlaybackTime - seconds);
  updateTimelineUI(currentPlaybackTime);
  updateCurrentSpeaker(currentPlaybackTime);
}

/**
 * 재생 속도 변경
 */
function toggleSpeed() {
  const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
  const currentIndex = speeds.indexOf(playbackSpeed);
  playbackSpeed = speeds[(currentIndex + 1) % speeds.length];
  
  document.querySelector('.speed-btn').textContent = playbackSpeed + 'x';
  showToast(`재생 속도: ${playbackSpeed}x`);
}

/**
 * 드래그 시작
 */
function startDrag(event) {
  event.preventDefault();
  
  const handleDrag = (e) => {
    const bar = document.getElementById('timelineBar');
    const rect = bar.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const progress = Math.max(0, Math.min(1, x / rect.width));
    
    currentPlaybackTime = progress * TOTAL_DURATION;
    updateTimelineUI(currentPlaybackTime);
  };
  
  const stopDrag = () => {
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('touchend', stopDrag);
    updateCurrentSpeaker(currentPlaybackTime);
  };
  
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchmove', handleDrag);
  document.addEventListener('touchend', stopDrag);
}

// Export functions
window.togglePlay = togglePlay;
window.seekToPosition = seekToPosition;
window.skipForward = skipForward;
window.skipBackward = skipBackward;
window.toggleSpeed = toggleSpeed;
window.startDrag = startDrag;

