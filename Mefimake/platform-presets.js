// ============================================
// PLATFORM PRESETS - Copy Templates Per Platform
// ============================================

const PLATFORM_PRESETS = {
    meta: {
        id: 'meta',
        name: 'Meta Ads',
        icon: 'M',
        description: 'Facebook & Instagram Ads',
        copyStyle: {
            hook: 'emotional',
            primary: 'benefit-driven',
            cta: 'soft'
        },
        defaults: {
            hookMaxLength: 40,
            primaryMaxLength: 80,
            supportingMaxLength: 60,
            ctaMaxLength: 20
        },
        templates: {
            benefit: {
                hookPatterns: [
                    '{benefit}을 원하시나요?',
                    '매일 {benefit}을 누리세요',
                    '{benefit}, 지금 시작하세요'
                ],
                primaryPatterns: [
                    '{solution}으로\n{outcome}을 경험하세요',
                    '단 {time}만에\n{result}를 달성하세요'
                ],
                supportingPatterns: [
                    '{detail}로 더 쉽게, 더 빠르게',
                    '{feature} 지원으로 걱정 없이'
                ],
                ctaPatterns: ['자세히 보기', '시작하기', '무료 체험']
            },
            question: {
                hookPatterns: [
                    '{problem} 고민이신가요?',
                    '왜 {pain}을 참고 계신가요?',
                    '{question}?'
                ],
                primaryPatterns: [
                    '{solution}이\n해답입니다',
                    '이제 {result}할 수 있습니다'
                ],
                supportingPatterns: [
                    '{count}명이 이미 선택했습니다',
                    '{time} 안에 결과를 확인하세요'
                ],
                ctaPatterns: ['해결책 보기', '알아보기', '상담받기']
            },
            story: {
                hookPatterns: [
                    '{person}의 이야기',
                    '"{quote}"',
                    '{transformation} 스토리'
                ],
                primaryPatterns: [
                    '{before}에서\n{after}로',
                    '{journey}의\n시작'
                ],
                supportingPatterns: [
                    '당신도 할 수 있습니다',
                    '지금 시작하세요'
                ],
                ctaPatterns: ['스토리 보기', '나도 시작', '더 알아보기']
            },
            urgency: {
                hookPatterns: [
                    '⏰ {deadline} 마감!',
                    '🔥 {limit}명 한정',
                    '마지막 기회!'
                ],
                primaryPatterns: [
                    '{discount} 할인\n오늘까지만',
                    '지금 신청하면\n{bonus} 추가 제공'
                ],
                supportingPatterns: [
                    '선착순 마감 임박',
                    '다시 없을 기회'
                ],
                ctaPatterns: ['지금 신청', '바로 시작', '놓치지 마세요']
            },
            fear_address: {
                hookPatterns: [
                    '{fear}이 두려우신가요?',
                    '{worry} 걱정되시나요?',
                    '이대로 괜찮을까요?'
                ],
                primaryPatterns: [
                    '{solution}으로\n불안을 해소하세요',
                    '더 이상 {pain}에\n시달리지 마세요'
                ],
                supportingPatterns: [
                    '검증된 방법으로 안심하세요',
                    '{guarantee} 보장'
                ],
                ctaPatterns: ['해결하기', '상담받기', '지금 시작']
            },
            compare: {
                hookPatterns: [
                    '{optionA} vs {optionB}',
                    '기존 방식의 한계',
                    '더 나은 선택'
                ],
                primaryPatterns: [
                    '{old}는 그만\n{new}로 바꾸세요',
                    '{difference}가\n다릅니다'
                ],
                supportingPatterns: [
                    '{percent}% 더 효율적',
                    '{advantage} 우위'
                ],
                ctaPatterns: ['비교하기', '차이 확인', '선택하기']
            }
        }
    },
    
    google: {
        id: 'google',
        name: 'Google Ads',
        icon: 'G',
        description: 'Display & Search Ads',
        copyStyle: {
            hook: 'direct',
            primary: 'value-proposition',
            cta: 'clear'
        },
        defaults: {
            hookMaxLength: 30,
            primaryMaxLength: 90,
            supportingMaxLength: 45,
            ctaMaxLength: 15
        },
        templates: {
            benefit: {
                hookPatterns: [
                    '{product} - {benefit}',
                    '{result} 달성',
                    '{solution} 제공'
                ],
                primaryPatterns: [
                    '{feature}로 {outcome} 실현',
                    '{service}로 {goal} 달성'
                ],
                supportingPatterns: [
                    '지금 바로 시작',
                    '{guarantee} 보장'
                ],
                ctaPatterns: ['시작하기', '가입하기', '구매하기']
            },
            question: {
                hookPatterns: [
                    '{solution} 찾으시나요?',
                    '{product} 필요하신가요?',
                    '{service} 검색 중?'
                ],
                primaryPatterns: [
                    '{brand}에서 {solution} 제공',
                    '{feature} 포함 {product}'
                ],
                supportingPatterns: [
                    '무료 상담 가능',
                    '즉시 이용 가능'
                ],
                ctaPatterns: ['문의하기', '견적받기', '신청하기']
            },
            urgency: {
                hookPatterns: [
                    '{discount}% 할인 진행중',
                    '한정 특가',
                    '{deadline} 마감'
                ],
                primaryPatterns: [
                    '{product} {price}원부터',
                    '최대 {discount}% 할인'
                ],
                supportingPatterns: [
                    '오늘만 특가',
                    '수량 한정'
                ],
                ctaPatterns: ['구매하기', '할인받기', '신청하기']
            }
        }
    },
    
    mobion: {
        id: 'mobion',
        name: 'Mobion',
        icon: 'M',
        description: 'Mobile Native Ads',
        copyStyle: {
            hook: 'promotional',
            primary: 'offer-focused',
            cta: 'action'
        },
        defaults: {
            hookMaxLength: 35,
            primaryMaxLength: 70,
            supportingMaxLength: 50,
            ctaMaxLength: 18
        },
        templates: {
            benefit: {
                hookPatterns: [
                    '🎁 {offer} 증정',
                    '💰 {discount} 할인',
                    '✨ {benefit} 혜택'
                ],
                primaryPatterns: [
                    '지금 가입하면\n{bonus} 제공',
                    '신규 회원\n{gift} 증정'
                ],
                supportingPatterns: [
                    '가입 즉시 지급',
                    '추가 혜택 포함'
                ],
                ctaPatterns: ['혜택받기', '가입하기', '받으러 가기']
            },
            urgency: {
                hookPatterns: [
                    '⚡ 선착순 {count}명',
                    '🔥 {hours}시간 한정',
                    '⏰ 오늘 마감!'
                ],
                primaryPatterns: [
                    '{product}\n최대 {discount}% OFF',
                    '단 {price}원!\n{value}원 상당'
                ],
                supportingPatterns: [
                    '마감 임박',
                    '곧 종료'
                ],
                ctaPatterns: ['지금 구매', '바로가기', '놓치지 마세요']
            }
        }
    },
    
    youtube: {
        id: 'youtube',
        name: 'YouTube',
        icon: 'Y',
        description: 'Thumbnails & Ads',
        copyStyle: {
            hook: 'curiosity',
            primary: 'minimal',
            cta: 'implicit'
        },
        defaults: {
            hookMaxLength: 50,
            primaryMaxLength: 40,
            supportingMaxLength: 0,
            ctaMaxLength: 0
        },
        templates: {
            curiosity: {
                hookPatterns: [
                    '{shock}... 결과는?',
                    '이거 실화임?',
                    '{question}의 진실'
                ],
                primaryPatterns: [
                    '{reveal}',
                    '충격 반전'
                ],
                supportingPatterns: [],
                ctaPatterns: []
            },
            listicle: {
                hookPatterns: [
                    '{number}가지 비밀',
                    'TOP {number}',
                    '{topic} 총정리'
                ],
                primaryPatterns: [
                    '이것만 알면 됨',
                    '완벽 가이드'
                ],
                supportingPatterns: [],
                ctaPatterns: []
            },
            howto: {
                hookPatterns: [
                    '{goal} 하는 법',
                    '{result} 만들기',
                    '이렇게 하세요'
                ],
                primaryPatterns: [
                    '초보자도 가능',
                    '5분 완성'
                ],
                supportingPatterns: [],
                ctaPatterns: []
            }
        }
    },
    
    landing: {
        id: 'landing',
        name: 'Landing Page',
        icon: 'L',
        description: 'Hero Section',
        copyStyle: {
            hook: 'headline',
            primary: 'subheadline',
            cta: 'button'
        },
        defaults: {
            hookMaxLength: 60,
            primaryMaxLength: 120,
            supportingMaxLength: 80,
            ctaMaxLength: 25
        },
        templates: {
            hero: {
                hookPatterns: [
                    '{value}을 실현하세요',
                    '{outcome}의 시작',
                    '{transformation}을 경험하세요'
                ],
                primaryPatterns: [
                    '{product}는 {benefit}을 제공합니다.\n{feature}로 {result}를 달성하세요.',
                    '{pain}을 해결하는 가장 스마트한 방법.\n{solution}과 함께 시작하세요.'
                ],
                supportingPatterns: [
                    '✓ {feature1}  ✓ {feature2}  ✓ {feature3}',
                    '{count}+ 고객사 신뢰 | {rating} 평점'
                ],
                ctaPatterns: ['무료로 시작하기', '지금 가입하기', '데모 신청하기']
            },
            product: {
                hookPatterns: [
                    '{product}로 {goal} 달성',
                    '더 나은 {category}',
                    '{brand}의 새로운 {product}'
                ],
                primaryPatterns: [
                    '{feature}을 갖춘 {product}.\n{benefit}을 경험하세요.',
                    '{differentiator}가 다른 {product}.\n{outcome}을 보장합니다.'
                ],
                supportingPatterns: [
                    '30일 무료 체험 | 환불 보장',
                    '설치 불필요 | 즉시 시작'
                ],
                ctaPatterns: ['무료 체험 시작', '제품 둘러보기', '견적 요청']
            },
            service: {
                hookPatterns: [
                    '{service}의 새로운 기준',
                    '전문가와 함께하는 {service}',
                    '{goal}을 위한 {service}'
                ],
                primaryPatterns: [
                    '{experience}년 경험의 전문가가\n{outcome}을 도와드립니다.',
                    '{service}로 {result}를 달성하세요.\n{process}로 쉽게 시작합니다.'
                ],
                supportingPatterns: [
                    '무료 상담 제공 | 맞춤 솔루션',
                    '{clients}+ 성공 사례'
                ],
                ctaPatterns: ['무료 상담 신청', '서비스 알아보기', '견적 받기']
            }
        }
    }
};

