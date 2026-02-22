/**
 * ============================================
 * CONTENT MATRIX - 콘텐츠 데이터베이스
 * ============================================
 * 
 * 이 파일은 광고 소재 생성에 필요한 모든 콘텐츠를 저장합니다.
 * 새로운 주제/직업을 추가할 때 이 파일만 수정하면 됩니다.
 */

// ============================================
// 핵심 타겟: 30~40대 경력 전환/단절 고민자
// ============================================
// 특징:
// - 프리랜서 수입에 관심 있으나 의심 많음
// - "내가 될 수 있을까?" "돈만 날리는 거 아닐까?" 두려움
// - 강의/광고 피로감 높음 (방어벽 UP)
// ============================================

// 고객 여정별 심리 상태
const CUSTOMER_JOURNEY = {
    // STAGE 1: 광고 노출 (0~3초)
    adExposure: {
        questions: [
            '또 이런 거야?',
            '이것도 그냥 돈 내라는 거 아냐?',
            '속기사? 그게 뭔데?'
        ],
        emotions: {
            fatigue: 0.8,        // 피로감 80%
            defense: 0.7,       // 방어심리 70%
            curiosity: 0.3      // 호기심 30%
        },
        dropOffReasons: [
            '뻔한 문구 (월 300, 재택)',
            '너무 화려한 디자인',
            '과장된 성공 스토리'
        ],
        passCriteria: [
            '과장 없는 담담한 톤',
            '"나도 그랬다" 공감 신호',
            '구체적 숫자 (단, 과하지 않게)'
        ]
    },
    
    // STAGE 2: 랜딩 페이지 (3~30초)
    landingPage: {
        questions: [
            '그래서 이게 뭔데?',
            '누가 가르치는 건데?',
            '실제로 이만큼 버는 사람 있어?',
            '나같은 사람도 가능해?',
            '얼마야? 가격은 왜 안 보여줘?'
        ],
        emotions: {
            exploration: 0.7,   // 탐색 모드 70%
            doubt: 0.8,         // 의심 80%
            anxiety: 0.6,       // 불안 60%
            overload: 0.5       // 정보 과부하 50%
        },
        dropOffPoints: [
            { section: '히어로 섹션', reason: '뻔한 말/신뢰 부족', rate: 0.4 },
            { section: '가격 미표기', reason: '비싸겠다/숨기는 거 있다', rate: 0.25 },
            { section: '성공 사례', reason: '저 사람은 특별하겠지', rate: 0.15 },
            { section: '긴 스크롤', reason: '피로/핵심만 알려줘', rate: 0.1 },
            { section: 'CTA 버튼 앞', reason: '상담하면 영업 전화', rate: 0.1 }
        ],
        passCriteria: [
            '가격 또는 가격대 명시',
            '평범한 사람의 리얼 후기',
            '강사/기관 신뢰 증거',
            'FAQ에서 두려움 직접 언급',
            '상담 ≠ 영업 안심 메시지'
        ]
    },
    
    // STAGE 3: 상담 신청 직전 (30초~3분)
    preConversion: {
        questions: [
            '전화 폭탄 오는 거 아냐?',
            '무료 상담이라면서 결제 압박하겠지?',
            '지금 신청해도 되나? 더 알아봐야 하나?',
            '남편/아내한테 말해야 하나?',
            '실패하면 어떡하지?'
        ],
        emotions: {
            decisionAnxiety: 0.9,   // 결정 불안 90%
            comparison: 0.7,        // 비교 심리 70%
            socialPressure: 0.6,    // 사회적 시선 60%
            lossAversion: 0.8       // 손실 회피 80%
        },
        dropOffReasons: [
            '"무료 상담" = 영업이겠지',
            '전화번호 입력 = 전화 오는 거 싫어',
            '오늘 말고 나중에 해도 되잖아'
        ],
        passCriteria: [
            '카톡 상담 옵션',
            '"영업 전화 NO" 명시',
            '무료 적성 테스트 제공',
            '결정은 상담 후에 메시지',
            '환불 정책 명시'
        ]
    }
};

