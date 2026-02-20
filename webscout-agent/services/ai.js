/**
 * OpenAI API Helper Service
 * Handles AI-powered insights generation for WebScout Agent
 */

// Helper function to detect if text is primarily English (no Korean characters)
function isEnglish(text) {
  if (!text || typeof text !== 'string') return false;
  // Check if text contains Korean characters (Hangul)
  const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  return !koreanRegex.test(text);
}

// Helper function to translate English text to Korean using OpenAI
async function translateToKorean(text, apiKey) {
  if (!text || typeof text !== 'string') return text;
  if (!isEnglish(text)) {
    console.log('Text is already Korean:', text.substring(0, 50));
    return text;
  }
  
  console.log('Translating to Korean:', text.substring(0, 50));
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: '당신은 번역 전문가입니다. 주어진 영어 텍스트를 자연스러운 한국어로 번역해주세요. 전문 용어는 적절히 한국어로 번역하되, 의미를 정확히 전달해주세요. 번역된 텍스트만 반환해주세요.'
          },
          {
            role: 'user',
            content: `다음 영어 텍스트를 한국어로 번역해주세요. 번역된 텍스트만 반환해주세요:\n\n${text}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('Translation failed:', response.status, errorText);
      return text;
    }

    const data = await response.json();
    const translated = data.choices[0]?.message?.content?.trim() || text;
    console.log('Translation result:', translated.substring(0, 50));
    return translated;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

// Helper function to translate array of texts
async function translateArray(arr, apiKey) {
  if (!Array.isArray(arr)) return arr;
  const translated = await Promise.all(arr.map(item => {
    if (typeof item === 'string') {
      return translateToKorean(item, apiKey);
    } else if (typeof item === 'object' && item !== null) {
      return translateObject(item, apiKey);
    }
    return item;
  }));
  return translated;
}

// Helper function to translate object recursively
async function translateObject(obj, apiKey) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return await translateArray(obj, apiKey);
  }
  
  const translated = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip pageDistribution as it's numeric
    if (key === 'pageDistribution') {
      translated[key] = value;
      continue;
    }
    
    if (typeof value === 'string') {
      if (isEnglish(value)) {
        console.log(`Translating ${key}:`, value.substring(0, 50));
        translated[key] = await translateToKorean(value, apiKey);
        console.log(`Translated ${key}:`, translated[key].substring(0, 50));
      } else {
        translated[key] = value;
      }
    } else if (Array.isArray(value)) {
      translated[key] = await translateArray(value, apiKey);
    } else if (typeof value === 'object' && value !== null) {
      translated[key] = await translateObject(value, apiKey);
    } else {
      translated[key] = value;
    }
  }
  return translated;
}

export async function generateInsights({ domain, urls, language = 'en' }) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }

  // Prepare URL data and classify
  const urlData = urls.map(u => ({
    url: typeof u === 'string' ? u : u.url,
    depth: u.pathDepth || 0,
    tag: u.tag || 'other',
    importance: u.importance || 0
  }));

  // Classify URLs into categories based on path keywords
  const classified = {
    product: [],
    content: [],
    conversion: [],
    company: [],
    pricing: []
  };

  urlData.forEach(u => {
    const path = new URL(u.url).pathname.toLowerCase();
    
    // Pricing (check first as it's more specific)
    if (path.includes('/pricing') || path.includes('/price') || path.includes('/plan') || path.includes('/plans') || path.includes('/cost')) {
      classified.pricing.push(u);
    }
    // Product
    else if (path.includes('/product') || path.includes('/products') || path.includes('/app') || path.includes('/apps') || 
             path.includes('/dashboard') || path.includes('/feature') || path.includes('/features') || 
             path.includes('/solution') || path.includes('/solutions') || path.includes('/tool') || path.includes('/tools')) {
      classified.product.push(u);
    }
    // Content
    else if (path.includes('/blog') || path.includes('/post') || path.includes('/posts') || path.includes('/article') || 
             path.includes('/articles') || path.includes('/news') || path.includes('/press') || path.includes('/resources') ||
             path.includes('/guide') || path.includes('/guides') || path.includes('/tutorial') || path.includes('/tutorials') ||
             path.includes('/doc') || path.includes('/docs') || path.includes('/documentation') || path.includes('/help')) {
      classified.content.push(u);
    }
    // Conversion
    else if (path.includes('/contact') || path.includes('/demo') || path.includes('/demos') || path.includes('/signup') ||
             path.includes('/sign-up') || path.includes('/register') || path.includes('/trial') || path.includes('/try') ||
             path.includes('/get-started') || path.includes('/start') || path.includes('/buy') || path.includes('/purchase') ||
             path.includes('/checkout') || path.includes('/cart') || path.includes('/order')) {
      classified.conversion.push(u);
    }
    // Company
    else if (path.includes('/about') || path.includes('/team') || path.includes('/careers') || path.includes('/career') ||
             path.includes('/jobs') || path.includes('/job') || path.includes('/culture') || path.includes('/mission') ||
             path.includes('/vision') || path.includes('/values') || path.includes('/investors') || path.includes('/investor')) {
      classified.company.push(u);
    }
  });

  // Calculate average depth
  const depths = urlData.map(u => u.depth || 0);
  const avgDepth = depths.length > 0 ? (depths.reduce((a, b) => a + b, 0) / depths.length).toFixed(1) : 0;

  // Build structural summary
  const summary = {
    totalPages: urls.length,
    productCount: classified.product.length,
    contentCount: classified.content.length,
    conversionCount: classified.conversion.length,
    companyCount: classified.company.length,
    pricingCount: classified.pricing.length,
    hasPricing: classified.pricing.length > 0,
    avgDepth: parseFloat(avgDepth)
  };

  const isKorean = language === 'ko';

  // Build concise prompt with only structural summary
  const systemPrompt = isKorean
    ? `당신은 시니어 그로스 전략가입니다. 웹사이트 구조 요약을 기반으로 실행 가능한 인사이트를 제공해주세요.`
    : `You are a senior growth strategist. Given this website structure summary, provide actionable insights.`;

  const userPrompt = isKorean ? `웹사이트 구조 요약:

- 전체 페이지 수: ${summary.totalPages}
- 제품 페이지: ${summary.productCount}
- 콘텐츠 페이지: ${summary.contentCount}
- 전환 페이지: ${summary.conversionCount}
- 회사 페이지: ${summary.companyCount}
- 가격 페이지: ${summary.pricingCount} (${summary.hasPricing ? '있음' : '없음'})
- 평균 경로 깊이: ${summary.avgDepth}

다음을 제공해주세요:
1. 퍼널 성숙도 점수 (0-10점)
2. 누락된 퍼널 단계
3. 콘텐츠 전략 공백
4. 전환 방해 요소
5. 상위 3개 고임팩트 개선사항

간결하고 실행 가능하게 응답해주세요.` : `Website Structure Summary:

- Total Pages: ${summary.totalPages}
- Product Pages: ${summary.productCount}
- Content Pages: ${summary.contentCount}
- Conversion Pages: ${summary.conversionCount}
- Company Pages: ${summary.companyCount}
- Pricing Pages: ${summary.pricingCount} (${summary.hasPricing ? 'Yes' : 'No'})
- Average Depth: ${summary.avgDepth}

Provide:
1. Funnel maturity (score 0-10)
2. Missing funnel stages
3. Content strategy gaps
4. Conversion blockers
5. Top 3 high-impact improvements

Respond concisely, actionable.`;

  const prompt = userPrompt;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '{}';
    
    // Parse JSON response
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```\n?/g, '');
    }
    
    const insights = JSON.parse(jsonStr);
    console.log('AI insights received:', JSON.stringify(insights, null, 2).substring(0, 500));
    
    // If Korean language is requested, translate any English responses
    let translatedInsights = insights;
    if (isKorean) {
      console.log('Translating insights to Korean...');
      try {
        translatedInsights = await translateObject(insights, apiKey);
        console.log('Translation completed.');
      } catch (error) {
        console.error('Translation error:', error);
        // If translation fails, try to translate individual fields
        translatedInsights = { ...insights };
        if (translatedInsights.summary && isEnglish(translatedInsights.summary)) {
          translatedInsights.summary = await translateToKorean(translatedInsights.summary, apiKey);
        }
        if (translatedInsights.funnel && isEnglish(translatedInsights.funnel)) {
          translatedInsights.funnel = await translateToKorean(translatedInsights.funnel, apiKey);
        }
        if (Array.isArray(translatedInsights.gaps)) {
          translatedInsights.gaps = await translateArray(translatedInsights.gaps, apiKey);
        }
        if (Array.isArray(translatedInsights.recommendations)) {
          translatedInsights.recommendations = await translateArray(translatedInsights.recommendations, apiKey);
        }
        if (Array.isArray(translatedInsights.contentIdeas)) {
          translatedInsights.contentIdeas = await translateArray(translatedInsights.contentIdeas, apiKey);
        }
      }
    }
    
    // Map AI response to expected format
    // AI returns: funnelMaturity, missingFunnelStages, contentStrategyGaps, conversionBlockers, topImprovements
    const result = {
      summary: translatedInsights.summary || translatedInsights.analysis || (isKorean ? '분석 완료.' : 'Analysis complete.'),
      funnel: translatedInsights.funnel || 
              (translatedInsights.funnelMaturity ? 
                (isKorean ? `퍼널 성숙도: ${translatedInsights.funnelMaturity}/10` : `Funnel Maturity: ${translatedInsights.funnelMaturity}/10`) : 
                (isKorean ? '퍼널 구조를 확인할 수 없습니다.' : 'Unable to determine funnel structure.')),
      gaps: translatedInsights.gaps || 
            translatedInsights.missingFunnelStages || 
            translatedInsights.contentStrategyGaps || 
            translatedInsights.conversionBlockers || 
            [],
      recommendations: translatedInsights.recommendations || 
                        translatedInsights.topImprovements || 
                        translatedInsights.highImpactImprovements || 
                        (Array.isArray(translatedInsights.topImprovements) ? 
                          translatedInsights.topImprovements.map((item, idx) => ({
                            title: typeof item === 'string' ? item : (item.title || `Improvement ${idx + 1}`),
                            description: typeof item === 'string' ? '' : (item.description || '')
                          })) : []),
      contentIdeas: translatedInsights.contentIdeas || 
                   translatedInsights.contentStrategyGaps || 
                   [],
      pageDistribution: {
        product: summary.productCount,
        content: summary.contentCount,
        conversion: summary.conversionCount,
        company: summary.companyCount,
        pricing: summary.pricingCount
      }
    };
    
    console.log('Final result:', JSON.stringify(result, null, 2).substring(0, 500));
    return result;
  } catch (error) {
    console.error('AI insight generation error:', error);
    throw error;
  }
}

