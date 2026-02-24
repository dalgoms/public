/**
 * TIMBLO Modal Module
 * 모달 관련 로직
 */

// Delete action state
let pendingDeleteItem = null;
let pendingDeleteType = null;
let pendingDeleteFolderId = null;

/**
 * 시스템 모달 표시
 * @param {string} message - 메시지
 * @param {string} type - success | warning | error | info
 * @param {string} title - 제목
 */
function showSystemModal(message, type = 'success', title = '알림') {
  const modal = document.getElementById('systemModal');
  const iconEl = document.getElementById('systemModalIcon');
  const titleEl = document.getElementById('systemModalTitle');
  const messageEl = document.getElementById('systemModalMessage');
  
  // Set icon based on type
  iconEl.className = 'system-modal-icon ' + type;
  
  const icons = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };
  
  iconEl.innerHTML = icons[type] || icons.info;
  titleEl.textContent = title;
  messageEl.textContent = message;
  modal.classList.add('active');
}

/**
 * 시스템 모달 닫기
 */
function closeSystemModal() {
  document.getElementById('systemModal').classList.remove('active');
}

/**
 * 확인 모달 표시 (삭제 등)
 * @param {string} message - 메시지
 * @param {string} btnText - 확인 버튼 텍스트
 * @param {string} title - 제목
 */
function showConfirmModal(message, btnText = '삭제', title = '확인') {
  document.getElementById('confirmModalTitle').textContent = title;
  document.getElementById('confirmModalMessage').textContent = message;
  document.getElementById('confirmModalBtn').textContent = btnText;
  document.getElementById('confirmModal').classList.add('active');
}

/**
 * 확인 모달 닫기
 */
function closeConfirmModal() {
  document.getElementById('confirmModal').classList.remove('active');
  pendingDeleteItem = null;
  pendingDeleteType = null;
}

/**
 * 확인 액션 실행
 */
function confirmAction() {
  closeConfirmModal();
  
  switch (pendingDeleteType) {
    case 'action':
      if (pendingDeleteItem) {
        pendingDeleteItem.style.opacity = '0';
        pendingDeleteItem.style.transform = 'translateX(-100%)';
        setTimeout(() => {
          pendingDeleteItem.remove();
          actionCount--;
          updateActionCount();
          showSystemModal('할 일이 삭제되었습니다', 'success', '삭제 완료');
          checkEmptyState();
          pendingDeleteItem = null;
        }, 200);
      }
      break;
      
    case 'meeting':
      if (pendingDeleteItem) {
        pendingDeleteItem.style.opacity = '0';
        pendingDeleteItem.style.transform = 'translateX(-100%)';
        setTimeout(() => {
          pendingDeleteItem.remove();
          showSystemModal('기록이 삭제되었습니다', 'success', '삭제 완료');
          pendingDeleteItem = null;
        }, 200);
      }
      break;
      
    case 'folder':
      if (pendingDeleteItem && pendingDeleteFolderId) {
        const fileCount = folderFiles[pendingDeleteFolderId]?.length || 0;
        if (fileCount > 0) {
          folderFiles[pendingDeleteFolderId]?.forEach(file => restoreFileToList(file));
        }
        pendingDeleteItem.remove();
        delete folderFiles[pendingDeleteFolderId];
        showSystemModal('폴더가 삭제되었습니다', 'success', '삭제 완료');
        updateFolderAddCardVisibility();
        pendingDeleteItem = null;
        pendingDeleteFolderId = null;
      }
      break;
      
    case 'schedule':
      if (pendingDeleteItem) {
        pendingDeleteItem.remove();
        showSystemModal('일정이 삭제되었습니다', 'success', '삭제 완료');
        pendingDeleteItem = null;
      }
      break;
  }
}

/**
 * 토스트 메시지 (시스템 모달로 대체)
 */
function showToast(message, type = 'success', title = '알림') {
  showSystemModal(message, type, title);
}

// Export functions
window.showSystemModal = showSystemModal;
window.closeSystemModal = closeSystemModal;
window.showConfirmModal = showConfirmModal;
window.closeConfirmModal = closeConfirmModal;
window.confirmAction = confirmAction;
window.showToast = showToast;

