"""
Make.com API를 사용하여 RSS 감지 에이전트 시나리오를 프로그래밍 방식으로 생성하는 스크립트

사용 방법:
1. Make.com API 키를 환경 변수로 설정: export MAKE_API_KEY="your_api_key"
2. 필요한 모듈의 moduleId를 확인 (Make API 문서 참조)
3. 스크립트 실행: python make_scenario_builder.py
"""

import os
import json
import requests
from typing import Dict, List, Any

# Make.com API 설정
MAKE_API_BASE_URL = "https://www.make.com/api/v2"
MAKE_API_KEY = os.getenv("MAKE_API_KEY")

if not MAKE_API_KEY:
    raise ValueError("MAKE_API_KEY 환경 변수가 설정되지 않았습니다.")


class MakeScenarioBuilder:
    """Make.com 시나리오 빌더 클래스"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.headers = {
            "Authorization": f"Token {api_key}",
            "Content-Type": "application/json"
        }
        self.scenario_id = None
        self.modules = []
    
    def create_scenario(self, name: str, folder_id: int = None) -> Dict:
        """새 시나리오 생성"""
        url = f"{MAKE_API_BASE_URL}/scenarios"
        data = {
            "name": name,
            "folderId": folder_id
        }
        
        response = requests.post(url, headers=self.headers, json=data)
        response.raise_for_status()
        scenario = response.json()
        self.scenario_id = scenario["id"]
        print(f"✅ 시나리오 생성 완료: {name} (ID: {self.scenario_id})")
        return scenario
    
    def add_module(self, module_type: str, config: Dict[str, Any], position: Dict = None) -> Dict:
        """모듈 추가"""
        if not self.scenario_id:
            raise ValueError("먼저 시나리오를 생성해야 합니다.")
        
        url = f"{MAKE_API_BASE_URL}/scenarios/{self.scenario_id}/modules"
        
        # 모듈 타입에 따른 기본 설정
        module_config = {
            "type": module_type,
            "parameters": config.get("parameters", {}),
            "position": position or {"x": 100, "y": 100 + len(self.modules) * 150}
        }
        
        if "connections" in config:
            module_config["connections"] = config["connections"]
        
        response = requests.post(url, headers=self.headers, json=module_config)
        response.raise_for_status()
        module = response.json()
        self.modules.append(module)
        print(f"✅ 모듈 추가 완료: {module_type}")
        return module
    
    def build_rss_detection_scenario(self):
        """RSS 감지 에이전트 시나리오 구축"""
        
        # 1. 시나리오 생성
        self.create_scenario("AI Meeting Market Intelligence")
        
        # 2. Scheduler 모듈
        scheduler = self.add_module(
            "schedule",
            {
                "parameters": {
                    "schedule": "0 */6 * * *",  # Every 6 hours (Cron format)
                    "timezone": "Asia/Seoul"
                }
            },
            {"x": 100, "y": 100}
        )
        
        # 3. Set Variable 모듈 (RSS Array)
        rss_array = [
            "https://blog.otter.ai/feed/",
            "https://fireflies.ai/blog/rss.xml",
            "https://notta.ai/en/blog/rss.xml",
            "https://medium.com/feed/tag/ai-meeting",
            "https://www.producthunt.com/feed"
        ]
        
        set_variable = self.add_module(
            "setvariable",
            {
                "parameters": {
                    "variable": "rss_list",
                    "value": json.dumps(rss_array)
                },
                "connections": [
                    {
                        "moduleId": scheduler["id"],
                        "position": "output"
                    }
                ]
            },
            {"x": 100, "y": 250}
        )
        
        # 4. Iterator 모듈
        iterator = self.add_module(
            "iterator",
            {
                "parameters": {
                    "array": "{{rss_list}}"
                },
                "connections": [
                    {
                        "moduleId": set_variable["id"],
                        "position": "output"
                    }
                ]
            },
            {"x": 100, "y": 400}
        )
        
        # 5. RSS Watch Feed Items 모듈
        rss_module = self.add_module(
            "rss",
            {
                "parameters": {
                    "url": "{{Iterator.value}}",
                    "limit": 10,
                    "fromNowOn": True
                },
                "connections": [
                    {
                        "moduleId": iterator["id"],
                        "position": "output"
                    }
                ]
            },
            {"x": 100, "y": 550}
        )
        
        # 6. Filter 모듈
        filter_expression = """
        contains(lowercase({{1.Title}}); "meeting")
        OR
        contains(lowercase({{1.Description}}); "transcription")
        OR
        contains(lowercase({{1.Description}}); "회의록")
        OR
        contains(lowercase({{1.Title}}); "ai")
        OR
        contains(lowercase({{1.Description}}); "llm")
        OR
        contains(lowercase({{1.Title}}); "note")
        OR
        contains(lowercase({{1.Description}}); "summary")
        """
        
        filter_module = self.add_module(
            "filter",
            {
                "parameters": {
                    "condition": "custom",
                    "expression": filter_expression
                },
                "connections": [
                    {
                        "moduleId": rss_module["id"],
                        "position": "output"
                    }
                ]
            },
            {"x": 100, "y": 700}
        )
        
        # 7. OpenAI GPT 분석 모듈
        gpt_system_prompt = """너는 AI SaaS 시장 분석가다.

아래 콘텐츠를 분석해서 JSON으로 반환해.

