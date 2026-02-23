# TIMBLO - AI 회의록 서비스 설계 문서

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [Information Architecture (IA)](#information-architecture-ia)
3. [기능 명세서](#기능-명세서)
4. [UI/UX 설계 원칙](#uiux-설계-원칙)
5. [기술 스택](#기술-스택)
6. [설계 과정 및 이슈 해결](#설계-과정-및-이슈-해결)
7. [로드맵](#로드맵)
8. [리팩토링 제안](#리팩토링-제안)
9. [경쟁사 분석](#경쟁사-분석)
10. [부록](#부록)

---

## 프로젝트 개요

### 비전
**TIMBLO**는 AI 기반 회의록 자동 생성 서비스로, 보안 + LLM + 화자분리 기술을 핵심 강점으로 하는 B2C/B2B 하이브리드 솔루션입니다.

### 핵심 가치
- 🔒 **완벽한 보안**: 엔터프라이즈급 데이터 암호화
- 🤖 **AI 요약**: LLM 기반 핵심 내용 자동 추출
- 👥 **화자 분리**: 실시간 화자 인식 및 분리
- 📋 **할 일 자동 추출**: 회의 내용에서 액션 아이템 자동 생성

### 타겟 사용자
| 구분 | 페르소나 | 주요 니즈 |
|------|---------|----------|
| B2C Light | 개인 프리랜서, 학생 | 간편한 녹음, 빠른 요약 |
| B2C Pro | 팀 리더, PM | 팀 공유, 고급 AI 분석 |
| B2B Enterprise | 기업 | 보안, 감사 로그, SSO |

---

## Information Architecture (IA)

### 네비게이션 구조

```
TIMBLO
├── 🏠 홈 (Home)
│   ├── Pro 업그레이드 배너
│   ├── CTA 버튼 (AI 생성, 파일, 유튜브, PDF)
│   ├── 오늘 할 일 (최대 4개)
│   ├── 최근 기록 (최대 4개)
│   └── 내 일정 (최대 3개)
│
├── 📅 캘린더 (Calendar)
│   ├── 월간 캘린더 뷰
│   ├── 일정 추가 (호버 시 + 버튼)
│   ├── 일정 상세 모달
│   └── 오늘로 이동
│
├── 🎤 녹음 (Recording) - 하단 중앙 FAB
│   ├── 녹음 시작
│   ├── 일시정지/재개
│   ├── 종료
│   └── 실시간 타이머
│
├── 📁 내 작업 (My Work)
│   ├── 새 폴더 (최대 3개)
│   ├── 전체 파일 (최대 15개 표시)
│   ├── 정렬 (전체/최신순/오래된순)
│   └── 드래그앤드롭 폴더 이동
│
├── 🤖 AI 에이전트 (AI Agent)
│   ├── 추천 질문
│   ├── 채팅 인터페이스
│   └── 실시간 응답
│
├── ⚙️ 설정 (Settings) - 헤더 삼점 메뉴
│   ├── 계정 정보
│   ├── 요금제 (Light/Pro/Enterprise)
│   ├── 녹음 설정 (Pro)
│   ├── 알림 설정 (Pro)
│   └── 앱 설정 (Pro)
│
└── 📄 파일 상세 (File Detail)
    ├── 오디오 플레이어
    ├── 탭: 원본 기록 / 할 일 / 알림
    ├── 화자별 대화 기록
    ├── 제안된 할 일
    └── 캘린더/알림/공유 액션
```

### 페이지별 상세 구조

#### 홈 화면
```
┌─────────────────────────────────────┐
│ TIMBLO              🔍  ⋮          │ ← 헤더 (검색, 설정)
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Pro 업그레이드                   │ │ ← 배너
│ │ 완벽한 보안 · AI 요약 · 팀 공유  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌───────┬───────┬───────┬───────┐  │
│ │AI 생성│ 파일  │유튜브 │ PDF   │  │ ← CTA 버튼
│ └───────┴───────┴───────┴───────┘  │
│                                     │
│ 오늘 할 일                  전체 >  │
│ ┌─────────────────────────────────┐ │
│ │ □ 마케팅 전략 수립    [태그]    │ │
│ │ □ 디자인 리뷰                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 최근 기록                   전체 >  │
│ ┌─────────────────────────────────┐ │
│ │ 🎤 주간 회의       15:32  어제  │ │
│ │ 🎤 기획 미팅       08:45  2일전 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 내 일정                     전체 >  │
│ ┌─────────────────────────────────┐ │
│ │ 📅 마케팅 회의     10:00  오늘  │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│  홈   캘린더  🔴녹음  내작업   AI   │ ← 하단 네비
└─────────────────────────────────────┘
```

#### 파일 상세 화면
```
┌─────────────────────────────────────┐
│ ← 파일 상세                        │
├─────────────────────────────────────┤
│ 주간 전략 회의                      │
│ 2026년 2월 24일 · 32:15            │
│                                     │
│ ⏮ ▶ ⏭   ━━━●━━━━━━━━  00:00/32:00 │ ← 플레이어
│                                     │
│ [원본 기록] [할 일] [알림]          │ ← 탭
├─────────────────────────────────────┤
│                                     │
│ 김대리 10:30                        │
│ ┌─────────────────────────────────┐ │
│ │ 이번 주 마케팅 성과를 공유할게요 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 이과장 10:31                        │
│ ┌─────────────────────────────────┐ │
│ │ 각자 담당 업무 정리해주세요      │ │
│ │                                 │ │
│ │ ✨ 제안된 할 일                  │ │
│ │ [담당 업무 정리] [캘린더 등록]   │ │
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│  📅   🔔   📤                       │ ← 액션 버튼
└─────────────────────────────────────┘
```

---

## 기능 명세서

### 핵심 기능

| 기능 | Light | Pro | Enterprise |
|------|:-----:|:---:|:----------:|
| 음성 녹음 | ✅ | ✅ | ✅ |
| AI 요약 | 기본 | 고급 | 고급+ |
| 화자 분리 | 2명 | 10명 | 무제한 |
| 파일 업로드 | 100MB | 500MB | 무제한 |
| 유튜브 분석 | ❌ | ✅ | ✅ |
| PDF 분석 | ❌ | ✅ | ✅ |
| AI 생성 | ❌ | ✅ | ✅ |
| 팀 공유 | ❌ | ✅ | ✅ |
| 폴더 관리 | 3개 | 무제한 | 무제한 |
| 캘린더 연동 | 기본 | 고급 | 고급 |
| 알림 설정 | 기본 | 고급 | 고급 |
| SSO/SAML | ❌ | ❌ | ✅ |
| 감사 로그 | ❌ | ❌ | ✅ |
| SLA | ❌ | ❌ | 99.9% |

### 상세 기능 명세

#### 1. 녹음 기능
```javascript
// 상태 관리
- isRecording: boolean    // 녹음 중 여부
- isPaused: boolean       // 일시정지 여부
- recordingSeconds: number // 녹음 시간 (초)

// 기능
- toggleRecording()       // 녹음 시작/종료
- togglePause()           // 일시정지/재개
- startRecordingTimer()   // 타이머 시작
- stopRecordingTimer()    // 타이머 정지
- resumeRecordingTimer()  // 타이머 재개
```

#### 2. 재생 기능
```javascript
// 상태 관리
- isPlaying: boolean          // 재생 중 여부
- currentPlaybackTime: number // 현재 재생 위치
- playbackSpeed: number       // 재생 속도 (0.5x ~ 2.0x)
- TOTAL_DURATION: number      // 전체 길이

// 기능
- togglePlay()           // 재생/정지
- skipForward(seconds)   // 앞으로 건너뛰기
- skipBackward(seconds)  // 뒤로 건너뛰기
- seekToPosition(event)  // 특정 위치로 이동
- toggleSpeed()          // 재생 속도 변경
- animatePlayback()      // requestAnimationFrame 애니메이션
```

#### 3. 할 일 관리
```javascript
// 상태 관리
- actionCount: number         // 할 일 개수
- lastCompletedAction: object // 마지막 완료 항목 (실행취소용)

// 기능
- toggleAction(event, id)     // 완료/미완료 토글
- editAction(event, id)       // 수정
- deleteAction(event, id)     // 삭제
- filterActions(filter)       // 필터링 (전체/완료/미완료)
- undoLastAction()            // 실행 취소
```

#### 4. 폴더 관리
```javascript
// 상태 관리
- folderFiles: object         // 폴더별 파일 목록
- MAX_FOLDERS: 3              // 최대 폴더 수
- MAX_FILES_PER_FOLDER: 15    // 폴더당 최대 파일 수

// 기능
- createFolder(name)          // 폴더 생성
- deleteFolder(event, id)     // 폴더 삭제
- renameFolder(event, id)     // 폴더 이름 변경
- moveFileToFolder(fileId, folderId) // 파일 이동
- handleDrop(event, folderId) // 드래그앤드롭
```

---

## UI/UX 설계 원칙

### 디자인 시스템

#### 컬러 팔레트
```css
:root {
  /* Primary - TeamBlo Blue */
  --blue: #3B82F6;
  --blue-bg: #EFF6FF;
  --blue-light: #DBEAFE;
  
  /* Grayscale */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
  
  /* Accent */
  --green: #22C55E;
  --orange: #F59E0B;
  --red: #EF4444;
  --pink: #EC4899;
  --purple: #8B5CF6;
}
```

#### 타이포그래피
```css
/* Font Family */
font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;

/* Font Scale */
--text-xs: 11px;
--text-sm: 13px;
--text-md: 15px;
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;
```

#### 스페이싱
```css
--sp-1: 4px;
--sp-2: 8px;
--sp-3: 12px;
--sp-4: 16px;
--sp-5: 20px;
--sp-6: 24px;
--sp-8: 32px;
--sp-10: 40px;
--sp-16: 64px;
```

### 설계 원칙

1. **Toss-style Minimalism**
   - 단일 컬럼 레이아웃
   - 텍스트 중심 UI
   - 최소한의 색상 사용
   - 충분한 여백

2. **iOS-like Components**
   - 분리된 카드형 리스트
   - 14px 라운드 코너
   - 얇은 회색 보더
   - 일관된 패딩

3. **Enterprise Tone**
   - 차분한 색감
   - 명확한 정보 계층
   - 전문적인 타이포그래피

### 반응형 브레이크포인트
```css
/* Mobile First */
@media (min-width: 480px) { /* Small */ }
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large Desktop */ }
```

---

## 기술 스택

### 현재 구현
| 영역 | 기술 |
|------|------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Styling | CSS Variables, Flexbox, Grid |
| Animation | CSS Transitions, requestAnimationFrame |
| Icons | Inline SVG |

### 프로덕션 추천 스택
| 영역 | 기술 | 이유 |
|------|------|------|
| Frontend | Next.js 14+ | SSR, App Router, 최적화 |
| Styling | Tailwind CSS | 유틸리티 기반, 빠른 개발 |
| State | Zustand | 경량, 직관적 |
| UI Components | Radix UI | 접근성, 커스터마이징 |
| Animation | Framer Motion | 선언적, 강력함 |
| Backend | Node.js + FastAPI | 실시간 + AI 처리 |
| Database | PostgreSQL + Redis | 관계형 + 캐싱 |
| AI/ML | OpenAI API, Whisper | 요약 + 음성 인식 |
| Storage | AWS S3 | 확장성 |
| Auth | NextAuth.js | 다양한 Provider |

---

## 설계 과정 및 이슈 해결

### 이슈 #1: 모달 vs 토스트 일관성
**문제**: 시스템 알림이 토스트와 confirm() 다이얼로그로 혼재
**해결**: 
- 모든 알림을 중앙 모달로 통일
- `showSystemModal()` 함수로 일원화
- 삭제 등 확인 필요 시 `showConfirmModal()` 사용

```javascript
// Before
showToast('녹음이 시작되었습니다');
if (confirm('삭제하시겠습니까?')) { ... }

// After
showSystemModal('녹음이 시작되었습니다', 'success', '녹음 시작');
showConfirmModal('삭제하시겠습니까?', '삭제', '할 일 삭제');
```

### 이슈 #2: 재생바 애니메이션 끊김
**문제**: `setInterval` 사용 시 재생바가 분할 이동
**해결**: `requestAnimationFrame` 으로 부드러운 애니메이션

```javascript
// Before
setInterval(() => { currentTime += 1; }, 1000);

// After
function animatePlayback(timestamp) {
  const elapsed = timestamp - lastTimestamp;
  currentPlaybackTime += (elapsed / 1000) * playbackSpeed;
  requestAnimationFrame(animatePlayback);
}
```

### 이슈 #3: 페이지 간 상태 유지
**문제**: 녹음 중 다른 페이지 이동 시 타이머 초기화
**해결**: 
- 전역 상태 변수로 관리
- 헤더에 녹음 뱃지 표시
- 페이지 전환해도 타이머 유지

### 이슈 #4: 에이전트 페이지 레이아웃 깨짐
**문제**: 1440px에서 입력창/네비바 overflow
**해결**: 
- `max-width` + `transform: translateX(-50%)` 적용
- 미디어 쿼리별 `max-width` 조정

### 이슈 #5: 리스트 스타일 불일치
**문제**: 각 섹션별 리스트 아이템 스타일 상이
**해결**: 
- 통일된 `.item-card` 스타일 적용
- 아이콘 컬러/배경색 일원화
- 호버 효과 통일

---

## 로드맵

### Phase 1: MVP (현재 완료)
- [x] 기본 UI/UX 구현
- [x] 녹음/재생 기능
- [x] 할 일 관리
- [x] 캘린더 연동
- [x] 폴더 관리
- [x] AI 에이전트 UI
- [x] 반응형 레이아웃

### Phase 2: Backend Integration (예정)
- [ ] 사용자 인증 (OAuth)
- [ ] 실시간 음성 녹음 API
- [ ] Whisper 연동 (음성→텍스트)
- [ ] GPT-4 연동 (요약/할일 추출)
- [ ] 데이터베이스 연동
- [ ] 파일 스토리지

### Phase 3: Advanced Features
- [ ] 실시간 화자 분리
- [ ] 팀 협업 기능
- [ ] Notion/Slack 연동
- [ ] 캘린더 앱 동기화
- [ ] 푸시 알림

### Phase 4: Enterprise
- [ ] SSO/SAML 인증
- [ ] 감사 로그
- [ ] 관리자 대시보드
- [ ] API 제공
- [ ] 온프레미스 배포

---

## 리팩토링 제안

### 1. 컴포넌트 분리 (React 전환 시)

```
src/
├── components/
│   ├── common/
│   │   ├── Button/
│   │   ├── Modal/
│   │   ├── Toast/
│   │   └── Card/
│   ├── layout/
│   │   ├── Header/
│   │   ├── BottomNav/
│   │   └── PageContainer/
│   ├── recording/
│   │   ├── RecordButton/
│   │   ├── RecordingScreen/
│   │   └── Timer/
│   ├── player/
│   │   ├── AudioPlayer/
│   │   ├── Timeline/
│   │   └── SpeedControl/
│   ├── tasks/
│   │   ├── TaskList/
│   │   ├── TaskItem/
│   │   └── TaskModal/
│   ├── calendar/
│   │   ├── CalendarView/
│   │   ├── DayCell/
│   │   └── EventModal/
│   └── agent/
│       ├── ChatInterface/
│       ├── MessageBubble/
│       └── SuggestionList/
├── hooks/
│   ├── useRecording.ts
│   ├── usePlayback.ts
│   ├── useTasks.ts
│   └── useCalendar.ts
├── stores/
│   ├── recordingStore.ts
│   ├── taskStore.ts
│   └── userStore.ts
├── utils/
│   ├── formatTime.ts
│   ├── dateUtils.ts
│   └── api.ts
└── styles/
    ├── globals.css
    ├── variables.css
    └── components/
```

### 2. 상태 관리 개선

```typescript
// stores/recordingStore.ts
import { create } from 'zustand';

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  startRecording: () => void;
  stopRecording: () => void;
  togglePause: () => void;
}

export const useRecordingStore = create<RecordingState>((set) => ({
  isRecording: false,
  isPaused: false,
  duration: 0,
  startRecording: () => set({ isRecording: true, duration: 0 }),
  stopRecording: () => set({ isRecording: false, isPaused: false }),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
}));
```

### 3. API 레이어 분리

```typescript
// services/api/recordings.ts
export const recordingsApi = {
  create: async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    return fetch('/api/recordings', {
      method: 'POST',
      body: formData,
    });
  },
  
  getTranscript: async (id: string) => {
    return fetch(`/api/recordings/${id}/transcript`);
  },
  
  getSummary: async (id: string) => {
    return fetch(`/api/recordings/${id}/summary`);
  },
};
```

### 4. 타입 안전성 강화

```typescript
// types/index.ts
export interface Recording {
  id: string;
  title: string;
  duration: number;
  createdAt: Date;
  transcript?: Transcript;
  summary?: Summary;
}

export interface Task {
  id: string;
  content: string;
  isCompleted: boolean;
  dueDate?: Date;
  tags: string[];
  recordingId?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time?: string;
  participants?: string[];
  recordingId?: string;
}
```

---

## 경쟁사 분석

### 비교표

| 기능 | TIMBLO | Daglo | Collabo | Clova Note |
|------|:------:|:-----:|:-------:|:----------:|
| 화자 분리 | ✅ | ✅ | ✅ | ✅ |
| AI 요약 | ✅ | ✅ | ✅ | 기본 |
| 할 일 추출 | ✅ | ❌ | ✅ | ❌ |
| 보안 강조 | ⭐⭐⭐ | ⭐ | ⭐⭐ | ⭐⭐ |
| UI/UX | Toss | 기본 | 현대적 | 네이버 |
| 가격 | 25,000원~ | 무료~ | 29,000원~ | 무료~ |

### TIMBLO 차별점

1. **보안 중심 포지셔닝**
   - 엔터프라이즈급 암호화
   - 감사 로그
   - 온프레미스 옵션

2. **Toss-style UI/UX**
   - 깔끔하고 직관적
   - 한국 사용자 친화적
   - 모바일 최적화

3. **AI 에이전트 통합**
   - 회의 내용 기반 질의응답
   - 자동 액션 아이템 생성
   - 후속 작업 자동화

---

## 부록

### A. 파일 구조
```
vibecoding/
├── teamblo-toss-style.html  # 메인 애플리케이션
├── TIMBLO-Documentation.md  # 이 문서
└── assets/
    ├── timblo-logo.png      # 로고 이미지
    └── ai-agent.json        # Lottie 애니메이션 (미사용)
```

### B. 주요 CSS 클래스

| 클래스 | 용도 |
|--------|------|
| `.page` | 페이지 컨테이너 |
| `.section-card` | 섹션 카드 |
| `.item-card` | 리스트 아이템 |
| `.cta-btn` | CTA 버튼 |
| `.system-modal` | 시스템 모달 |
| `.confirm-modal` | 확인 모달 |
| `.bottom-nav` | 하단 네비게이션 |

### C. JavaScript 함수 목록

| 함수 | 설명 |
|------|------|
| `showPage(pageId)` | 페이지 전환 |
| `toggleRecording()` | 녹음 토글 |
| `togglePlay()` | 재생 토글 |
| `showSystemModal()` | 시스템 알림 |
| `showConfirmModal()` | 확인 모달 |
| `renderCalendar()` | 캘린더 렌더링 |
| `filterActions()` | 할 일 필터링 |
| `sendAgentMessage()` | AI 메시지 전송 |

### D. 접근성 고려사항

- [ ] ARIA 레이블 추가
- [ ] 키보드 네비게이션
- [ ] 스크린 리더 지원
- [ ] 고대비 모드
- [ ] 폰트 크기 조절

### E. 성능 최적화 체크리스트

- [ ] 이미지 lazy loading
- [ ] CSS/JS 번들 최적화
- [ ] 가상 스크롤 (긴 리스트)
- [ ] 메모이제이션
- [ ] Service Worker

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 0.1.0 | 2026-02-24 | 초기 설계 및 MVP 구현 |
| 0.2.0 | 2026-02-24 | Toss-style UI 적용 |
| 0.3.0 | 2026-02-24 | 모달 시스템 통일 |
| 0.4.0 | 2026-02-24 | 반응형 1440px 최적화 |

---

*이 문서는 TIMBLO 프로젝트의 설계 및 개발 과정을 기록한 것입니다.*
*Last Updated: 2026-02-24*

