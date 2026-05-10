// Project detail data — rendered by ui/projectModal.js.
// Sparse map: keys map to project codes referenced in quests[].projectIds.
// Each project may include: kpis, stack, images, mermaid, sections, links.
// Images live under output/assets/<id>/...
//
// PUBLIC_MODE pipeline: _PROJECTS_RAW -> redactObject -> PROJECTS.
// To restore full content, see game/data/redaction.js (PUBLIC_MODE flag).

import { redactObject } from './redaction.js';

const _PROJECTS_RAW = {
  /* ============================================================ *
   *  BRAINCREW — P-001 ~ P-004, IT-001 ~ IT-004                   *
   * ============================================================ */
  'P-001': {
    code:    'P-001',
    title:   'IBK Capital — AI 여신 승인',
    company: 'BrainCrew · IBK Capital',
    period:  '2025.09 — 2025.12',
    role:    'AI Engineer (RAG 파이프라인 + 문서 전처리)',
    summary: '승인신청서·심사보고서 자동 생성 PoC. 영업점이 비정형 문서로 작성하던 신청서를 RAG 파이프라인으로 자동 초안화. On-Prem 폐쇄망 환경.',
    kpis: [
      { label: '처리시간',    value: '70%↓',     hint: '3.5일 → 1일 이내' },
      { label: '비용 절감',   value: '₩4.7억/년', hint: '반복문서 자동화' },
      { label: '내부 만족도', value: '79.4/100',   hint: '평균 4/5' },
      { label: '생산성',     value: '+23%p',    hint: '자동작성 효과' },
    ],
    stack: ['LangChain', 'Next.js', 'FastAPI', 'Elasticsearch', 'Redis', 'Upstage Parser', 'On-Prem'],
    images: [
      { src: 'assets/p-001/parser-arch.png',    caption: 'Parser & Chunker 아키텍처 — 표/헤더 구조까지 반영' },
      { src: 'assets/p-001/processing-flow.png', caption: '종합 처리 플로우 — Table-First + HeadingRefiner' },
      { src: 'assets/p-001/markdown-kv.png',     caption: 'Tabular 데이터 손실 최소화 — Markdown KV 변환' },
    ],
    sections: [
      {
        heading: 'Problem',
        body: '승인신청서는 영업점이 기업고객 상담 후 작성하는 비정형 문서. 작성·검토에 평균 3.5일 소요, 양식·데이터 구조 비일관성으로 심사 품질 편차.',
      },
      {
        heading: 'Approach',
        body: '문서 전처리 파이프라인 + RAG 파이프라인 2-stage. ① PDF/Excel → Table-First 추출 + HeadingRefiner로 의미 단락 분리 → 벡터 DB. ② 신청서 9개 섹션을 개별 RAG 응답으로 생성, Markdown KV로 tabular 손실 최소화.',
      },
      {
        heading: 'Result',
        body: '소요시간 70% 단축 (전처리 단계 12분 41초 → 5분 54초, 비동기·다중 Worker 병렬화). 내부 실무자 PoC 만족도 79.4점, 평균 4/5점. 연간 약 4.7억 원 인건비 절감 효과 확인.',
      },
    ],
    links: [],
  },

  'P-002': {
    code:    'P-002',
    title:   'LG Electronics — 라이프로그 RAG',
    company: 'BrainCrew · LG Electronics',
    period:  '2025.11 — 2025.12',
    role:    'AI Engineer (Graph-RAG, LangGraph Agent)',
    summary: 'L사 고객 라이프로그를 자연어로 질의하는 AI 어시스턴트. "캠핑 갔을 때 쓴 버너 뭐였지?" 같은 복합 관계 질의를 그래프 + 벡터 하이브리드 검색으로 해결.',
    kpis: [
      { label: '정확도',         value: '92%',   hint: '평가셋 74/80' },
      { label: 'Context 절감',   value: '85%↓',  hint: '20,000 → 3,000' },
      { label: '메타데이터 키',   value: '14개',  hint: '시간·위치·활동·소비·개체명' },
      { label: '그래프 엣지',    value: '242개', hint: '연관 탐색 경로' },
    ],
    stack: ['LangGraph', 'ChromaDB', 'GPT-4o', 'Hybrid Retrieval', 'LangGraph Studio'],
    images: [
      { src: 'assets/p-002/main-page.png',    caption: '메인 페이지 — 챗 오프너 및 대화 입력창' },
      { src: 'assets/p-002/sidebar.png',      caption: '사이드바 — 이전 대화 내역 불러오기' },
      { src: 'assets/p-002/conversation.png', caption: '대화 페이지 — 검색 결과 및 AI 응답' },
    ],
    mermaid: `graph LR
    A[사용자 질문<br/>User Question]
    subgraph AGENT[에이전트 내부 처리 영역]
        direction TB
        C{Tool 호출<br/>필요 여부 판단}
        D[query_extraction<br/>활동·시간 추출]
        F[GraphRetriever]
        G[(ChromaDB<br/>Vector Store)]
        I[검색 결과<br/>Retrieved Events]
        C -->|필요| D
        C -->|불필요| I
        D --> F
        F -->|벡터 검색| G
        F -->|그래프 탐색| F
        G --> I
    end
    I --> L[최종 답변 반환]
    A --> C
    style A fill:#e1f5ff
    style D fill:#ffe1f5
    style F fill:#e1ffe1
    style G fill:#f0f0f0
    style L fill:#e1f5ff`,
    sections: [
      {
        heading: 'Problem',
        body: '단순 키워드/벡터 유사도 검색으로는 "시간·장소·활동·브랜드"가 얽힌 복합 질의를 처리할 수 없음. 데이터가 누적되면 검색 속도·정확도 동시 유지가 어려움.',
      },
      {
        heading: 'Approach',
        body: '활동 데이터를 그래프(14 메타데이터 키 × 242 엣지)로 재구성. LangGraph ReAct 에이전트가 질문 분석 → query_extraction → GraphRetriever(벡터+그래프 하이브리드) → 결과 반환. 자동 시간 필터링("지난주", "올해 초") + Context 압축으로 효율 확보.',
      },
      {
        heading: 'Result',
        body: '내부 평가셋 80문항 중 74문항 정답 (92%). Retrieval context를 20,000개 → 3,000개로 85% 감소시키며 일관성·정확도 동시 향상. 한국어 구어체·줄임말 처리(query expansion) 모듈은 개발 중.',
      },
    ],
    links: [],
  },

  'P-003': {
    code:    'P-003',
    title:   'GS Caltex — Long-term Memory MCP',
    company: 'BrainCrew · GS Caltex',
    period:  '2025.10 — 2025.12',
    role:    'Long-term Memory MCP 담당 개발 (스키마·검색·통합)',
    summary: 'GSC 사내 AI 솔루션 MISO에 통합되는 장기기억 MCP 서버. 사용자 선호도 기반 5-테이블 개인화 메모리 스키마를 설계하고 환각 최소화 아키텍처를 확립. 사내 딥리서치 워크플로우와 단일 인프라(Parser·Storage·Bedrock) 위에서 통합 운영.',
    kpis: [
      { label: '메모리 스키마', value: '5 테이블', hint: '사용자 선호도 기반 개인화' },
      { label: '아키텍처',     value: '환각 최소화', hint: '메모리 일관성 확보' },
      { label: '통합',        value: 'MISO + 딥리서치', hint: '상용 서비스급 워크플로우' },
    ],
    stack: ['MCP', 'AWS Bedrock', 'PostgreSQL', 'AWS S3', 'Upstage API', 'PyMuPDF'],
    images: [
      { src: 'assets/p-003/main.png',         caption: 'MISO 통합 화면 — 장기기억 호출 컨텍스트' },
      { src: 'assets/p-003/architecture.png', caption: 'Long-term Memory MCP 아키텍처' },
    ],
    mermaid: `flowchart TD
    User[사용자 / MISO 시스템]
    User --> Memory[Long-term Memory MCP]
    Memory --> Save[save_memory]
    Memory --> Recall[recall_memory]
    Memory --> Update[update_preference]
    Save --> Schema
    Recall --> Schema
    Update --> Schema
    Schema[(5-Table Schema<br/>users · prefs · memos<br/>entities · sessions)]
    Schema --> Foundation
    Foundation[공통 인프라]
    Foundation --> Storage[PostgreSQL · AWS S3]
    Foundation --> Bedrock[AWS Bedrock<br/>Embeddings + LLM]
    User -.딥리서치 워크플로우 통합.-> DeepResearch[Deep Research MCP]
    DeepResearch --> Foundation
    classDef productStyle fill:#ffe1e1,stroke:#cc0000,stroke-width:3px
    classDef commonStyle fill:#e1f5ff,stroke:#0066cc,stroke-width:2px
    classDef toolStyle fill:#fff4e1,stroke:#ff9900,stroke-width:2px
    classDef extStyle fill:#f0f0f0,stroke:#999,stroke-width:1px,stroke-dasharray: 4 4
    class Memory productStyle
    class Foundation,Storage,Bedrock,Schema commonStyle
    class Save,Recall,Update toolStyle
    class DeepResearch extStyle`,
    sections: [
      {
        heading: 'Problem',
        body: 'GSC 내부 AI 솔루션 MISO는 세션이 끝나면 사용자 컨텍스트가 사라져 매 대화마다 같은 정보를 다시 입력해야 했음. 단순 캐시·요약이 아니라 사용자 선호·과거 결정·핵심 엔티티를 영속 저장하고, 후속 세션에서 정확히 재호출할 수 있는 표준 인터페이스(MCP)가 필요.',
      },
      {
        heading: 'Approach',
        body: '① 5-테이블 개인화 메모리 스키마 설계 — 사용자/선호도/메모/엔티티/세션을 정규화하여 저장, 임베딩 + 메타데이터 하이브리드 검색.\n② 환각 최소화 아키텍처 — 메모리 호출 시 source attribution 강제, 미존재 메모리에 대한 LLM 추측 차단.\n③ MCP 표준 인터페이스 — save_memory · recall_memory · update_preference 도구로 MISO에서 일관 호출.\n④ 사내 딥리서치 워크플로우와 통합 — 공통 Parser·Storage·Bedrock 인프라에서 함께 운영.',
      },
      {
        heading: 'Result',
        body: 'MISO에 Long-term Memory MCP 연동 완료, 상용 서비스에 준하는 품질로 운영. 5-테이블 스키마 + 환각 최소화 패턴은 이후 BrainCrew 사내 MCP 구축 템플릿의 기반이 됨.',
      },
    ],
    links: [],
  },

  'P-004': {
    code:    'P-004',
    title:   'HSAD — 광고 기획서 자동 구조화',
    company: 'BrainCrew · HSAD',
    period:  '2025.09 — 2025.11',
    role:    'AI Engineer',
    summary: '광고대행사 HSAD의 광고 기획서를 자동으로 구조화하는 시스템. 비정형 PPT/문서를 의미 단위로 추출 + 표준 양식으로 재구성.',
    kpis: [
      { label: '문서 타입',    value: 'PPT/PDF' },
      { label: '구조화 단위', value: '섹션' },
    ],
    stack: ['LangChain', 'GPT-4o', 'Document Parser', 'Vector Store'],
    images: [
      { src: 'assets/p-004/main.png',      caption: '기획서 구조화 결과 화면' },
      { src: 'assets/p-004/structure.png', caption: '문서 구조 추출 과정' },
    ],
    sections: [
      { heading: 'Problem',  body: '광고 기획서는 회사·캠페인마다 양식이 제각각이라 메타분석·재활용이 어려움. 수작업 정리에 많은 인력 소요.' },
      { heading: 'Approach', body: '문서 파서로 PPT/PDF의 시각적 구조를 의미 단위로 추출 → LLM으로 섹션 분류·요약 → 표준 스키마로 매핑.' },
      { heading: 'Result',   body: '기획서 자동 구조화 PoC 완료. 기존 양식 다양성을 흡수하면서도 검색 가능한 형태로 변환.' },
    ],
    links: [],
  },

  'IT-002': {
    code:    'IT-002',
    title:   'Docker Log Monitor',
    company: 'BrainCrew · 사내 도구',
    period:  '2026.01 — Active',
    role:    '기획·구현',
    summary: '사내 운영 컨테이너의 로그를 실시간 감시하고 장애 패턴을 Slack으로 알리는 사내 도구. 서비스 안정성 확보를 위해 직접 기획·개발.',
    kpis: [
      { label: '대상',       value: 'Docker Containers' },
      { label: '알림 채널',  value: 'Slack' },
      { label: '대응 시간',  value: '실시간' },
    ],
    stack: ['Python', 'Docker SDK', 'Slack Webhook', 'Pattern Matching'],
    images: [
      { src: 'assets/it-002/dashboard.png', caption: '모니터링 대시보드' },
      { src: 'assets/it-002/alert.png',     caption: '실시간 알림 예시' },
    ],
    sections: [
      { heading: 'Problem',  body: '여러 사내 LLM 서비스를 Docker로 운영 중인데 컨테이너별 에러 로그를 사람이 일일이 확인. 장애 발견·대응이 늦어 다운타임 발생.' },
      { heading: 'Approach', body: 'Docker SDK로 컨테이너 stdout/stderr 스트림을 구독, 패턴 매칭으로 에러 레벨 분류, 임계치 초과 시 Slack Webhook으로 즉시 알림. 가이드라인 문서를 사내에 배포.' },
      { heading: 'Result',   body: '프로젝트 수행 중 장애 조기 감지에 다수 활용. 사내 다른 팀에서도 채택해 운영.' },
    ],
    links: [],
  },

  'P-014': {
    code:    'P-014',
    title:   'Telco Enterprise — 사내 Harness & Agent',
    company: 'BrainCrew · Enterprise (통신사, 비공개)',
    period:  '2026.04 — Active',
    role:    'AI Engineer (Harness 설계 + Agent 인프라)',
    summary: '대형 통신사 사내 업무 자동화를 위한 멀티 sub-agent 인프라. Phase-01 Demo는 개별 컨테이너로 운영하되 Phase-02 sandbox 이식이 가능하도록 self-contained skill 단위로 설계. 비즈니스 로직과 인프라(API/queue/persistence)를 import-linter로 강제 격리.',
    kpis: [
      { label: '아키텍처', value: 'deepagents',  hint: 'planner + sub-agent + write_todos + virtual FS' },
      { label: '격리',    value: 'Skill 단위', hint: 'manifest.yaml + import-linter CI 게이트' },
      { label: '영속',    value: 'Postgres',   hint: 'LangGraph PostgresSaver (thread_id = req_id)' },
      { label: '큐',      value: 'arq + Redis', hint: 'sidecar broker, sub-agent는 큐 인프라 비인지' },
    ],
    stack: ['langchain-deepagents', 'LangGraph', 'FastAPI', 'PostgreSQL', 'Redis', 'arq', 'Pydantic', 'import-linter'],
    images: [],
    mermaid: `flowchart LR
    User[사용자 / 외부 시스템]
    User --> API[FastAPI<br/>Public API]
    API --> Planner[Planner Agent]
    Planner --> Sub1[Sub-agent A<br/>self-contained]
    Planner --> Sub2[Sub-agent B<br/>self-contained]
    Planner --> Sub3[Sub-agent C<br/>self-contained]
    Sub1 -.manifest.yaml.-> Registry[(Skill Registry<br/>Phase-02 target)]
    Sub2 -.manifest.yaml.-> Registry
    Sub3 -.manifest.yaml.-> Registry
    Planner --> State[(LangGraph<br/>PostgresSaver)]
    API --> Queue[arq + Redis<br/>sidecar]
    Queue --> Planner
    classDef agent fill:#ffe1f5,stroke:#cc0066
    classDef infra fill:#e1f5ff,stroke:#0066cc
    classDef state fill:#fff4e1,stroke:#ff9900
    class Planner,Sub1,Sub2,Sub3 agent
    class API,Queue,Registry infra
    class State state`,
    sections: [
      {
        heading: 'Problem',
        body: 'Phase-01 데모 단계에서 multi-agent 파이프라인을 빠르게 만들면서도, Phase-02 진입 시점에 비즈니스 로직(skill)이 사내 sandbox 환경으로 추가 작업 없이 그대로 이식되어야 함. 자유로운 LLM 워크플로우의 비결정성을 최소화하면서 결정론적 검증 가능성도 확보 필요.',
      },
      {
        heading: 'Approach',
        body: '① **deepagents 구조 차용** — `langchain-deepagents`로 planner + sub-agent + virtual filesystem + write_todos 패턴.\n② **Skill manifest 단위 격리** — 각 sub-agent는 `manifest.yaml`로 inputs/outputs/permissions/idempotent를 선언, 인프라 모듈 import는 `import-linter` CI 게이트로 차단.\n③ **결정론적 멱등 강제** — skill 함수는 pure (외부 I/O 금지), `temperature=0`, `hash(input) → hash(output)` 회귀 테스트.\n④ **Public API 계약 sealed** — OpenAPI byte-diff CI 게이트로 운영 표면 변경을 차단, 디버그 endpoint는 `/_internal/*` 라우터 분리.\n⑤ **State / Queue 인프라 분리** — LangGraph PostgresSaver(thread_id = req_id)로 영속, arq + Redis로 외부 enqueue. sub-agent는 인프라 비인지.',
      },
      {
        heading: 'Result',
        body: 'Phase-01 진행중. Skill manifest + 격리 설계로 동일 sub-agent 코드베이스가 Phase-02 sandbox 환경에 그대로 import 가능. 결정론적 워크플로우와 planner 자유도를 분리해 운영 안정성 + 확장성 동시 확보.',
      },
    ],
    links: [],
  },

  /* ============================================================ *
   *  CLABI — P-005, P-006, P-008, P-009                           *
   * ============================================================ */
  'P-005': {
    code:    'P-005',
    title:   '충청남도교육청 초거대 생성형 AI 서비스',
    company: 'Clabi · 충청남도교육청',
    period:  '2024.12 — 2025.06',
    role:    'Lead E2E (RAG 파이프라인 설계·구현)',
    summary: '공문서 이해·검색 및 멀티턴 대화를 지원하는 생성형 AI 서비스. End-to-End RAG 파이프라인 설계, 데이터 전처리 고도화, CI/CD 운영 자동화까지 Lead로 담당.',
    kpis: [
      { label: '대화 맥락',     value: 'group_id 기반' },
      { label: '메타데이터',   value: 'chunk depth' },
      { label: '부서 매핑',    value: '자동' },
      { label: '운영',         value: 'CI/CD 자동화' },
    ],
    stack: ['LangChain', 'Milvus', 'FastAPI', 'LLM Function Calling', 'Jenkins', 'ArgoCD', 'Kubernetes', 'Docker', 'Crontab'],
    images: [
      { src: 'assets/p-005/main.png', caption: '서비스 메인 페이지 — 마음e풀럭 챗봇 인터페이스' },
    ],
    sections: [
      {
        heading: 'Problem',
        body: '공문서 이해와 멀티턴 질의응답 시스템 고도화 필요. 복잡한 부서 분류, 문서 chunk별 정보 손실, 대화 맥락 유지가 동시에 요구됨.',
      },
      {
        heading: 'Approach',
        body: '① RAG 파이프라인 설계·구현 — group_id 기반 DB 대화 이력 관리로 맥락 유지.\n② 데이터 전처리 최적화 — 문서 구조 보존을 위해 chunk별 depth 메타데이터 임베딩.\n③ 부서 매핑 자동화 — 유사도 기반 추천 로직 + 도메인 전문가 라벨링 데이터 적용.\n④ 운영 자동화 — CI/CD 파이프라인, 통계·메일링 스케줄링 구축.',
      },
      {
        heading: 'Result',
        body: '공문서 기반 멀티턴 대화형 챗봇 시스템 개발 완료. group_id 대화 이력 관리로 대화 맥락 유지, chunk depth 임베딩으로 공문서 특성상 발생하는 정보 손실 문제 해결, 부서 자동 매핑 기능 구현.',
      },
      {
        heading: 'Insights',
        body: '· RAG 성능은 데이터 전처리 설계에 크게 좌우됨.\n· UI/UX 개선으로 모델 한계를 보완할 수 있음.\n· 실제 사용자 피드백 반영이 기능 완성도에 결정적.',
      },
    ],
    links: [],
  },

  'P-006': {
    code:    'P-006',
    title:   '대한전기협회 KEPIC AI',
    company: 'Clabi · 대한전기협회',
    period:  '2025.02 — 2025.11 (진행중)',
    role:    'AI Engineer (멀티턴 + 도메인 특화)',
    summary: '전력 산업 도메인 특화 멀티턴 질의응답 AI. 복잡한 산업 규격·절차를 이해하고 긴 대화 맥락에서도 정확한 답변을 제공하는 대화형 모델.',
    kpis: [
      { label: '평균 Latency', value: '40s → 15s', hint: 'Function Calling 정보 병합' },
      { label: '대화 턴',      value: '3턴 이상',  hint: 'Re-rank 적용' },
      { label: '아키텍처',     value: '모듈형',    hint: '재사용 가능 구조' },
    ],
    stack: ['LangChain', 'Re-rank', 'Function Calling', 'FastAPI', 'MySQL', 'Git'],
    images: [
      { src: 'assets/p-006/main.png', caption: 'KEPIC AI "Aide" 메인 화면' },
    ],
    sections: [
      {
        heading: 'Problem',
        body: '전력 산업의 복잡한 규격·절차를 이해하고, 긴 대화 맥락 속에서도 정확한 답변을 제공하는 대화형 AI 모델이 필요. 응답 정확도와 Latency 최적화 동시 요구.',
      },
      {
        heading: 'Approach',
        body: '① 멀티턴 대화 설계 — 3턴 이상 대화 이력 기반 Re-rank 적용.\n② Function Calling 활용 — 관련성·키워드·참고자료를 동시에 추출해 Latency 감소.\n③ 모듈형 아키텍처 — 데이터 전처리·대화 관리·응답 생성 로직을 독립 모듈로 분리, 재사용 가능 구조 설계.\n④ 도메인 학습 — 전력 산업 전문 용어·업무 프로세스 빠르게 습득, 실제 고객 질의 데이터 기반 파인튜닝/프롬프트 최적화.',
      },
      {
        heading: 'Result',
        body: '· 3턴 이상 연속 질의에서 응답 정확도 향상.\n· 평균 Latency 40초 → 15초 단축 (Function Calling 정보 병합).\n· 모듈형 설계로 다른 산업군에도 적용 가능한 구조 확보.',
      },
      {
        heading: 'Insights',
        body: '· 멀티턴 이력 기반 대화 관리 + Re-rank 적용으로 컨텍스트 유지.\n· Function Calling을 통한 정보 병합·처리로 속도 개선.\n· 전력 산업 지식 습득 후 룰·프롬프트 최적화로 품질 향상.',
      },
    ],
    links: [],
  },

  'P-008': {
    code:    'P-008',
    title:   '동아사이언스 과학매거진 생성형 AI 챗봇',
    company: 'Clabi · 동아사이언스',
    period:  '2025.03 — 2025.08',
    role:    'AI Engineer (RAG 재구축 + 시스템 리팩토링)',
    summary: '과학 잡지 콘텐츠 기반 Q&A 챗봇의 성능·유지보수성 개선. RAG 파이프라인 재구축 + 시스템 구조 리팩토링 + 운영 자동화.',
    kpis: [
      { label: '벡터DB',         value: 'Chroma → Milvus', hint: '검색 성능·확장성' },
      { label: '구조',          value: '모듈화 리팩토링' },
      { label: 'Git Convention', value: '브랜치 전략 도입' },
      { label: '배포',          value: 'Jenkins+ArgoCD' },
    ],
    stack: ['LangChain', 'Milvus', 'Git', 'Jenkins', 'ArgoCD'],
    images: [
      { src: 'assets/p-008/main.png', caption: '과학동아 AI 메인 페이지' },
    ],
    sections: [
      {
        heading: 'Problem',
        body: '기존 챗봇의 검색 성능 저하와 코드 복잡도. 확장 가능한 구조로 개선하여 운영 효율성을 높여야 함.',
      },
      {
        heading: 'Approach',
        body: '① 벡터DB 전환 — Milvus 도입 + 인덱스 최적화로 검색 성능·확장성 강화.\n② 구조 리팩토링 — 단일 구조를 모듈 단위로 재구성, 유지보수성 향상.\n③ 협업 프로세스 — Git 브랜치 전략·컨벤션 수립으로 팀 개발 생산성 향상.\n④ 배포 자동화 — Jenkins + ArgoCD 기반 CI/CD 파이프라인 구축.',
      },
      {
        heading: 'Result',
        body: '· Chroma → Milvus 이전, 대규모 데이터 처리에도 안정적인 검색·응답 구조 구현.\n· 모듈형 LangChain 파이프라인 재구축으로 확장 가능한 아키텍처 설계.\n· 배포 시간 단축 및 장애 발생 시 신속한 롤백 구조 마련.',
      },
      {
        heading: 'Insights',
        body: '· 벡터DB 선택과 설계가 RAG 품질에 직접 영향.\n· 대규모 리팩토링 경험을 통한 시스템 분석·개선 역량 강화.\n· CI/CD 구축이 운영 안정성과 개발 속도를 동시에 높임.',
      },
    ],
    links: [],
  },

  'P-009': {
    code:    'P-009',
    title:   '경상북도교육청 학교지원종합자료실',
    company: 'Clabi · 경상북도교육청',
    period:  '2025.02 — 진행중',
    role:    'DB 설계 (담당 부서 메타데이터 매핑 + 캘린더 AI)',
    summary: '기존 충남교육청 AI 서비스 인사이트 기반으로 문서별 메타데이터 구조 설계 및 신규 AI 기능 구현을 위한 DB 설계.',
    kpis: [
      { label: '담당 부서',  value: '자동 매핑' },
      { label: '캘린더 AI',  value: 'DB 설계' },
      { label: 'DBA 협업',  value: '쿼리 최적화' },
    ],
    stack: ['Python', 'Milvus', 'SQL', 'Git'],
    images: [],
    sections: [
      { heading: 'Problem',  body: '웹 문서의 담당 부서를 자동 매핑해 검색 품질을 높이고, 교무학사 캘린더 AI 구축을 위한 데이터 구조 준비.' },
      { heading: 'Approach', body: '① 담당 부서 메타데이터 매핑 — 저장 시 담당 부서 정보 포함.\n② 캘린더 AI용 DB 설계 — 교무학사 관련 일정 데이터 구조화.' },
      { heading: 'Result',   body: '충남교육청 인사이트를 바탕으로 웹 사이트 문서별 담당부서 메타데이터를 매핑하여 저장하는 구조 설계 및 데이터 적재. 교무학사 관련 캘린더 AI 구축을 위한 DB 설계 완료.' },
      { heading: 'Insights', body: '· DBA와 협업해 테이블 설계·쿼리 최적화 경험.\n· 데이터 구조 설계가 기능 구현 속도와 품질에 미치는 영향 체감.' },
    ],
    links: [],
  },

  /* ============================================================ *
   *  AIFFEL — P-007, P-010, P-011                                 *
   * ============================================================ */
  'P-007': {
    code:    'P-007',
    title:   'AI 기반 선적서류 자동화 솔루션',
    company: 'Aiffel · 리서치 과정',
    period:  '2024.09.05 — 2024.10.30',
    role:    '프로젝트 리딩 (RAG + Backend + MLOps)',
    summary: '선적 지시서(Shipping Instruction) 확인 → 선하증권(B/L) 발행을 위한 서류 검증을 자동화. 프로젝트 리딩, 서류 완전성 확인, 프롬프트 엔지니어링, FastAPI/Docker 백엔드 구축까지 수행.',
    kpis: [
      { label: '입력 문서',  value: 'B/L · S/I' },
      { label: '응답 형식',  value: 'JsonOutputParser' },
      { label: '배포',      value: 'Docker + FastAPI' },
      { label: '데이터',    value: '정규식 + RAG' },
    ],
    stack: ['LangChain', 'LangGraph', 'JsonOutputParser', 'FastAPI', 'Docker'],
    images: [
      { src: 'assets/p-007/sigenie-overview.png', caption: 'SiGenie — B/L 초안 + Validation Report 화면' },
    ],
    sections: [
      {
        heading: 'Problem',
        body: '선적 서류(Shipping Instruction, B/L) 검증은 양식이 다양하고 항목이 복잡해 수작업 시간이 큼. 응답의 신뢰성·일관성 확보가 핵심 과제.',
      },
      {
        heading: 'Approach',
        body: '① 모델 구현·성능 최적화 — 여러 AI 모델 테스트 + RAG 성능 최적화 + 정규 표현식 기반 데이터 전처리.\n② 일관성 있는 답변 — JsonOutputParser로 AI 응답 형식 강제 유지.\n③ 코드 협업 환경 — 모듈화된 코드 작성 + Git 활용한 협업.\n④ MLOps 파이프라인 — Docker + FastAPI로 배포 자동화 및 빠른 응답 제공.',
      },
      {
        heading: 'Result',
        body: '선적 서류 정확성을 높여 업무 효율성 향상, Latency 최적화로 사용자가 빠르게 신뢰성 있는 정보를 얻을 수 있는 시스템 개발 완료.',
      },
      {
        heading: 'Insights',
        body: 'AI 시스템 성능을 높이려면 응답 일관성 유지와 신뢰성 확보가 필수임을 깨달음. MLOps와 API를 활용한 실무 배포 경험을 통해 프로젝트 관리·유지보수의 중요성 체감.',
      },
    ],
    links: [],
  },

  'P-010': {
    code:    'P-010',
    title:   'AI 의료 진단 챗봇',
    company: 'Aiffel · 해커톤',
    period:  '2024.08.02 — 2024.08.08',
    role:    '프로젝트 리딩 (UI + 백엔드 구축 주도)',
    summary: '의료 접근성이 낮은 지역 사용자가 증상을 입력하면 예측 질병과 진료과를 안내받을 수 있는 AI 챗봇. 프로젝트 리딩, 효율적 업무 분담, UI·백엔드 구축 주도.',
    kpis: [
      { label: '기간',     value: '7일',  hint: '해커톤' },
      { label: '데이터',   value: '건강보험·KCD·AI 헬스케어' },
      { label: '서버',     value: 'Ollama 로컬',  hint: 'API 의존성↓' },
    ],
    stack: ['Python', 'Streamlit', 'FastAPI', 'Docker', 'Ollama', 'Hugging Face', 'RAG'],
    images: [],
    sections: [
      {
        heading: 'Problem',
        body: 'LLM을 활용한 의료 진단 보조 챗봇으로 사용자에게 신속한 예비 진료 정보를 제공, 병원 방문·의료 비용 절감 솔루션 제안. 의료 인프라가 부족한 지역의 의료 접근성 향상이 목표.',
      },
      {
        heading: 'Approach',
        body: '① 프로젝트 리딩·기획 — 의료 접근성 낮은 사용자에게 챗봇 활용 가능성 제안, 증상 입력으로 질병 예측·진료과 추천 시스템 설계.\n② 데이터 수집·전처리 — 건강보험 통계, KCD 등 의료 데이터 수집·정제, 모델 학습 최적화.\n③ 모델링·서버 구현 — Ollama 기반 로컬 서버로 API 의존성↓ + Streamlit/FastAPI로 UI·백엔드.\n④ 프롬프트 튜닝 — 사용자 질문 유사도 분석 + RAG로 예측 정확도 향상.',
      },
      {
        heading: 'Result',
        body: '사용자가 증상을 입력받아 해당 질병과 진료과를 안내하는 챗봇 시스템 구현 성공. 시연을 통해 불필요한 병원 방문 감소·의료 비용 절감 기여 가능성 증명.',
      },
      {
        heading: 'Insights',
        body: '의료 데이터 기반 데이터 수집·프롬프트 튜닝의 중요성을 이해, Ollama로 로컬 환경에서 서버 직접 구동함으로써 API 의존성↓ + 안전·신속한 서비스 제공 가능 확인. 정성적 평가 외 정량적 평가 도입 + 응답 신뢰성 강화를 위한 데이터 출처 정보 제공 등 개선 가능성 발견.',
      },
    ],
    links: [],
  },

  'P-012': {
    code:    'P-012',
    title:   '한국어 위협 대화 분류 (Ko-Threat-Detection)',
    company: 'Aiffel · DLthon',
    period:  '2024.06.24 — 2024.06.27',
    role:    '프로젝트 리딩 (전체 진행 + 모델링)',
    summary: '한국어 대화 데이터에서 협박·갈취·직장 내 괴롭힘 등 위협 유형을 분류하는 AI 모델. 자연어 이해(NLU) 기반 5종 멀티클래스 분류. 4일 DLthon 단기 프로젝트.',
    kpis: [
      { label: 'F1-score',    value: '0.886', hint: 'Test set 앙상블 결과' },
      { label: '클래스',       value: '5종',  hint: '협박·갈취·직장내·기타·일반' },
      { label: '학습/테스트',  value: '4클래스 → 5클래스', hint: '일반 대화 데이터셋 추가' },
    ],
    stack: ['koBERT', 'koELECTRA', 'koRoBERTa', 'LSTM', '1D CNN', 'Transformer', 'Wandb', 'PyTorch', 'Keras'],
    images: [],
    sections: [
      {
        heading: 'Problem',
        body: '대화의 위험 신호(협박·갈취·직장 내 괴롭힘 등)를 사전에 식별하는 모델이 필요. 단순 키워드 기반은 맥락을 놓침. 자연어 이해 기반 분류기가 필요.',
      },
      {
        heading: 'Approach',
        body: '① 데이터 전처리 — 위협 대화 특성에 맞는 불용어 사전·맞춤법 교정, 형태소 분석기(Komoran/Mecab) 비교 후 최적 도구 선택.\n② EDA·시각화 — 워드 클라우드 분석으로 위협 유형별 패턴 파악.\n③ 모델링 — koBERT, koELECTRA, koRoBERTa, LSTM, 1D CNN, Transformer, GPT 등 다양한 베이스라인 비교.\n④ 앙상블 — 사전 학습 모델들을 앙상블하여 최종 분류 모델 구축.\n⑤ 5클래스로 확장 — 4클래스(협박/갈취/직장내/기타) 학습 후 일반 대화 데이터셋 추가하여 5클래스 분류기로 확장.',
      },
      {
        heading: 'Result',
        body: '테스트 F1-score 0.886 달성. 위협 대화와 일반 대화를 효과적으로 구분하는 AI 모델 구축 완료. 단어 수준이 아닌 대화 맥락·화자 관계까지 고려하는 것이 성능 개선에 유의미함을 검증.',
      },
      {
        heading: 'Insights',
        body: '· 단순 단어 분류보다 대화 맥락·화자 관계 고려가 성능에 결정적.\n· 다양한 전처리·데이터 증강 기법의 중요성 체감.\n· 성능 평가의 체계화 — 각자 모델링 → 비교 → 인사이트 도출 → 개선의 반복 구조 확립.',
      },
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/seongyeon1/Ko-Threat-Detection' },
      { label: 'Wandb', url: 'https://wandb.ai/dogcat1943/text-multi-label-classification' },
    ],
  },

  'P-011': {
    code:    'P-011',
    title:   '요양병원 환자 보호자 AI 정보 제공 시스템',
    company: 'Aiffel',
    period:  '2024.09.05 — 2024.10.30',
    role:    'Frontend(Flutter) + Backend(LangChain RAG)',
    summary: '요양병원 환자 보호자들이 환자 상태·식단·병원비 정보를 쉽게 접근할 수 있도록 돕는 AI 정보 제공 시스템. RAG 모델 + LangChain 기반 검색 + Flutter 앱.',
    kpis: [
      { label: '프론트엔드', value: 'Flutter (독학)' },
      { label: 'OCR',      value: 'Upstage Layout Analysis' },
      { label: '검색 분기', value: 'Router (3분류)', hint: '환자정보·메뉴·병원비' },
    ],
    stack: ['Flutter', 'Python', 'LangChain', 'Chroma', 'OCR (UpstageLayoutAnalysisLoader)', 'RAG'],
    images: [],
    sections: [
      {
        heading: 'Problem',
        body: '요양병원 환자 보호자가 환자 상태·식단·병원비 등 다양한 정보에 쉽고 신속하게 접근하기 어려움. 직관적 UI와 정확한 검색을 동시에 제공하는 시스템이 필요.',
      },
      {
        heading: 'Approach',
        body: '① 데이터 전처리 — 의무기록지·식단표·병원비 데이터를 OCR(UpstageLayoutAnalysisLoader) + 변환으로 텍스트화.\n② Chunking — 각 문서를 적합한 크기로 분할, 검색 최적화.\n③ RAG 모델 구축 — 다양한 질문 유형에 대한 검색·답변 생성 최적화.\n④ Router 방식 — 질문 내용에 따라 환자정보/메뉴/병원비로 분류, 각기 다른 데이터를 context로 활용.',
      },
      {
        heading: 'Result',
        body: 'Flutter 앱을 통한 직관적이고 사용자 친화적인 정보 접근성 제공 성공. RAG와 LangChain 활용으로 복잡한 의료 정보를 효과적으로 검색·정확한 응답 제공.',
      },
      {
        heading: 'Insights',
        body: 'Flutter 앱 개발 + STT 기능 구현 경험으로 프론트엔드 기술 확장. LangChain·RAG의 강점을 활용해 복잡한 문서 기반 데이터를 효과적으로 분석·응답 생성하는 방법 습득.',
      },
    ],
    links: [],
  },

  /* ============================================================ *
   *  DATA CLUB (Dart-B) — P-013                                   *
   * ============================================================ */
  'P-013': {
    code:    'P-013',
    title:   'CJ더마켓 프라임 회원 예측 모델',
    company: '데이터 분석 학회 (Dart-B) · 2023 BDA 공모전',
    period:  '2023.03 — 2023.12',
    role:    '팀장 (4명)',
    summary: 'CJ더마켓의 유료 회원제 "The 프라임" 가입자를 예측하고 분석. 충성 고객 이탈 방지 + 신규 고객 유치를 위한 데이터 기반 맞춤형 마케팅 전략 수립. **2023 BDA 공모전 본선 진출**.',
    kpis: [
      { label: '대회',    value: '2023 BDA',  hint: '본선 진출' },
      { label: 'Best AUC', value: '0.86',     hint: '5-fold CV 평균' },
      { label: 'Best F1',  value: '0.81',     hint: '앙상블 모델' },
      { label: '팀 규모',  value: '4명 팀장' },
    ],
    stack: ['Python', 'Pandas', 'Scikit-learn', 'XGBoost', 'RandomForest', 'Tabnet', 'AutoML(pycaret)', 'KNN', 'K-means', 'miceforest', 'SMOTE'],
    images: [],
    sections: [
      {
        heading: 'Problem',
        body: 'CJ더마켓의 유료 회원제 "The 프라임" 가입을 예측하여 충성 고객 이탈 방지 + 신규 고객 유치를 위한 데이터 기반 마케팅 전략 수립. 잠재력이 높은 고객을 대상으로 맞춤형 마케팅을 시행해 유료 회원 가입률을 높이고 비즈니스 비용을 효율적으로 투자.',
      },
      {
        heading: 'Approach',
        body: '① 데이터 전처리 — 정규표현식 사전 전처리, 결측치 보간(KNN/K-means/miceforest), 범주형 데이터 변환(binary/ordinal encoding), SMOTE 오버샘플링.\n② 가설 수립 — (a) 가격 혜택 (b) 연령대(30–40대) (c) 성별 차이 (d) 구매 품목·금액 4가지.\n③ 파생 변수 — 카테고리·브랜드·인기상품·번들 여부 등 주요 파생 변수 생성.\n④ 모델링 — RandomForest · XGBoost · Tabnet 앙상블 + AutoML(pycaret) 비교.\n⑤ 검증 — k-fold 교차 검증으로 일반화 성능 확인.',
      },
      {
        heading: 'Result',
        body: '예측 모델로 프라임 회원 vs 비회원의 주요 차이를 설명하는 인사이트 도출. 잠재 고객에게 적합한 마케팅 활동 추천 가능. **2023 BDA 공모전 본선 진출** (★★★★★ 중요 프로젝트).',
      },
      {
        heading: 'Insights',
        body: '· 데이터 특성에 맞는 결측치 보간·파생 변수 생성의 중요성 체감.\n· 단순 상관관계 분석을 넘어 T-test·ANOVA 같은 통계 기법으로 변수 간 관계 정량 분석 필요성 확인.\n· 시계열 데이터 활용 심화 분석(RNN, LSTM)으로 고객 이탈 예측·생존 분석 모델 발전 가능성 발견.',
      },
    ],
    links: [],
  },

  /* ============================================================ *
   *  Internal Tools (BrainCrew) — placeholders                    *
   * ============================================================ */
  'IT-001': {
    code:    'IT-001',
    title:   'braincrew-index — Org Repository Dashboard',
    company: 'BrainCrew · 사내 도구',
    period:  '2026.01 — Active',
    role:    '기획·구현 (Python 파이프라인 + Next.js 대시보드)',
    summary: 'BrainCrew GitHub Org의 모든 저장소를 자동 추적·요약하는 사내 대시보드. 2시간마다 변경을 증분 감지하고, AWS Bedrock Claude로 저장소별 AI 요약을 생성하며, contributor 커밋을 팀별로 집계해 "주도(Lead) / 참여(Contributed)" 관계를 자동 매핑.',
    kpis: [
      { label: '업데이트 주기', value: '2시간',  hint: 'GitHub Actions cron + 증분 감지' },
      { label: '팀 매핑',      value: 'Auto',  hint: 'contributor 커밋 기반 Lead/Contributed 분리' },
      { label: 'AI 요약',      value: 'Bedrock', hint: 'Claude 3.5 Sonnet · 한 줄 요약 + 핵심 기능 3개 + 활동 상태' },
      { label: '배포',         value: 'GH Pages', hint: 'Next.js static export' },
    ],
    stack: ['Python', 'TypeScript', 'Next.js', 'GitHub Actions', 'AWS Bedrock (Claude)', 'GitHub Pages'],
    images: [
      { src: 'assets/it-001/dashboard.png', caption: '메인 대시보드 — 카테고리/팀/언어 필터 + AI 요약 카드 그리드' },
    ],
    mermaid: `flowchart LR
    Cron[GitHub Actions<br/>cron 0 */2 * * *]
    Cron --> Check[check_changes.py<br/>경량 diff 감지]
    Check -->|변경 있음| Fetch[fetch_repos.py<br/>repo + contributors]
    Check -->|변경 없음| Skip[Skip]
    Fetch --> TeamMap{Team Mapping}
    Teams[(teams.json<br/>수동 정의)] --> TeamMap
    TeamMap --> RepoData[(repos.json<br/>primary_team + teams[])]
    RepoData --> Summary[generate_summaries.py]
    Summary --> Bedrock[AWS Bedrock<br/>Claude 3.5 Sonnet]
    Bedrock --> SumCache[(summaries.json<br/>+ cache)]
    RepoData --> Build[Next.js Build<br/>static export]
    SumCache --> Build
    Build --> Pages[GitHub Pages<br/>대시보드]
    classDef src fill:#e1f5ff,stroke:#0066cc
    classDef proc fill:#fff4e1,stroke:#ff9900
    classDef ai fill:#ffe1f5,stroke:#cc0066
    classDef out fill:#e1ffe1,stroke:#009933
    class Cron,Check,Fetch,Summary,Build proc
    class Teams,RepoData,SumCache src
    class Bedrock ai
    class Pages out`,
    sections: [
      {
        heading: 'Problem',
        body: 'Org에 저장소가 빠르게 늘면서 (a) 어느 팀이 어떤 repo를 주도하는지 추적이 어렵고, (b) 신규 합류자가 코드베이스 전체를 파악하는 데 비용이 크고, (c) "이 repo가 뭐 하는 곳이지?"에 답할 단일 진실 소스가 없었음.',
      },
      {
        heading: 'Approach',
        body: '① **증분 인덱싱** — GitHub Actions cron으로 2시간마다 가벼운 diff(`check_changes.py`) 후 변경된 repo만 재수집. 전체 풀스캔은 수동 옵션.\n② **자동 팀 매핑** — `teams.json`(수동 정의 멤버십)과 contributor 커밋을 곱해 repo별 `primary_team`(주도, repo당 1팀) + `teams[]`(참여, 다중)을 산출. "Product 55/74" 같은 주도/참여 분리 노출.\n③ **AI 요약** — `generate_summaries.py`가 AWS Bedrock Claude 3.5 Sonnet에 README + topics + 언어 비율을 넣어 한 줄 요약 + 핵심 기능 3개 + 활동 상태를 생성, 캐시로 비용 최소화.\n④ **카테고리 자동 분류** — naming convention(`api-*`, `*-FE` 등) + GitHub Topics 이중 룰로 Frontend/Backend/Infra/Library/Tools/Docs 자동 태깅.\n⑤ **Next.js 정적 사이트** — `data/*.json`을 Next.js로 빌드해 GitHub Pages에 배포, 검색·필터·팀 오버뷰 페이지 제공.',
      },
      {
        heading: 'Result',
        body: '· Org 전체 repo 현황을 단일 대시보드로 확인 (홈 + `/teams/` 오버뷰).\n· "LEAD · Product" 같은 뱃지로 repo 카드에서 주도 팀 즉시 식별.\n· README 안 보고도 AI 요약으로 repo 목적 1초 파악.\n· 신규 팀원 온보딩 시 `data/teams.json`에 한 줄 추가하면 자동으로 모든 repo의 팀 매핑이 갱신됨.',
      },
      {
        heading: 'Insights',
        body: '· **수동 매핑 + 자동 집계** 분리가 핵심 — 팀 멤버십은 사람이 정하고(`teams.json`), 누가 어디 주도했는지는 git이 정함(commit count). 둘을 분리하니 사람 손이 거의 안 가면서도 정확.\n· **증분 + 캐시** 없으면 Bedrock 비용·Actions 시간이 폭발. `summaries_cache.json`으로 README 해시가 같으면 재호출 안 하도록 설계.\n· **Lead vs Contributed 동시 노출** — 한쪽만 보여주면 "Product 팀은 N개 repo 담당"이 모호. 주도/참여를 동시에 보여줘야 실제 영향도가 드러남.',
      },
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/braincrew-lab/braincrew-index' },
    ],
  },
  'IT-003': {
    code: 'IT-003', title: '회사 템플릿 PPT 생성 Skill',
    company: 'BrainCrew · 사내 도구', period: '2026.02 — Active',
    role: '기획·구현', summary: '회사 브랜드 템플릿에 맞춰 자동으로 PPT를 생성하는 Claude Skill.',
    kpis: [], stack: ['Claude Skills', 'python-pptx'],
    images: [], sections: [{ heading: 'TBD', body: '상세 자료 추가 예정' }], links: [],
  },
  'IT-004': {
    code: 'IT-004', title: 'Notion → 기술블로그 자동 배포',
    company: 'BrainCrew · 사내 도구', period: '2026.03 — Active',
    role: '기획·구현', summary: 'Notion에 작성한 문서를 자동으로 사내 기술블로그에 배포하는 파이프라인.',
    kpis: [], stack: ['Notion API', 'Markdown', 'CI/CD'],
    images: [], sections: [{ heading: 'TBD', body: '상세 자료 추가 예정' }], links: [],
  },
};

export const PROJECTS = redactObject(_PROJECTS_RAW);