필드:
- category: Feature | Pricing | Marketing | UseCase | Technology
- summary: 핵심 요약 2줄
- signal: 우리 제품 전략에 참고할 변화 포인트 1줄

반드시 유효한 JSON 형식으로만 응답해야 한다."""
        
        gpt_user_prompt = """콘텐츠:
제목: {{1.Title}}
설명: {{1.Description}}
내용: {{1.Content}}
URL: {{1.Link}}
발행일: {{1.PubDate}}"""
        
        gpt_module = self.add_module(
            "openai",
            {
                "parameters": {
                    "model": "gpt-4-turbo-preview",
                    "messages": [
                        {
                            "role": "system",
                            "content": gpt_system_prompt
                        },
                        {
                            "role": "user",
                            "content": gpt_user_prompt
                        }
                    ],
                    "temperature": 0.3,
                    "maxTokens": 500
                },
                "connections": [
                    {
                        "moduleId": filter_module["id"],
                        "position": "output"
                    }
                ]
            },
            {"x": 100, "y": 850}
        )
        
        # 8. Parse JSON 모듈
        parse_json = self.add_module(
            "json",
            {
                "parameters": {
                    "json": "{{2.choices[0].message.content}}"
                },
                "connections": [
                    {
                        "moduleId": gpt_module["id"],
                        "position": "output"
                    }
                ]
            },
            {"x": 100, "y": 1000}
        )
        
        # 9. Notion 모듈
        notion_module = self.add_module(
            "notion",
            {
                "parameters": {
                    "databaseId": "YOUR_DATABASE_ID",  # 실제 Database ID로 변경 필요
                    "title": "{{1.Title}}",
                    "source_url": "{{1.Link}}",
                    "category": "{{3.category}}",
                    "summary": "{{3.summary}}",
                    "signal": "{{3.signal}}",
                    "published_at": "{{1.PubDate}}",
                    "rss_source": "{{Iterator.value}}"
                },
                "connections": [
                    {
                        "moduleId": parse_json["id"],
                        "position": "output"
                    }
                ]
            },
            {"x": 100, "y": 1150}
        )
        
        # 10. Router 모듈 (조건부 알림)
        router = self.add_module(
            "router",
            {
                "parameters": {
                    "routes": [
                        {
                            "condition": "{{3.category}} == 'Feature'",
                            "label": "Feature Alert"
                        },
                        {
                            "condition": "{{3.category}} == 'Pricing'",
                            "label": "Pricing Alert"
                        },
                        {
                            "condition": "else",
                            "label": "Other"
                        }
                    ]
                },
                "connections": [
                    {
                        "moduleId": notion_module["id"],
                        "position": "output"
                    }
                ]
            },
            {"x": 100, "y": 1300}
        )
        
        # 11. Slack 모듈 (Feature 경로)
        slack_message = """🚨 AI Meeting Market Signal

제목: {{1.Title}}
분류: {{3.category}}
출처: {{Iterator.value}}

요약:
{{3.summary}}

전략 포인트:
{{3.signal}}

링크:
{{1.Link}}

발행일: {{1.PubDate}}"""
        
        slack_module = self.add_module(
            "slack",
            {
                "parameters": {
                    "channel": "#ai-market-intelligence",
                    "text": slack_message,
                    "username": "Market Intelligence Bot"
                },
                "connections": [
                    {
                        "moduleId": router["id"],
                        "position": "output",
                        "route": "Feature Alert"
                    }
                ]
            },
            {"x": 300, "y": 1450}
        )
        
        print("\n✅ 시나리오 구축 완료!")
        print(f"시나리오 ID: {self.scenario_id}")
        print("\n⚠️  주의사항:")
        print("1. Notion Database ID를 실제 값으로 변경하세요")
        print("2. 각 모듈의 API 연결을 Make.com 웹 인터페이스에서 설정하세요")
        print("3. 모듈 ID와 연결 관계를 확인하세요")
        
        return {
            "scenario_id": self.scenario_id,
            "modules": self.modules
        }
    
    def activate_scenario(self):
        """시나리오 활성화"""
        if not self.scenario_id:
            raise ValueError("시나리오가 생성되지 않았습니다.")
        
        url = f"{MAKE_API_BASE_URL}/scenarios/{self.scenario_id}"
        data = {"isActive": True}
        
        response = requests.patch(url, headers=self.headers, json=data)
        response.raise_for_status()
        print("✅ 시나리오 활성화 완료")
        return response.json()


def main():
    """메인 실행 함수"""
    if not MAKE_API_KEY:
        print("❌ MAKE_API_KEY 환경 변수를 설정하세요.")
        print("예: export MAKE_API_KEY='your_api_key'")
        return
    
    builder = MakeScenarioBuilder(MAKE_API_KEY)
    
    try:
        # 시나리오 구축
        result = builder.build_rss_detection_scenario()
        
        # 활성화 여부 확인
        activate = input("\n시나리오를 활성화하시겠습니까? (y/n): ")
        if activate.lower() == 'y':
            builder.activate_scenario()
        
    except requests.exceptions.HTTPError as e:
        print(f"❌ API 오류: {e}")
        print(f"응답 내용: {e.response.text}")
    except Exception as e:
        print(f"❌ 오류 발생: {e}")


if __name__ == "__main__":
    main()
