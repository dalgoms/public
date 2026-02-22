/**
 * ============================================
 * CREATIVE ENGINE - AI Content Generation
 * ============================================
 */

class CreativeEngine {
    constructor() {
        this.templates = {
            benefit: {
                headlines: [
                    '{keyword}로 더 나은 결과를',
                    '{keyword}의 힘을 경험하세요',
                    '당신의 {keyword}를 업그레이드',
                    '{keyword}로 시작하는 변화'
                ],
                subtexts: [
                    '지금 바로 시작하면<br><strong>놀라운 변화</strong>를 경험합니다',
                    '전문가들이 선택한<br><strong>검증된 솔루션</strong>',
                    '더 스마트하게,<br><strong>더 효율적으로</strong>'
                ],
                ctas: ['지금 시작하기 →', '무료로 체험하기', '자세히 알아보기']
            },
            question: {
                headlines: [
                    '아직도 {keyword} 없이?',
                    '{keyword}, 어떻게 활용하세요?',
                    '왜 {keyword}인가요?'
                ],
                subtexts: [
                    '많은 사람들이 이미<br><strong>변화를 경험</strong>했습니다',
                    '당신만 모르고 있던<br><strong>비밀</strong>을 공개합니다'
                ],
                ctas: ['답을 확인하기', '지금 알아보기 →', '무료 상담받기']
            },
            story: {
                headlines: [
                    '{keyword}로 달라진 일상',
                    '처음엔 의심했습니다',
                    '3개월 전, 결심했습니다'
                ],
                subtexts: [
                    '그리고 지금,<br><strong>완전히 달라졌습니다</strong>',
                    '작은 변화가<br><strong>큰 결과</strong>로 이어졌습니다'
                ],
                ctas: ['이야기 더 보기', '나도 시작하기', '경험담 확인']
            },
            stats: {
                headlines: [
                    '{keyword} 사용자 97% 만족',
                    '3배 더 빠른 {keyword}',
                    '{keyword}로 50% 비용 절감'
                ],
                subtexts: [
                    '실제 데이터가<br><strong>증명합니다</strong>',
                    '숫자는 거짓말을<br><strong>하지 않습니다</strong>'
                ],
                ctas: ['데이터 확인하기', '리포트 받기', '무료 분석']
            },
            compare: {
                headlines: [
                    '기존 방식 vs {keyword}',
                    '{keyword} 전 vs 후',
                    '비교해보면 답이 나옵니다'
                ],
                subtexts: [
                    '차이를 직접<br><strong>확인하세요</strong>',
                    '선택은<br><strong>명확합니다</strong>'
                ],
                ctas: ['비교해보기', '차이 확인하기', '지금 전환하기']
            },
            urgency: {
                headlines: [
                    '지금이 기회입니다',
                    '{keyword} 마감 임박',
                    '오늘만 {keyword} 특가'
                ],
                subtexts: [
                    '놓치면 다시 없는<br><strong>특별한 기회</strong>',
                    '한정 수량,<br><strong>서두르세요</strong>'
                ],
                ctas: ['지금 신청 →', '마감 전 확인', '바로 구매하기']
            },
            fear_address: {
                headlines: [
                    '{keyword} 없이는 어렵습니다',
                    '방치하면 더 늦어집니다',
                    '이대로 괜찮으신가요?'
                ],
                subtexts: [
                    '지금 시작하면<br><strong>충분히 가능합니다</strong>',
                    '해결책은<br><strong>생각보다 가깝습니다</strong>'
                ],
                ctas: ['해결책 보기', '지금 상담받기', '무료 진단']
            },
            anti_ad: {
                headlines: [
                    '광고 아닙니다',
                    '솔직히 말씀드릴게요',
                    '{keyword}? 일단 의심하세요'
                ],
                subtexts: [
                    '직접 확인하고<br><strong>판단하세요</strong>',
                    '과장 없이<br><strong>있는 그대로</strong>'
                ],
                ctas: ['직접 확인하기', '팩트 체크', '무료 체험']
            }
        };
        
        this.platformModifiers = {
            meta: {
                headlineMaxLength: 40,
                style: 'emotional',
                ctaStyle: 'soft'
            },
            google: {
                headlineMaxLength: 30,
                style: 'direct',
                ctaStyle: 'action'
            },
            mobion: {
                headlineMaxLength: 35,
                style: 'promotional',
                ctaStyle: 'urgent'
            },
            youtube: {
                headlineMaxLength: 50,
                style: 'curiosity',
                ctaStyle: 'minimal'
            },
            landing: {
                headlineMaxLength: 60,
                style: 'professional',
                ctaStyle: 'prominent'
            }
        };
    }
    
    generateCreative(keyword, platform, template) {
        const templateData = this.templates[template] || this.templates.benefit;
        const modifier = this.platformModifiers[platform] || this.platformModifiers.meta;
        
        const headline = this.pickRandom(templateData.headlines)
            .replace(/{keyword}/g, keyword || '성장');
        
        const subtext = this.pickRandom(templateData.subtexts);
        
        const cta = this.pickRandom(templateData.ctas);
        
        return {
            headline: this.truncate(headline, modifier.headlineMaxLength),
            subtext: subtext,
            cta: cta,
            emphasis: this.extractEmphasis(subtext)
        };
    }
    
    pickRandom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    truncate(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 1) + '…';
    }
    
    extractEmphasis(text) {
        const match = text.match(/<strong>(.*?)<\/strong>/);
        return match ? match[1] : null;
    }
    
    generateVariants(keyword, platform, template, count = 5) {
        const variants = [];
        for (let i = 0; i < count; i++) {
            variants.push(this.generateCreative(keyword, platform, template));
        }
        return variants;
    }
}

// Global instance
window.creativeEngine = new CreativeEngine();