// 타겟별 페르소나 정의 (세분화)
const TARGET_PERSONAS = {
    // 핵심 타겟 1: 30~40대 직장인 (경력 전환 고민)
    worker_30_40: {
        name: '30~40대 직장인',
        age: '30~40대',
        situation: '경력 정체/전환 고민',
        painPoints: [
            '이대로 10년 더?',
            '월급은 그대로인데 물가는...',
            '부업 해봤자 시간만 날림',
            '강의 여러 개 들었는데 결국...',
            '이 나이에 새로 시작해도 될까?'
        ],
        fears: [
            '내가 될 수 있을까?',
            '돈만 날리는 거 아닐까?',
            '또 사기 아닐까?',
            '주변에서 뭐라 하겠지'
        ],
        desires: ['안정적 부수입', '재택 가능', '전문성 인정', '시간 자유'],
        adFatigue: 0.85,  // 광고 피로도 85%
        trustThreshold: 0.9  // 신뢰 획득 난이도 90%
    },
    
    // 핵심 타겟 2: 경력 단절자
    career_break: {
        name: '경력 단절자',
        age: '30~40대',
        situation: '육아/개인사유로 경력 단절',
        painPoints: [
            '공백기가 너무 길어...',
            '예전 일로 돌아가기 어려워',
            '뭘 해야 할지 모르겠어',
            '나만 뒤처진 것 같아'
        ],
        fears: [
            '이제 와서 할 수 있을까?',
            '배우는 데 시간 너무 오래 걸리면?',
            '취업이 안 되면?',
            '가족들 눈치...'
        ],
        desires: ['재택 필수', '유연한 시간', '새로운 정체성', '경제적 독립'],
        adFatigue: 0.75,
        trustThreshold: 0.85
    },
    
    // 기존 타겟 (호환성 유지)
    jobseeker: {
        name: '취준생',
        painPoints: ['취업 스트레스', '불안정한 미래', '스펙 쌓기 피로', '경쟁 압박'],
        desires: ['안정적인 직장', '높은 연봉', '워라밸', '전문성 획득'],
        triggers: ['합격', '자격증', '취업성공', '커리어 시작'],
        adFatigue: 0.6,
        trustThreshold: 0.7
    },
    worker: {
        name: '직장인',
        painPoints: ['퇴근 후 피로', '정체된 커리어', '부업 필요', '이직 고민'],
        desires: ['부수입', '이직 준비', '스킬업', '재택근무'],
        triggers: ['월급 외 수입', '퇴근 후', 'N잡러', '투잡'],
        adFatigue: 0.8,
        trustThreshold: 0.85
    },
    housewife: {
        name: '주부',
        painPoints: ['경력단절', '시간 제약', '육아와 병행', '재취업 어려움'],
        desires: ['재택근무', '유연한 시간', '경력 재시작', '가정과 병행'],
        triggers: ['집에서', '아이 등원 후', '경력단절 극복', '시간 자유'],
        adFatigue: 0.7,
        trustThreshold: 0.8
    }
};

