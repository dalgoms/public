/**
 * TIMBLO Recording Module
 * 녹음 기능 관련 로직
 */

// State
let isRecording = false;
let isPaused = false;
let recordingSeconds = 0;
let recordingTimer = null;

/**
 * 녹음 시작/종료 토글
 */
function toggleRecording() {
  isRecording = !isRecording;
  const headerBadge = document.getElementById('headerRecordingBadge');
  const navRecordBtn = document.querySelector('.nav-record-btn');
  
  if (isRecording) {
    if (navRecordBtn) navRecordBtn.classList.add('recording');
    headerBadge.classList.add('active');
    startRecordingTimer();
    showPage('recording');
    showSystemModal('녹음이 시작되었습니다', 'success', '녹음 시작');
  } else {
    if (navRecordBtn) navRecordBtn.classList.remove('recording');
    headerBadge.classList.remove('active');
    stopRecordingTimer();
    showPage('home');
  }
}

/**
 * 녹음 타이머 시작
 */
function startRecordingTimer() {
  recordingTimer = setInterval(() => {
    if (!isPaused) {
      recordingSeconds++;
      updateRecordingTime();
    }
  }, 1000);
}

/**
 * 녹음 타이머 정지
 */
function stopRecordingTimer() {
  clearInterval(recordingTimer);
  recordingSeconds = 0;
  updateRecordingTime();
}

/**
 * 녹음 타이머 재개
 */
function resumeRecordingTimer() {
  // Timer continues from where it was
}

/**
 * 녹음 시간 표시 업데이트
 */
function updateRecordingTime() {
  const m = Math.floor(recordingSeconds / 60);
  const s = recordingSeconds % 60;
  const timeStr = [m, s].map(n => n.toString().padStart(2, '0')).join(':');
  
  const timerEl = document.getElementById('recordingTimer');
  if (timerEl) timerEl.textContent = timeStr;
  
  document.getElementById('headerRecordingTime').textContent = timeStr;
}

/**
 * 녹음 종료 확인 모달 표시
 */
function stopRecording() {
  document.getElementById('stopConfirmModal').classList.add('active');
}

/**
 * 녹음 종료 확인
 */
function confirmStopRecording() {
  document.getElementById('stopConfirmModal').classList.remove('active');
  isRecording = false;
  isPaused = false;
  
  const navRecordBtn = document.querySelector('.nav-record-btn');
  if (navRecordBtn) navRecordBtn.classList.remove('recording');
  
  document.getElementById('headerRecordingBadge').classList.remove('active');
  
  const waveform = document.getElementById('recordingWaveform');
  if (waveform) waveform.style.opacity = '1';
  
  resetPauseButton();
  stopRecordingTimer();
  showPage('home');
  showSystemModal('녹음이 저장되었습니다', 'success', '녹음 완료');
}

/**
 * 녹음 종료 취소
 */
function cancelStopRecording() {
  document.getElementById('stopConfirmModal').classList.remove('active');
}

/**
 * 일시정지 토글
 */
function togglePause() {
  isPaused = !isPaused;
  const pauseBtn = document.getElementById('pauseBtn');
  const pauseIcon = document.getElementById('pauseIcon');
  const playIcon = document.getElementById('playIcon');
  const recordingLabel = document.getElementById('recordingLabel');
  const headerBadge = document.getElementById('headerRecordingBadge');
  const waveform = document.getElementById('recordingWaveform');
  
  if (isPaused) {
    pauseBtn.classList.add('paused');
    pauseIcon.style.display = 'none';
    playIcon.style.display = 'block';
    recordingLabel.textContent = '일시정지됨';
    headerBadge.classList.add('paused');
    waveform.style.opacity = '0.3';
    stopRecordingTimer();
    showSystemModal('녹음이 일시정지되었습니다', 'warning', '일시정지');
  } else {
    pauseBtn.classList.remove('paused');
    pauseIcon.style.display = 'block';
    playIcon.style.display = 'none';
    recordingLabel.textContent = '녹음 중';
    headerBadge.classList.remove('paused');
    waveform.style.opacity = '1';
    resumeRecordingTimer();
    showSystemModal('녹음이 재개되었습니다', 'success', '녹음 재개');
  }
}

/**
 * 일시정지 버튼 초기화
 */
function resetPauseButton() {
  isPaused = false;
  const pauseBtn = document.getElementById('pauseBtn');
  const pauseIcon = document.getElementById('pauseIcon');
  const playIcon = document.getElementById('playIcon');
  const recordingLabel = document.getElementById('recordingLabel');
  
  if (pauseBtn) {
    pauseBtn.classList.remove('paused');
    pauseIcon.style.display = 'block';
    playIcon.style.display = 'none';
    recordingLabel.textContent = '녹음 중';
  }
}

// Export functions
window.toggleRecording = toggleRecording;
window.stopRecording = stopRecording;
window.confirmStopRecording = confirmStopRecording;
window.cancelStopRecording = cancelStopRecording;
window.togglePause = togglePause;

