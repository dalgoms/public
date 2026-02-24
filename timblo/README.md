# TIMBLO - AI 회의록 서비스

![TIMBLO Logo](assets/images/timblo-logo.png)

## 🎯 소개

**TIMBLO**는 AI 기반 회의록 자동 생성 서비스입니다. 보안 + LLM + 화자분리 기술을 핵심 강점으로 합니다.

## ✨ 주요 기능

- 🎤 **실시간 녹음**: 고품질 음성 녹음 및 실시간 타이머
- 🤖 **AI 요약**: LLM 기반 핵심 내용 자동 추출
- 👥 **화자 분리**: 실시간 화자 인식 및 분리
- 📋 **할 일 자동 추출**: 회의 내용에서 액션 아이템 자동 생성
- 📅 **캘린더 연동**: 일정 등록 및 알림 기능
- 📁 **파일 관리**: 폴더 생성 및 드래그앤드롭 정리
- 🔒 **완벽한 보안**: 엔터프라이즈급 데이터 암호화

## 📁 폴더 구조

```
timblo/
├── teamblo-toss-style.html    # 메인 애플리케이션
├── README.md                   # 이 파일
│
├── assets/
│   ├── images/
│   │   └── timblo-logo.png    # 로고
│   └── icons/                  # SVG 아이콘
│
├── src/
│   ├── styles/
│   │   └── variables.css      # CSS 변수 정의
│   │
│   ├── scripts/
│   │   ├── recording.js       # 녹음 모듈
│   │   ├── playback.js        # 재생 모듈
│   │   ├── modal.js           # 모달 모듈
│   │   └── utils.js           # 유틸리티 함수
│   │
│   └── components/             # (예정) 컴포넌트 분리
│
└── docs/
    └── TIMBLO-Documentation.md # 상세 문서
```

## 🚀 시작하기

### 로컬 실행

```bash
# 프로젝트 디렉토리로 이동
cd timblo

# Python HTTP 서버로 실행
python -m http.server 8080

# 또는 Node.js http-server
npx http-server -p 8080
```

브라우저에서 `http://localhost:8080/teamblo-toss-style.html` 접속

## 💡 기술 스택

### 현재 (MVP)
- HTML5
- CSS3 (Variables, Flexbox, Grid)
- Vanilla JavaScript
- requestAnimationFrame (애니메이션)

### 프로덕션 권장
- Next.js 14+
- Tailwind CSS
- Zustand (상태 관리)
- Radix UI (접근성)
- Framer Motion (애니메이션)

## 📱 반응형 지원

| 디바이스 | 브레이크포인트 |
|---------|--------------|
| Mobile | < 480px |
| Small | 480px ~ 768px |
| Tablet | 768px ~ 1024px |
| Desktop | 1024px ~ 1440px |
| Large Desktop | 1440px+ |

## 💰 요금제

| 기능 | Light (₩25,000) | Pro (₩56,000) | Enterprise |
|------|:---------------:|:-------------:|:----------:|
| 음성 녹음 | ✅ | ✅ | ✅ |
| AI 요약 | 기본 | 고급 | 고급+ |
| 화자 분리 | 2명 | 10명 | 무제한 |
| 유튜브/PDF | ❌ | ✅ | ✅ |
| 팀 공유 | ❌ | ✅ | ✅ |
| SSO/감사로그 | ❌ | ❌ | ✅ |

## 📄 라이선스

MIT License

## 🤝 기여하기

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 문의

- Website: [timblo.io](https://timblo.io)
- Email: support@timblo.io

---

Made with ❤️ by TIMBLO Team