// 주제별 콘텐츠 데이터베이스
const CONTENT_DATABASE = {
    // 속기사 예시 (30~40대 광고 피로 타겟 최적화)
    '속기사': {
        keywords: ['속기', '법원', '국회', '회의록', '타이핑', '자격증'],
        benefits: [
            '재택근무 가능',
            '시간당 높은 수입',
            '프리랜서 활동 가능',
            '경력단절 후 재취업 용이',
            '수요 지속 증가',
            '전문직 대우',
            '유연한 근무시간',
            '초기 투자 비용 적음'
        ],
        stats: [
            { number: '300만원+', label: '월 평균 수입' },
            { number: '2시간', label: '하루 평균 근무' },
            { number: '90%', label: '재택근무 비율' },
            { number: '3개월', label: '자격 취득 기간' },
            { number: '시간당 5만원', label: '평균 단가' },
            { number: '연 12%', label: '수요 증가율' }
        ],
        
        // ============================================
        // 훅 카피 (광고 피로 타겟용 - 담담한 톤)
        // ============================================
        hooks: {
            // 혜택형 - 과장 없이 담담하게
            benefit: [
                '36살, 퇴사 6개월 차입니다',
                '저도 처음엔 의심했어요',
                '솔직하게 말할게요',
                '화려한 말 안 할게요',
                '광고 같지 않죠? 맞아요'
            ],
            // 질문형 - 공감 유도
            question: [
                '퇴근 후 뭐 하세요?',
                '이 나이에 뭘 새로 배워?',
                '또 강의? 라고 생각하셨죠',
                '얼마나 많이 실패해보셨어요?',
                '남들 다 하는 거, 왜 나만 안 될까요?'
            ],
            // 스토리형 - 실패 인정 + 솔직함
            story: [
                '저도 3번 실패하고 찾았어요',
                '강의만 5개 들었습니다',
                '38살, 경력 공백 4년',
                '처음엔 가족도 반대했어요',
                '사실 저도 반신반의였어요'
            ],
            // 통계형 - 신뢰할 수 있는 숫자
            stats: [
                '수강생 73%가 6개월 내 수입 발생',
                '평균 학습 기간 4.2개월',
                '30대 수강생 비율 62%',
                '경력 단절 후 시작 48%',
                '재택 근무 비율 87%'
            ],
            // 비교형 - 현실적 비교
            compare: [
                '부업 vs 본업이 되는 부업',
                '강의 수집 vs 실제 수입',
                '혼자 vs 같이 가는 길',
                '의심만 vs 일단 확인',
                '시간 낭비 vs 시간 투자'
            ],
            // 긴급형 - 과장 없는 긴급성
            urgency: [
                '다음 기수는 2개월 뒤입니다',
                '소수 정예 15명 마감 예정',
                '이번 달까지 가격 동결',
                '고민하는 사이 자리가...',
                '결정은 상담 후에 하셔도 됩니다'
            ],
            // 신규: 두려움 직접 언급형
            fear_address: [
                '"내가 될 수 있을까?" 저도요',
                '"돈만 날리는 거 아닐까?"',
                '의심하는 게 정상입니다',
                '사기 아닌지 확인하세요',
                '판단은 직접 보시고요'
            ],
            // 신규: 안티-광고형 (역발상)
            anti_ad: [
                '이건 광고입니다, 근데요',
                '클릭 안 하셔도 됩니다',
                '모든 사람에게 맞진 않아요',
                '안 맞으면 안 하시면 됩니다',
                '궁금하면 보시고, 아니면 패스'
            ]
        },
        
        // ============================================
        // 메인 카피 (진정성 + 현실적)
        // ============================================
        mainCopies: {
            benefit: [
                '대단한 얘기 아니에요\n<strong>그냥 제 이야기</strong>입니다',
                '과장 없이\n<strong>있는 그대로</strong> 알려드릴게요',
                '화려하진 않지만\n<strong>진짜 가능한</strong> 이야기',
                '누구나 되는 건 아니에요\n<strong>맞는 분만</strong> 오세요'
            ],
            question: [
                '혹시 <strong>이런 고민</strong>\n해보신 적 있나요?',
                '이 나이에 <strong>새로 시작</strong>해도\n될까요?',
                '또 실패하면 어쩌지?\n<strong>저도 그랬어요</strong>',
                '진짜 <strong>가능한 건지</strong>\n확인만 해보세요'
            ],
            story: [
                '처음엔 <strong>아무도 안 믿었어요</strong>\n저 포함해서요',
                '3번 실패 후\n<strong>4번째에</strong> 됐습니다',
                '38살, 공백 4년\n<strong>지금은</strong> 프리랜서 3년차',
                '<strong>평범한 사람</strong>의\n솔직한 후기입니다'
            ],
            stats: [
                '수강생 <strong>73%</strong>가\n6개월 내 첫 수입',
                '평균 <strong>4.2개월</strong>\n빠른 분은 2개월',
                '<strong>30대</strong>가 62%\n늦지 않았습니다',
                '통계로 보여드릴게요\n<strong>과장 없이</strong>'
            ],
            compare: [
                '강의만 모으셨다면\n<strong>이건 다릅니다</strong>',
                '혼자 하다 포기?\n<strong>같이 가면</strong> 다릅니다',
                '의심만 하실 건가요?\n<strong>직접 확인</strong>해보세요',
                '시간 낭비 vs\n<strong>시간 투자</strong>의 차이'
            ],
            urgency: [
                '마감이라 하면\n<strong>믿으시겠어요?</strong>\n그래서 그냥 알려드려요',
                '결정은\n<strong>상담 후에</strong> 하셔도 됩니다',
                '지금 아니어도\n<strong>2개월 뒤</strong> 다시 열려요',
                '급하게 결정하지 마세요\n<strong>천천히</strong> 알아보세요'
            ],
            fear_address: [
                '"내가 될까?" <strong>저도요</strong>\n근데 됐어요',
                '돈만 날릴까봐\n<strong>무서웠어요</strong>, 진짜로',
                '의심이 많으시죠?\n<strong>정상입니다</strong>',
                '사기인지 아닌지\n<strong>직접 확인</strong>하세요'
            ],
            anti_ad: [
                '이건 광고예요\n근데 <strong>진심</strong>입니다',
                '모두에게\n<strong>추천하지 않아요</strong>',
                '안 맞으면\n<strong>안 하시면</strong> 됩니다',
                '궁금하면 보시고\n<strong>아니면 패스</strong>하세요'
            ]
        },
        
        // ============================================
        // 서브 카피 (신뢰 + 안심)
        // ============================================
        subCopies: [
            // 신뢰 구축
            '수강료 150~300만원 / 숨기지 않습니다',
            '전화 영업 안 합니다 / 카톡 상담 가능',
            '환불 규정 홈페이지에 공개되어 있습니다',
            '판단은 직접 보시고 하세요',
            
            // 두려움 해소
            '결정은 상담 후에 하셔도 됩니다',
            '10분 적성 체크 먼저 해보세요',
            '안 맞으면 안 하시면 됩니다',
            '궁금한 것만 확인하세요',
            
            // 기존 유지
            '하루 2시간, 집에서 시작하는 새로운 커리어',
            '자격증 취득부터 취업까지 올인원',
            '경력단절도 걱정 없는 전문직',
            '초보자도 4개월이면 충분합니다'
        ],
        
        // ============================================
        // CTA (낮은 부담감)
        // ============================================
        ctas: [
            // 부담 낮은 CTA (추천)
            '궁금한 것만 확인 →',
            '10분 적성 체크 →',
            '커리큘럼 먼저 보기 →',
            '가격 확인하기 →',
            '판단은 나중에, 일단 보기 →',
            
            // 기존 CTA
            '자세히 알아보기 →',
            '무료 상담 신청 →',
            '카톡으로 문의 →'
        ],
        
        // ============================================
        // 안심 메시지 (랜딩용)
        // ============================================
        trustMessages: [
            '전화 영업 안 합니다',
            '카톡 상담 가능 (원하시면)',
            '수강료 150~300만원 (과정별 상이)',
            '환불 규정 홈페이지 공개',
            '결제 압박 없습니다',
            '결정은 상담 후에'
        ],
        
        // ============================================
        // FAQ (두려움 직접 언급)
        // ============================================
        faq: [
            {
                q: '또 돈만 날리는 거 아닐까요?',
                a: '이해합니다. 그래서 10분 적성 체크를 먼저 권해드려요. 안 맞으면 안 하시면 됩니다.'
            },
            {
                q: '이 나이에 새로 시작해도 될까요?',
                a: '수강생 62%가 30~40대입니다. 38살에 시작해서 지금 3년차인 분도 계세요.'
            },
            {
                q: '무료 상담 = 영업 아닌가요?',
                a: '전화 안 합니다. 카톡이나 문자로 답변드려요. 결정은 상담 후에 천천히 하세요.'
            },
            {
                q: '왜 가격을 바로 안 보여주나요?',
                a: '150~300만원입니다. 과정별로 다르고, 상담에서 맞는 과정을 찾아드려요.'
            },
            {
                q: '성공 사례, 진짜인가요?',
                a: '실명, 나이, 시작 전 직업 다 공개합니다. 의심되시면 직접 연락처 드릴 수도 있어요.'
            },
            {
                q: '300만원이 부담됩니다',
                a: '월 25만원 분할 가능합니다. 하루 8천원, 커피 2잔 값이에요. 그리고 1주일 내 100% 환불 가능합니다.'
            },
            {
                q: '중간에 포기하면 어떻게 되나요?',
                a: '중간에 멈춰도 배운 것은 남습니다. 자격증 취득 전이라도 기초 스킬은 평생 유효해요.'
            }
        ],

        // ============================================
        // 가격 설득용 카피
        // ============================================
        pricePersuasion: {
            // 리스크 분산 메시지
            riskDistribution: [
                '전부를 걸지 마세요\n<strong>단계별로</strong> 확인하세요',
                '100만원짜리 <strong>3단계</strong>\n중간에 멈춰도 괜찮아요',
                '1주일 들어보시고\n<strong>아니다 싶으면</strong> 전액 환불'
            ],
            // 시간 비용 비교
            timeCost: [
                '혼자 독학 12개월\n체계적 학습 <strong>4개월</strong>',
                '시행착오에 쓸 시간을\n<strong>수입에</strong> 쓰세요',
                '1년 전에 시작했다면\n<strong>지금 어디</strong> 있을까요?'
            ],
            // 기회비용
            opportunityCost: [
                '6개월 후:\n"그때 시작할걸..."',
                '300만원은 다시 모을 수 있어요\n<strong>시간</strong>은 안 돌아와요',
                '고민하는 동안\n<strong>1년</strong>이 지났습니다'
            ],
            // 분할 납부
            installment: [
                '월 <strong>25만원</strong>\n하루 8천원입니다',
                '커피 2잔 값으로\n<strong>평생 스킬</strong> 하나',
                '부담 없이 시작하세요\n<strong>12개월</strong> 분할 가능'
            ],
            // 진입 장벽 낮추기
            lowBarrier: [
                '타이핑 느려도 괜찮아요\n<strong>47%</strong>가 200타 이하 시작',
                '최고령 수강생 <strong>58세</strong>\n지금 프리랜서 2년차',
                '월 300만원이 목표 아니어도 돼요\n<strong>레벨 1</strong>부터 시작하세요'
            ]
        }
    }
};