// Copy Framework - Generic placeholders
const COPY_FRAMEWORK = {
    placeholders: {
        benefit: ['수익 증대', '시간 절약', '비용 절감', '생산성 향상', '성장'],
        problem: ['복잡한 프로세스', '높은 비용', '시간 부족', '낮은 효율'],
        solution: ['스마트 솔루션', '자동화 시스템', '전문 서비스', 'AI 기반 툴'],
        outcome: ['성공', '목표 달성', '성장', '변화'],
        result: ['2배 성장', '50% 절감', '즉시 효과', '빠른 결과'],
        time: ['단 5분', '하루 만에', '일주일 내', '한 달 후'],
        discount: ['30', '50', '70'],
        count: ['100', '500', '1000'],
        guarantee: ['100% 환불', '무료 체험', '성과 보장']
    },
    
    fillPattern(pattern, values = {}) {
        let result = pattern;
        const allPlaceholders = { ...this.placeholders, ...values };
        
        for (const [key, value] of Object.entries(allPlaceholders)) {
            const regex = new RegExp(`\\{${key}\\}`, 'g');
            const replacement = Array.isArray(value) 
                ? value[Math.floor(Math.random() * value.length)]
                : value;
            result = result.replace(regex, replacement);
        }
        
        return result;
    }
};