export async function generateLandingPageInsights({ urls, language = 'en' }) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }

  // Find conversion-related paths
  const conversionUrls = urls
    .map(u => typeof u === 'string' ? u : u.url)
    .filter(url => {
      const path = new URL(url).pathname.toLowerCase();
      return path.includes('/pricing') || path.includes('/contact') || 
             path.includes('/demo') || path.includes('/signup') ||
             path.includes('/trial') || path.includes('/get-started');
    });

  const isKorean = language === 'ko';
  
  const prompt = isKorean ? `전환 관련 랜딩 페이지를 분석하고 개선 사항을 제안해주세요.

**매우 중요: 모든 응답은 반드시 한국어로만 작성해야 합니다. JSON 형식으로 반환하되, JSON 내부의 모든 텍스트 값은 절대 영어가 아닌 한국어로만 작성해야 합니다.**

전환 관련 URL:
${conversionUrls.slice(0, 15).map(u => `- ${u}`).join('\n')}

다음에 집중해주세요 (모든 응답은 한국어로):
1. CTA 가시성 및 배치 - 한국어로 작성
2. 가격 페이지 명확성 - 한국어로 작성
3. 연락처 폼 깊이 - 한국어로 작성
4. 전환 플로우 최적화 - 한국어로 작성

**반드시 한국어로만 응답해주세요. JSON 형식으로 반환하되, 모든 텍스트는 한국어로 작성해야 합니다.**

JSON 형식 (모든 텍스트는 한국어로):
{
  "ctaIssues": ["한국어로 작성된 CTA 문제점 1", "한국어로 작성된 CTA 문제점 2"],
  "pricingVisibility": "한국어로 작성된 가격 가시성 평가",
  "contactDepth": "한국어로 작성된 연락처 깊이 평가",
  "suggestions": ["한국어로 작성된 제안 1", "한국어로 작성된 제안 2"]
}

**최종 확인: 모든 응답 텍스트는 반드시 한국어로만 작성해주세요. 영어 사용 금지.**` : `Analyze these conversion-related landing pages and suggest improvements:

Write all responses in English.

${conversionUrls.slice(0, 15).map(u => `- ${u}`).join('\n')}

Focus on:
1. CTA visibility and placement
2. Pricing page clarity
3. Contact form depth
4. Conversion flow optimization

Return JSON:
{
  "ctaIssues": ["issue 1", "issue 2"],
  "pricingVisibility": "assessment text",
  "contactDepth": "assessment text",
  "suggestions": ["suggestion 1", "suggestion 2"]
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: isKorean 
              ? '당신은 전환 최적화 전문가입니다. **매우 중요: 모든 응답은 반드시 한국어로만 작성해야 합니다. 절대 영어를 사용하지 마세요. JSON 형식으로만 반환하되, JSON 내부의 모든 텍스트 값은 반드시 한국어로만 작성해야 합니다. 영어 사용은 금지됩니다.**'
              : 'You are a conversion optimization expert. Return valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '{}';
    
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```\n?/g, '');
    }
    
    const result = JSON.parse(jsonStr);
    
    // If Korean language is requested, translate any English responses
    if (isKorean) {
      return await translateObject(result, apiKey);
    }
    
    return result;
  } catch (error) {
    console.error('Landing page insight error:', error);
    throw error;
  }
}

