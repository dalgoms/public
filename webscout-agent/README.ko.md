# WebScout Agent

**Figma 디자인을 위한 AI 기반 웹사이트 URL 자동 수집 에이전트**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)

[🇰🇷 한국어](README.ko.md) | [🇺🇸 English](README.md)

🌐 **라이브 데모**: https://webscout-agent.vercel.app/

---

## WebScout Agent란?

WebScout Agent는 웹사이트의 모든 URL을 자동으로 발견하고 정리하여 Figma 디자인 임포트에 바로 사용할 수 있도록 준비해주는 AI 에이전트입니다. URL을 하나씩 수동으로 입력하는 대신:

- **발견** - sitemap.xml 또는 지능형 크롤링으로 URL 자동 수집
- **정규화** - 쿼리 제거, www/non-www 처리
- **구조화** - 깊이 분석을 통한 웹사이트 계층 구조 파악
- **내보내기** - Figma (html.to.design)에 바로 사용 가능한 깔끔한 URL 목록 생성

디자인 리빌드, 사이트 감사, Figma 워크플로우 자동화에 최적화되어 있습니다.

---

## 왜 만들었나요?

디자인을 리빌드할 때 URL을 하나씩 수동으로 입력하는 것은 비효율적이고 실수하기 쉽습니다. WebScout Agent는 이 전체 과정을 자동화하여 몇 시간 걸리던 수동 작업을 몇 초 만에 완료합니다.

---

## 에이전트 플로우

```
도메인 입력
    ↓
Sitemap 발견 (robots.txt → sitemap.xml)
    ↓
크롤링 대체 (sitemap이 없는 경우)
    ↓
URL 정규화 (www/non-www 병합, 쿼리 제거)
    ↓
구조 분석 (깊이, 경로 계층 구조)
    ↓
내보내기 (urls.txt / urls.csv)
```

자세한 플로우 다이어그램은 [docs/agent-flow.md](./docs/agent-flow.md) 참조

---

## 주요 기능

### 핵심 발견 기능
- ✅ **Sitemap 우선 접근** - sitemap.xml 자동 감지 및 파싱
- ✅ **지능형 대체** - sitemap이 없을 경우 내부 링크 크롤링
- ✅ **같은 출처 필터링** - 대상 도메인에서만 URL 수집
- ✅ **Robots.txt 파싱** - sitemap 위치 자동 발견

### URL 처리
- ✅ **쿼리 제거** - 쿼리 파라미터 선택적 제거
- ✅ **www/non-www 병합** - www와 non-www를 동일 사이트로 처리
- ✅ **해시 제거** - URL 프래그먼트 자동 정리
- ✅ **경로 제외** - admin, API 등 경로 필터링

### 제어 및 제한
- ✅ **깊이 제어** - 크롤링 깊이 제한 (기본값: 3)
- ✅ **최대 URL 제한** - 무한 수집 방지 (기본값: 5000)
- ✅ **요청 제한** - 요청 간 150ms 지연

### 대시보드 및 내보내기
- ✅ **실시간 KPI 대시보드** - 총 URL 수, 출처, 깊이, 제외된 수
- ✅ **인터랙티브 URL 테이블** - 검색, 정렬, 필터, 선택
- ✅ **내보내기 형식** - urls.txt (한 줄에 하나) 및 urls.csv
- ✅ **인사이트 탭** - Sitemap 뷰, 페이지 타입, Figma 준비도, 중요도

---

## 빠른 시작

### 필수 요구사항