// Get platform preset
function getPlatformPreset(platformId) {
    return PLATFORM_PRESETS[platformId] || PLATFORM_PRESETS.meta;
}

// Get available platforms
function getAvailablePlatforms() {
    return Object.values(PLATFORM_PRESETS).map(p => ({
        id: p.id,
        name: p.name,
        icon: p.icon,
        description: p.description
    }));
}

// Generate copy for platform
function generatePlatformCopy(platformId, templateType, customValues = {}) {
    const preset = getPlatformPreset(platformId);
    const template = preset.templates[templateType] || Object.values(preset.templates)[0];
    
    const hook = template.hookPatterns.length > 0
        ? COPY_FRAMEWORK.fillPattern(
            template.hookPatterns[Math.floor(Math.random() * template.hookPatterns.length)],
            customValues
        )
        : '';
    
    const primary = template.primaryPatterns.length > 0
        ? COPY_FRAMEWORK.fillPattern(
            template.primaryPatterns[Math.floor(Math.random() * template.primaryPatterns.length)],
            customValues
        )
        : '';
    
    const supporting = template.supportingPatterns.length > 0
        ? COPY_FRAMEWORK.fillPattern(
            template.supportingPatterns[Math.floor(Math.random() * template.supportingPatterns.length)],
            customValues
        )
        : '';
    
    const cta = template.ctaPatterns.length > 0
        ? template.ctaPatterns[Math.floor(Math.random() * template.ctaPatterns.length)]
        : '';
    
    return {
        hook: hook.substring(0, preset.defaults.hookMaxLength),
        primary: primary.substring(0, preset.defaults.primaryMaxLength),
        supporting: supporting.substring(0, preset.defaults.supportingMaxLength),
        cta: cta.substring(0, preset.defaults.ctaMaxLength)
    };
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PLATFORM_PRESETS, COPY_FRAMEWORK, getPlatformPreset, getAvailablePlatforms, generatePlatformCopy };
}