export async function generateContentStrategy({ urls, domain, language = 'en' }) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }

  const urlList = urls.slice(0, 30).map(u => typeof u === 'string' ? u : u.url).join('\n');
  const isKorean = language === 'ko';

  const prompt = isKorean ? `이 웹사이트 구조를 기반으로 SEO, 사용자 참여 및 전환을 개선할 수 있는 누락된 콘텐츠 페이지를 제안해주세요.

**매우 중요: 모든 응답은 반드시 한국어로만 작성해야 합니다. JSON 형식으로 반환하되, JSON 내부의 모든 텍스트 값(title, reason 등)은 절대 영어가 아닌 한국어로만 작성해야 합니다.**

웹사이트: ${domain}
현재 URL:
${urlList}

가치 있는 누락된 콘텐츠 페이지 5-7개를 제안해주세요 (모든 응답은 한국어로). 다음을 고려해주세요:
- 제품 비교 페이지 - 한국어로 작성
- 사용 사례 페이지 - 한국어로 작성
- 가격 설명 페이지 - 한국어로 작성
- 사례 연구 - 한국어로 작성
- 리소스 페이지 - 한국어로 작성

**반드시 한국어로만 응답해주세요. JSON 형식으로 반환하되, 모든 텍스트는 한국어로 작성해야 합니다.**

JSON 형식 (모든 텍스트는 한국어로):
{
  "recommendedPages": [
    {"title": "한국어로 작성된 페이지 제목", "type": "comparison|usecase|explainer|casestudy|resource", "reason": "한국어로 작성된 이유 설명"},
    {"title": "한국어로 작성된 페이지 제목", "type": "comparison|usecase|explainer|casestudy|resource", "reason": "한국어로 작성된 이유 설명"}
  ]
}

**최종 확인: 모든 응답 텍스트는 반드시 한국어로만 작성해주세요. 영어 사용 금지.**` : `Based on this website structure, suggest missing content pages that would improve SEO, user engagement, and conversion:

Write all responses in English.

Website: ${domain}
Current URLs:
${urlList}

Suggest 5-7 missing content pages that would be valuable. Consider:
- Product comparison pages
- Use case pages
- Pricing explainers
- Case studies
- Resource pages

Return JSON:
{
  "recommendedPages": [
    {"title": "Page title", "type": "comparison|usecase|explainer|casestudy|resource", "reason": "why this page is valuable"}
  ]
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: isKorean 
              ? '당신은 콘텐츠 전략 전문가입니다. **매우 중요: 모든 응답은 반드시 한국어로만 작성해야 합니다. 절대 영어를 사용하지 마세요. JSON 형식으로만 반환하되, JSON 내부의 모든 텍스트 값(title, reason 등)은 반드시 한국어로만 작성해야 합니다. 영어 사용은 금지됩니다.**'
              : 'You are a content strategy expert. Return valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '{}';
    
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```\n?/g, '');
    }
    
    const result = JSON.parse(jsonStr);
    
    // If Korean language is requested, translate any English responses
    if (isKorean) {
      return await translateObject(result, apiKey);
    }
    
    return result;
  } catch (error) {
    console.error('Content strategy error:', error);
    throw error;
  }
}