- Node.js 18+ ([다운로드](https://nodejs.org/))
- npm (Node.js와 함께 제공됨)

### 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/webscout-agent.git
cd webscout-agent

# 의존성 설치
npm install
```

### Web UI 실행

```bash
npm start
```

브라우저에서 열기: **http://localhost:3001**

> **참고**: 서버는 3001-3010 포트 중 사용 가능한 포트를 자동으로 찾습니다. 3001이 이미 사용 중이면 콘솔 출력에서 실제 포트 번호를 확인하세요. URL은 `http://localhost:3001` 형식입니다 (해시나 슬래시 불필요).

---

## Web UI 사용법

1. **도메인 입력** - 웹사이트 URL 입력 (예: `https://example.com`)
2. **옵션 설정** (선택사항):
   - **Depth**: 최대 크롤링 깊이 (기본값: 3)
   - **Max URLs**: 수집할 최대 URL 수 (기본값: 5000)
   - **Query Strip**: 쿼리 파라미터 제거
   - **www/non-www**: www와 non-www 변형 병합
   - **Exclude**: 제외할 경로 (쉼표로 구분, 예: `/admin,/api`)
3. **"Collect URLs" 클릭** - 실시간 진행 상황 확인
4. **결과 검토** - KPI 카드 및 URL 테이블 확인
5. **내보내기** - `urls.txt` 또는 `urls.csv` 다운로드
6. **Figma로 임포트** - [html.to.design](https://html.to.design)을 사용하여 URL 임포트

### 데모 사이트

**"Use Demo Site"** 버튼을 클릭하여 `https://webscout-demo.pages.dev`로 테스트할 수 있습니다.

---

## CLI 사용법

헤드리스 작업이나 자동화를 위해:

```bash
# 기본 사용법
node collect-urls.mjs https://example.com

# 옵션과 함께
node collect-urls.mjs https://example.com --depth=4 --max=8000

# 출력 파일
# - urls.txt (한 줄에 URL 하나)
# - urls.csv (CSV 형식)
```

### CLI 옵션

- `--depth=N` - 최대 크롤링 깊이 (기본값: 3)
- `--max=N` - 수집할 최대 URL 수 (기본값: 5000)

### 결과 검증

Windows PowerShell에서:

```powershell
.\verify-urls.ps1 -TargetDomain "https://example.com"
```

다음을 검증합니다:
- ✅ 같은 출처 필터링
- ✅ 해시 제거
- ✅ 쿼리 문자열 처리
- ✅ www/non-www 정규화

---

## 배포 (Vercel)

### 1단계: GitHub에 푸시

```bash
git init
git add .
git commit -m "WebScout Agent MVP"
git remote add origin https://github.com/yourusername/webscout-agent.git
git push -u origin main
```

### 2단계: Vercel에서 배포

1. [vercel.com](https://vercel.com) 접속
2. GitHub로 로그인
3. **"Add New..."** → **"Project"** 클릭
4. `webscout-agent` 저장소 선택
5. **"Deploy"** 클릭

Vercel은 `vercel.json`에서 설정을 자동으로 감지합니다.

### 환경 변수

기본 동작에는 필요 없습니다.

---

## 폴더 구조

```
webscout-agent/
├── README.md                 # 영어 버전
├── README.ko.md             # 이 파일 (한글 버전)
├── CHANGELOG.md              # 버전 히스토리
├── LICENSE                   # MIT 라이선스
├── package.json              # 의존성 및 스크립트
├── vercel.json               # Vercel 배포 설정
├── .gitignore                # Git 무시 규칙
│
├── server.js                 # Express 서버 (Web UI)
├── collect-urls.mjs          # 핵심 URL 수집 로직
├── verify-urls.ps1          # PowerShell 검증 스크립트
│
├── public/                   # Web UI 프론트엔드
│   ├── index.html           # 메인 HTML
│   ├── style.css            # 스타일
│   └── app.js               # 클라이언트 사이드 로직
│
├── docs/                     # 문서
│   ├── architecture.md      # 시스템 아키텍처
│   ├── agent-flow.md        # 에이전트 플로우 다이어그램
│   └── roadmap.md           # 향후 기능
│
└── samples/                  # 샘플 출력
    ├── urls.sample.txt      # 예제 urls.txt
    └── urls.sample.csv       # 예제 urls.csv
```

---

## 아키텍처

WebScout Agent는 다음으로 구성됩니다:

- **Express 서버** (`server.js`) - 정적 UI 및 API 엔드포인트 제공
- **수집 엔진** (`collect-urls.mjs`) - 핵심 URL 발견 로직
- **Web 대시보드** (`public/`) - React 없는 바닐라 JS UI
- **검증 스크립트** (`verify-urls.ps1`) - PowerShell 결과 검사기

자세한 아키텍처는 [docs/architecture.md](./docs/architecture.md) 참조

---

## 스크린샷

![WebScout Agent 대시보드](docs/screenshots/dashboard.png)
*실시간 KPI 대시보드와 인사이트*

![URL 수집](docs/screenshots/collection.png)
*검색 및 내보내기 기능이 있는 인터랙티브 URL 테이블*

---

## 로드맵

### ✅ 완료됨 (v0.1)
- [x] Sitemap 발견
- [x] 내부 링크 크롤링
- [x] Web 대시보드 UI
- [x] URL 내보내기 (txt/csv)
- [x] KPI 메트릭
- [x] 인사이트 탭

### 🚧 계획됨
- [ ] Sitemap 트리 시각화
- [ ] 페이지 타입 자동 태깅 (marketing/product/support)
- [ ] Figma 준비도 점수
- [ ] 페이지 중요도 히트맵 (링크 수 분석)
- [ ] 퍼널 매핑
- [ ] 배치 처리
- [ ] API 속도 제한
- [ ] 인증

자세한 내용은 [docs/roadmap.md](./docs/roadmap.md) 참조

---

## 문제 해결

### 포트가 이미 사용 중

서버는 자동으로 3001-3010 포트를 시도합니다. 모두 사용 중이면:

```bash
# 포트 3001의 프로세스 종료
# Windows PowerShell
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### URL이 수집되지 않음

- **Sitemap 확인**: `https://yourdomain.com/sitemap.xml` 방문
- **SPA 사이트**: JavaScript 렌더링이 필요할 수 있음 (아직 지원 안 됨)
- **봇 차단**: 일부 사이트는 자동화된 요청을 차단함
- **크롤링 대체 시도**: Sitemap 우선순위 비활성화

### PowerShell 스크립트가 실행되지 않음

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\verify-urls.ps1 -TargetDomain "https://example.com"
```

---

## 기여하기

기여를 환영합니다! 다음을 따라주세요:

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 열기

---

## 라이선스

MIT License - 자세한 내용은 [LICENSE](./LICENSE) 파일 참조

---

## 작성자

**Seyoung Lee**

수동 URL 수집을 싫어하는 디자이너와 개발자를 위해 ❤️로 만들었습니다.

---

## 감사의 말

- Figma 디자인 워크플로우 자동화 필요성에서 영감을 받았습니다
- Express.js, 바닐라 JavaScript, 모던 CSS로 구축했습니다
- Vercel에 배포되었습니다

---

**웹사이트를 스카우트할 준비가 되셨나요?** 몇 초 만에 URL 수집을 시작하세요! 🚀