// 기본 템플릿 (새로운 주제 추가 시 참고용)
// ============================================
// GENERIC CONTENT TEMPLATES
// Platform-agnostic copy framework
// ============================================

const DEFAULT_TEMPLATE = {
    keywords: [],
    benefits: [
        '효율성 증가',
        '비용 절감',
        '시간 절약',
        '생산성 향상',
        '품질 개선',
        '확장성'
    ],
    stats: [
        { number: '50%', label: '효율 향상' },
        { number: '2배', label: '성장률' },
        { number: '30%', label: '비용 절감' }
    ],
    hooks: {
        benefit: [
            '더 나은 결과를 원하시나요?',
            '성장의 새로운 기회',
            '효율적인 솔루션',
            '목표 달성을 위한 첫걸음',
            '스마트한 선택'
        ],
        question: [
            '더 나은 방법이 있다면?',
            '왜 아직도 힘들게 하시나요?',
            '고민되시나요?',
            '찾고 계셨던 해결책',
            '준비되셨나요?'
        ],
        story: [
            '성공 사례를 확인하세요',
            '이렇게 시작했습니다',
            '작은 변화가 큰 결과로',
            '직접 경험해보세요',
            '함께 성장하세요'
        ],
        stats: [
            '숫자가 증명합니다',
            '데이터 기반 성과',
            '검증된 결과',
            '실제 성과 데이터',
            '측정 가능한 성장'
        ],
        compare: [
            '차이를 경험하세요',
            '더 나은 선택',
            '비교해보세요',
            '왜 달라야 하는가',
            '업그레이드된 경험'
        ],
        urgency: [
            '지금 시작하세요',
            '한정된 기회',
            '놓치지 마세요',
            '특별 혜택 진행중',
            '마감 임박'
        ],
        fear_address: [
            '걱정 없이 시작하세요',
            '리스크 없는 선택',
            '안심하고 진행하세요',
            '검증된 안전함',
            '실패 걱정은 그만'
        ],
        anti_ad: [
            '솔직하게 말씀드릴게요',
            '과장 없이 알려드립니다',
            '광고 같지 않죠?',
            '진짜 이야기입니다',
            '있는 그대로'
        ]
    },
    mainCopies: {
        benefit: [
            '<strong>더 나은 결과</strong>를\n경험하세요',
            '효율적인 <strong>솔루션</strong>으로\n목표를 달성하세요',
            '<strong>성장</strong>을 위한\n스마트한 선택'
        ],
        question: [
            '지금 <strong>변화</strong>가\n필요하신가요?',
            '더 <strong>효율적인 방법</strong>을\n찾고 계신가요?',
            '<strong>해결책</strong>이\n여기 있습니다'
        ],
        story: [
            '저도 <strong>처음엔</strong>\n몰랐어요',
            '<strong>작은 시작</strong>이\n큰 변화를 만들었습니다',
            '<strong>성공</strong>의 비결을\n공유합니다'
        ],
        stats: [
            '<strong>데이터</strong>가\n증명합니다',
            '<strong>검증된 성과</strong>로\n신뢰할 수 있습니다',
            '<strong>실제 결과</strong>를\n확인하세요'
        ],
        compare: [
            '<strong>차이</strong>를\n느껴보세요',
            '기존 방식과 <strong>비교</strong>해보세요',
            '<strong>더 나은 선택</strong>이\n있습니다'
        ],
        urgency: [
            '지금이 <strong>최적의 시기</strong>입니다',
            '<strong>한정 혜택</strong>\n놓치지 마세요',
            '지금 <strong>시작</strong>하세요'
        ],
        fear_address: [
            '<strong>걱정 없이</strong>\n시작하세요',
            '<strong>리스크 제로</strong>로\n안심하세요',
            '<strong>검증된 방법</strong>으로\n안전하게'
        ],
        anti_ad: [
            '<strong>솔직한 이야기</strong>를\n들어보세요',
            '과장 없이\n<strong>있는 그대로</strong>',
            '<strong>진짜</strong>를\n보여드립니다'
        ]
    },
    subCopies: [
        '지금 바로 시작하세요',
        '무료로 체험해보세요',
        '전문가와 상담하세요',
        '더 자세히 알아보세요',
        '첫 걸음을 내딛으세요',
        '성공 사례를 확인하세요'
    ],
    ctas: [
        '자세히 보기',
        '시작하기',
        '무료 체험',
        '상담 신청',
        '지금 가입',
        '더 알아보기'
    ]
};

// Generic content entry for new topics
const GENERIC_CONTENT = {
    ...DEFAULT_TEMPLATE,
    keywords: ['제품', '서비스', '솔루션'],
    benefits: [
        '효율성 증가',
        '비용 절감',
        '시간 절약',
        '생산성 향상',
        '품질 개선',
        '확장성',
        '사용 편의성',
        'ROI 개선'
    ]
};

// 유틸리티 함수들
const ContentUtils = {
    // 주제에 맞는 콘텐츠 가져오기
    getContent(topic) {
        // 특정 주제가 DB에 있으면 사용
        if (topic && CONTENT_DATABASE[topic]) {
            return CONTENT_DATABASE[topic];
        }
        // 없으면 generic 콘텐츠 생성
        return this.generateDefaultContent(topic || 'generic');
    },

    // 기본 콘텐츠 생성 (DB에 없는 주제용)
    generateDefaultContent(topic) {
        const content = JSON.parse(JSON.stringify(GENERIC_CONTENT));
        content.keywords = [topic];
        
        // 주제가 비어있으면 그대로 반환
        if (!topic || topic === 'generic') {
            return content;
        }
        
        // 훅 카피에 주제 반영 (옵션)
        Object.keys(content.hooks).forEach(type => {
            content.hooks[type] = content.hooks[type].map(hook => {
                // 제품/서비스 관련 키워드 치환
                if (hook.includes('솔루션')) {
                    return hook.replace('솔루션', topic);
                }
                return hook;
            });
        });

        return content;
    },

    // 랜덤 선택
    randomPick(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    // 여러 개 랜덤 선택 (중복 없이)
    randomPickMultiple(array, count) {
        const shuffled = [...array].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    },

    // 타겟에 맞는 훅 생성
    generateTargetedHook(topic, target, template) {
        const content = this.getContent(topic);
        const persona = TARGET_PERSONAS[target];
        const hooks = content.hooks[template];
        
        // 기본 훅 선택
        let hook = this.randomPick(hooks);
        
        // 타겟에 맞게 변형 가능
        if (target === 'housewife' && hook.includes('출근')) {
            hook = hook.replace('출근', '집에서');
        }
        
        return hook;
    },

    // 전체 광고 콘텐츠 세트 생성
    generateAdSet(topic, template, targets) {
        const content = this.getContent(topic);
        
        // 주제가 있으면 배지에 표시, 없으면 빈 문자열
        const badge = topic && topic !== 'generic' ? topic : '';
        
        return {
            badge: badge,
            hook: this.randomPick(content.hooks[template] || content.hooks.benefit),
            main: this.randomPick(content.mainCopies[template] || content.mainCopies.benefit),
            sub: this.randomPick(content.subCopies),
            cta: this.randomPick(content.ctas)
        };
    },

    // 월간 콘텐츠 계획 생성 (20개) - 30~40대 광고 피로 타겟 최적화
    generateMonthlyPlan(topic, targets) {
        // 8개 템플릿 (두려움 언급 + 안티광고 추가)
        // 30~40대 타겟에게 효과적인 fear_address, anti_ad를 더 많이 배치
        const templates = [
            'benefit',      // Week 1
            'fear_address', // Week 1 - 두려움 직접 언급 (핵심)
            'story',        // Week 1
            'anti_ad',      // Week 1 - 안티광고 (차별화)
            'question',     // Week 1
            
            'stats',        // Week 2
            'fear_address', // Week 2
            'compare',      // Week 2
            'story',        // Week 2
            'anti_ad',      // Week 2
            
            'benefit',      // Week 3
            'question',     // Week 3
            'fear_address', // Week 3
            'stats',        // Week 3
            'story',        // Week 3
            
            'urgency',      // Week 4 - 마감형 (마지막 주에 배치)
            'anti_ad',      // Week 4
            'fear_address', // Week 4
            'compare',      // Week 4
            'urgency'       // Week 4
        ];
        
        const content = this.getContent(topic);
        const plan = [];

        // 20개 생성
        for (let i = 0; i < 20; i++) {
            const template = templates[i];
            const adSet = this.generateAdSet(topic, template, targets);
            
            plan.push({
                id: i + 1,
                week: Math.ceil((i + 1) / 5),
                template,
                ...adSet,
                colorTheme: this.getRotatingTheme(i),
                ratio: this.getRotatingRatio(i)
            });
        }

        return plan;
    },

    // 테마 로테이션
    getRotatingTheme(index) {
        const themes = ['professional', 'warm', 'nature', 'energy', 'modern', 'trust'];
        return themes[index % themes.length];
    },

    // 비율 로테이션
    getRotatingRatio(index) {
        const ratios = ['1:1', '4:5', '9:16', '1:1', '4:5']; // 피드 비율 위주
        return ratios[index % ratios.length];
    }
};

// 콘텐츠 라이브러리 UI용 데이터 (30~40대 최적화)
const CONTENT_LIBRARY = {
    hooks: [
        // 기존 (과장형 - 주의)
        { text: '매달 300만원 이상?', category: 'benefit', warning: '과장 주의' },
        
        // 담담한 톤 (추천)
        { text: '36살, 퇴사 6개월 차입니다', category: 'benefit', recommended: true },
        { text: '솔직하게 말할게요', category: 'benefit', recommended: true },
        
        // 공감형 (추천)
        { text: '퇴근 후 뭐 하세요?', category: 'question', recommended: true },
        { text: '또 강의? 라고 생각하셨죠', category: 'question', recommended: true },
        
        // 스토리 (실패 인정)
        { text: '저도 3번 실패하고 찾았어요', category: 'story', recommended: true },
        { text: '38살, 경력 공백 4년', category: 'story', recommended: true },
        
        // 통계 (신뢰)
        { text: '수강생 73%가 6개월 내 수입 발생', category: 'stats', recommended: true },
        { text: '30대 수강생 비율 62%', category: 'stats', recommended: true },
        
        // 비교
        { text: '강의 수집 vs 실제 수입', category: 'compare' },
        
        // 두려움 언급 (핵심)
        { text: '"내가 될 수 있을까?" 저도요', category: 'fear_address', recommended: true },
        { text: '"돈만 날리는 거 아닐까?"', category: 'fear_address', recommended: true },
        { text: '의심하는 게 정상입니다', category: 'fear_address', recommended: true },
        
        // 안티광고 (차별화)
        { text: '이건 광고입니다, 근데요', category: 'anti_ad', recommended: true },
        { text: '클릭 안 하셔도 됩니다', category: 'anti_ad', recommended: true },
        { text: '안 맞으면 안 하시면 됩니다', category: 'anti_ad', recommended: true }
    ],
    benefits: [
        { text: '재택근무 가능', icon: 'home' },
        { text: '시간당 높은 수입', icon: 'money' },
        { text: '유연한 근무시간', icon: 'time' },
        { text: '경력단절 극복', icon: 'career' },
        { text: '4개월 완성', icon: 'calendar' },
        { text: '초기 비용 적음', icon: 'cost' }
    ],
    // 서브카피 (신뢰/안심)
    subCopies: [
        { text: '수강료 150~300만원 / 숨기지 않습니다', type: 'trust', recommended: true },
        { text: '전화 영업 안 합니다 / 카톡 상담 가능', type: 'trust', recommended: true },
        { text: '결정은 상담 후에 하셔도 됩니다', type: 'reassure', recommended: true },
        { text: '10분 적성 체크 먼저 해보세요', type: 'reassure', recommended: true },
        { text: '안 맞으면 안 하시면 됩니다', type: 'reassure', recommended: true }
    ],
    ctas: [
        // 낮은 부담 (추천)
        { text: '궁금한 것만 확인 →', style: 'low-pressure', recommended: true },
        { text: '10분 적성 체크 →', style: 'low-pressure', recommended: true },
        { text: '커리큘럼 먼저 보기 →', style: 'low-pressure', recommended: true },
        { text: '가격 확인하기 →', style: 'low-pressure', recommended: true },
        { text: '판단은 나중에, 일단 보기 →', style: 'low-pressure', recommended: true },
        
        // 기존
        { text: '자세히 알아보기 →', style: 'primary' },
        { text: '무료 상담 신청 →', style: 'secondary' },
        { text: '카톡으로 문의 →', style: 'chat' }
    ],
    // 안심 메시지 (랜딩용)
    trustBadges: [
        { text: '전화 영업 안 합니다', type: 'no-call' },
        { text: '카톡 상담 가능', type: 'chat' },
        { text: '수강료 150~300만원', type: 'price' },
        { text: '환불 규정 홈페이지 공개', type: 'refund' },
        { text: '결제 압박 없습니다', type: 'no-pressure' },
        { text: '결정은 상담 후에', type: 'reassure' }
    ]
};

// ============================================
// 가격 설득 로직 (300만원 = "시도해볼 수 있다")
// ============================================
const PRICE_PERSUASION = {
    // 현재 가격 인식 (문제점)
    currentPerception: {
        surfaceThoughts: [
            '"300만원이면 비싸네"',
            '"그 돈이면 다른 거 할 수 있는데"',
            '"진짜 효과 있을까?"'
        ],
        realFears: [
            '"또 실패하면 어떡하지"',
            '"가족한테 뭐라고 하지"',
            '"내가 중간에 포기하면?"',
            '"이미 몇 번 돈 날렸는데..."'
        ],
        wrongComparisons: [
            { text: '월급 한 달치', feeling: 'burden' },
            { text: '여행 3번', feeling: 'regret' },
            { text: '과거 실패 경험', feeling: 'trauma' }
        ]
    },

    // 리스크 분산 구조
    riskSegmentation: {
        stages: [
            { name: '적성 확인', cost: '무료', outcome: '안 맞으면 Stop' },
            { name: '기초 학습', cost: '100만원', outcome: '평생 스킬' },
            { name: '자격 취득', cost: '+100만원', outcome: '평생 유효' },
            { name: '수입 발생', cost: '+100만원', outcome: '성공' }
        ],
        keyMessage: '중간에 멈춰도 이미 얻은 것이 있다'
    },

    // 안전장치
    safetyNets: [
        { name: '환불 정책', desc: '1주일 내 100% 환불', message: '1주일 들어보고 안 맞으면 전액 환불' },
        { name: '분할 납부', desc: '월 25만원 × 12개월', message: '하루 8천원, 커피 2잔 값' },
        { name: '중도 전환', desc: '다른 과정으로 전환 가능', message: '안 맞으면 다른 과정으로' },
        { name: '평생 복습', desc: '수강 기간 제한 없음', message: '한 번 결제, 평생 접근' },
        { name: '취업 연계', desc: '취업 못 하면 추가 지원', message: '취업까지 무상 연장' }
    ],

    // 비교 기준 재설정
    comparisonReframe: {
        time: {
            selfStudy: { months: '12~24', hours: 480, cost: 960, unit: '만원 (시간 가치)' },
            guided: { months: '3~4', hours: 160, cost: 300, unit: '만원' },
            savings: '640만원 시간 가치 확보'
        },
        opportunity: {
            sixMonths: '"그때 시작할걸... 지금쯤 자격증 땄겠네"',
            oneYear: '"벌써 1년... 여전히 같은 고민"',
            threeYears: '"이제 와서 늦은 것 같아"',
            keyQuestion: '1년 전에 시작했다면 지금 어디 있을까요?'
        },
        reversibility: {
            irreversible: ['이사', '이직', '결혼/이혼'],
            reversible: ['자기계발 투자'],
            message: '300만원은 다시 모을 수 있지만, 시도하지 않은 시간은 돌아오지 않습니다'
        }
    },

    // 진입 장벽 낮추기
    loweringBarriers: {
        notNeeded: [
            '타이핑 300타 이상 (배우면서 늘어남)',
            '관련 전공/경험 (전공자 12%뿐)',
            '젊은 나이 (30~40대가 62%)',
            '완벽한 집중 환경 (육아 중 시작 34%)'
        ],
        needed: [
            '하루 1~2시간 투자 의지',
            '기본 컴퓨터 사용 가능',
            '3개월간 꾸준히 학습할 환경',
            '새로운 것을 배우려는 마음'
        ],
        successLevels: [
            { level: 1, name: '시작했다', message: '시작한 것 자체가 상위 10%' },
            { level: 2, name: '1개월 버텼다', message: '여기까지 온 것만으로도 대단해요' },
            { level: 3, name: '자격증 취득', message: '평생 유효한 자산' },
            { level: 4, name: '첫 수입 발생', message: '10만원이든 100만원이든' },
            { level: 5, name: '월 100만원+', message: '본격적인 부업 레벨' },
            { level: 6, name: '월 300만원+', message: '본업 전환 가능 레벨' }
        ]
    },

    // 상담 핵심 질문 5가지
    consultationQuestions: [
        {
            id: 1,
            category: '동기 확인',
            question: '왜 속기사에 관심을 갖게 되셨어요?',
            purpose: '진짜 동기 vs 순간적 관심 구분',
            goodAnswers: ['구체적 이유', '재택 필요', '부수입 필요', '경력 전환'],
            warningAnswers: ['그냥 좋아 보여서'],
            followUp: '그 상황이 얼마나 급하신가요?'
        },
        {
            id: 2,
            category: '과거 경험 확인',
            question: '이전에 비슷한 자기계발이나 강의를 들어보신 적 있으세요?',
            purpose: '실패 트라우마 파악 + 공감',
            response: '그렇군요. 그때 왜 안 됐다고 생각하세요?',
            differentiation: '저희는 그 부분을 이렇게 해결합니다...'
        },
        {
            id: 3,
            category: '현실 조건 확인',
            question: '하루에 어느 정도 시간을 투자할 수 있으세요?',
            purpose: '현실적 가능성 체크 (무리한 등록 방지)',
            thresholds: {
                good: '1~2시간 → 충분',
                warning: '30분 미만 → 솔직하게 어렵다고 안내'
            },
            honestResponse: '솔직히 하루 30분으로는 어렵습니다. 1시간 이상 확보 가능하실 때 다시 연락 주세요.'
        },
        {
            id: 4,
            category: '두려움 직접 질문',
            question: '솔직히 가장 걱정되는 부분이 뭐예요?',
            purpose: '숨겨진 반대 의견(objection) 표면화',
            commonObjections: {
                '돈이 아까울까봐': '1주일 환불 정책 있어요. 1주일 들어보시고 아니다 싶으면 전액 돌려드려요.',
                '끝까지 할 수 있을까': '73%가 완주합니다. 혼자 하면 10%도 안 돼요.',
                '가족이 반대할 것 같아': '필요하시면 가족분과 함께 통화해도 괜찮아요.'
            }
        },
        {
            id: 5,
            category: '결정 시점 확인',
            question: '오늘 바로 결정하실 필요는 없어요. 충분히 생각해보시고, 언제쯤 결정하실 것 같으세요?',
            purpose: '압박 없이 타임라인 설정',
            effects: ['압박감 제거 → 신뢰 상승', '"나중에"가 아닌 "언제"로 전환'],
            followUp: '그때까지 궁금한 거 있으시면 편하게 카톡 주세요. 제가 OO일에 한 번 더 연락드려도 될까요?'
        }
    ]
};

// 전역으로 내보내기
window.CUSTOMER_JOURNEY = CUSTOMER_JOURNEY;
window.TARGET_PERSONAS = TARGET_PERSONAS;
window.CONTENT_DATABASE = CONTENT_DATABASE;
window.ContentUtils = ContentUtils;
window.CONTENT_LIBRARY = CONTENT_LIBRARY;
window.PRICE_PERSUASION = PRICE_PERSUASION;

