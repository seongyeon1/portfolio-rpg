// Character sheet data — rendered by ui/statusPanel.js.
// Tabs: STATUS (identity+skills) / EDU / CERTS / AWARDS.
// PUBLIC_MODE: see game/data/redaction.js for masking rules.

import { redactObject } from './redaction.js';

const _PROFILE_RAW = {
  identity: {
    name:    '김성연',
    nameEn:  'Seongyeon Kim',
    location:'Based in Seoul',
    level:   5,
    class:   'AI Research Engineer',
    company: 'BrainCrew',
    title:   '데이터 기반 문제 해결 & LLM 실전',
    specialty: ['RAG', 'LangGraph', 'MCP', 'Agent', 'Harness', 'Context Engineering'],
    summary: 'LLM·RAG 기반 AI 애플리케이션, 특히 RAG 파이프라인 · Agent 워크플로우 · MCP 적용에 깊은 관심과 실전 경험을 갖춘 AI 엔지니어입니다. 단순한 모델 호출이 아닌 실제 제품화 가능한 구조 설계, 평가 자동화, 성능 개선 사이클을 전 주기적으로 설계·실행하는 데 몰입해왔습니다.\n\nLangGraph 기반 멀티턴 RAG, custom retriever + reranker 조합 실험, tool + agent 체계 설계 등 실제 응용을 위한 고민과 실험을 지속하며 — 공공·과학·전력·금융 다양한 도메인에서 LLM 서비스를 구축하고 있습니다.',
    capabilities: [
      'LLM 기반 파이프라인 및 품질 평가',
      '구조화 / 비구조화 문서를 아우르는 RAG 아키텍처 설계',
      'LangGraph 기반 멀티턴 대화 시스템 구현',
      '프롬프트 엔지니어링 및 사용자 시나리오 설계',
      '협업 중심의 MLOps 및 배포 파이프라인 구축',
    ],
    strengths: '8개월간의 실무 경험과 다수의 개인·팀 프로젝트를 통해 RAG 파이프라인·Agent 워크플로우·멀티턴 대화 시스템 등 최신 LLM 응용 기술을 설계·구현. 네이버 클라우드·쿠버네티스 기반 서비스 배포·자동화 경험. 성능 고도화를 위한 인사이트 도출에 능숙.',
    targets: [
      'LLM·AI 기술을 통해 더 나은 비즈니스 가치와 사용자 경험을 만드는 것',
      'MCP·A2A 등 최신 AI 기술 실전 적용 및 오픈소스 기여',
      '끊임없이 도전·학습하며 팀에 긍정 에너지·전문성을 더하는 엔지니어로 성장',
    ],
  },

  // Categorized tech stack — sourced from portfolio page 2 + actual project usage
  techStack: {
    '언어':              ['Python', 'SQL', 'R', 'Dart (기초)'],
    'AI / LLM':          ['LangChain', 'LangGraph', 'PyTorch', 'TensorFlow', 'Hugging Face', 'Ollama'],
    '데이터 분석':        ['Pandas', 'NumPy', 'Scikit-learn', 'XGBoost', 'AutoML (pycaret)'],
    '데이터 시각화':      ['Matplotlib', 'Seaborn'],
    '백엔드 / 프레임워크': ['FastAPI', 'Django', 'Streamlit', 'Next.js', 'Flutter (기초)'],
    'DB / 벡터DB':        ['PostgreSQL', 'MySQL', 'MongoDB', 'Elasticsearch', 'Redis', 'Milvus', 'ChromaDB'],
    'MLOps / 인프라':     ['Docker', 'Kubernetes', 'Jenkins', 'ArgoCD', 'Crontab', 'AWS Bedrock', '네이버 클라우드'],
    '개발환경':          ['VS Code', 'Jupyter Notebook', 'PyCharm'],
    '형상관리 / 실험':    ['GitHub', 'Wandb', 'LangSmith'],
  },

  // Skills as RPG-style progress bars (level: 0-100).
  skills: [
    { name: 'LangChain · RAG',         level: 92, group: 'AI' },
    { name: 'LangGraph Agent',         level: 85, group: 'AI' },
    { name: 'Prompt Engineering',      level: 88, group: 'AI' },
    { name: 'Vector DB (Milvus·Chroma)', level: 82, group: 'AI' },
    { name: 'Python · FastAPI',        level: 90, group: 'Backend' },
    { name: 'MLOps (K8s·ArgoCD·Jenkins)', level: 78, group: 'MLOps' },
    { name: 'Docker · CI/CD',          level: 80, group: 'MLOps' },
    { name: 'Data Analysis · 통계',    level: 82, group: 'Data' },
    { name: 'Flutter (독학)',          level: 50, group: 'Frontend' },
  ],

  // Unified chronological career timeline — work + research + edu + bootcamp + club.
  // Newest first. type drives the color tag in the UI.
  timeline: [
    {
      period: '2025.09 — Present',
      type:   'WORK',
      org:    'BrainCrew',
      role:   'AI Engineer',
      details: [
        '금융 · Consumer · Enterprise · AdTech 도메인 RAG · Agent 시스템 구축',
        'IBK Capital(여신 승인) · LG Electronics(라이프로그 RAG) · GS Caltex(Long-term Memory MCP) · HSAD(광고 기획서 구조화)',
        '사내 도구: braincrew-index · Docker Log Monitor · PPT 생성 Skill · Notion → 기술블로그 자동 배포',
        '사내 아이디어 경진대회 우수상·장려상 (2025.01–03)',
      ],
    },
    {
      period: '2024.12 — 2025.08',
      type:   'WORK',
      org:    'Clabi · 전략기술연구소 AIOps 팀',
      role:   '연구원',
      details: [
        '공공·과학·전력·교육 도메인 End-to-End RAG 파이프라인 설계·구현',
        '충청남도교육청 (Lead E2E) · KEPIC AI · 동아사이언스 · 경상북도교육청',
        'Milvus 벡터DB 인덱스 최적화 · LangGraph 멀티턴 시스템 · 도메인 특화 품질 최적화',
        'Jenkins + ArgoCD + Kubernetes 기반 CI/CD 파이프라인 구축',
      ],
    },
    {
      period: '2024.05 — 2024.11',
      type:   'RESEARCH',
      org:    '아이펠 리서치 과정',
      role:   'Research Trainee',
      details: [
        'Transformer · 한국어 챗봇 · 한글 영어 번역기 from scratch 구현 (Aiffle GitHub)',
        'DLthon SiGenie (선적서류 자동화) · AI 의료 진단 챗봇 (해커톤) · 요양병원 보호자 AI · 한국어 위협 대화 분류',
        'KDT 해커톤 고용노동부장관상 — "이야기 보따리" (2024.09–11)',
        'DPG 해커톤 우수상 — 응급 대응 지원 솔루션 (2024.11)',
      ],
    },
    {
      period: '2023.03 — 2023.12',
      type:   'CLUB',
      org:    '데이터 분석 학회 (Dart-B)',
      role:   '팀장',
      details: [
        'CJ더마켓 프라임 회원 예측 모델 (2023 BDA 공모전 본선 진출)',
        'XGBoost · pycaret · SMOTE 등 ML 풀 스택 활용',
      ],
    },
    {
      period: '2022.08 — 2023.04',
      type:   'RESEARCH',
      org:    '중앙대학교 AI 연구실 (DILAB)',
      role:   '학부 인턴',
      details: [
        '의료 데이터 ML 모델링 — 근시퇴행 예측·생존 분석',
        '소아 응급환자 응급분류 모델 (T-test, 상관관계)',
        '심혈관조형술 (CAG) 후 생존 분석 (의료진 협업)',
        '암 예후 예측 경진대회 참여 + 매주 AI 논문 discussion',
      ],
    },
    {
      period: '2021.05 — 2021.11',
      type:   'BOOTCAMP',
      org:    'KDT 인공지능 개발자 양성 과정',
      role:   'Trainee',
      details: [
        '미니 프로젝트: 머신러닝 기반 입지 선정',
        '실무 프로젝트: 무역서류 기반 자금세탁 방지',
        'AI 개발자의 첫걸음 — 6개월 실무 중심 학습',
      ],
    },
    {
      period: '2019.03 — 2025.02',
      type:   'EDU',
      org:    '중앙대학교 (Chung-Ang University)',
      role:   '응용통계학 학사 (B.S. Applied Statistics)',
      details: [
        '★ 응용통계학과 공모전 최우수상 — "알려줘! 홈즈" (2023.12)',
        '★ 경영경제대학 학술제 우수상 — 인공지능탐정단 (2023.06)',
        '★ 생산관리학회 공모전 장려상 — 발광다트비 (2023.05)',
        '★ 미래에셋·NH투자증권 공모전 장려상 (2022)',
      ],
    },
    {
      period: '2015.03 — 2017.02',
      type:   'EDU',
      org:    '소래고등학교',
      role:   '졸업',
    },
  ],

  certifications: [
    { date: '2024.10.06', name: 'Google Cloud AI Study Jam', issuer: 'Google' },
    { date: '2024.08.28', name: 'Google Data Analytics Certification', issuer: 'Coursera' },
    { date: '2024.07.12', name: '빅데이터 분석기사', issuer: '과학기술정보통신부 · 통계청' },
    { date: '2023.08.28', name: 'Machine Learning', issuer: 'Coursera' },
    { date: '2022.11.12', name: 'AICE 자격증', issuer: '(주)KT · 한국경제신문' },
    { date: '2021.06.18', name: '데이터 분석 준전문가 (ADsP)', issuer: '한국데이터산업진흥원' },
  ],

  // tier: 'GOLD' | 'SILVER' | 'BRONZE'
  awards: [
    {
      date:  '2024.09.27 — 11.20',
      tier:  'GOLD',
      title: 'KDT 해커톤 고용노동부장관상',
      org:   'KDT 해커톤',
      project: '"이야기 보따리"',
      description: '노인의 이야기를 녹음·텍스트 변환·재구성·동화 형식으로 생성하는 앱. 팀장 + 백엔드(LangChain · OpenAI · FastAPI · STT) + 기획 작성. 노인 정서 안정 + 세대 간 소통 + 콘텐츠 수익 환원까지 구상.',
    },
    {
      date:  '2023.12.01',
      tier:  'GOLD',
      title: '응용통계학과 공모전 최우수상',
      org:   '중앙대학교 응용통계학과',
      project: '"알려줘! 홈즈" — 채용공고 텍스트 마이닝 & 생성형 AI 취업 인사이트',
      description: '5단계 파이프라인: ① 데이터 수집 (1,200개 채용공고 크롤링) → ② NLP 전처리 (SoyNLP·Kkma 형태소) → ③ 키워드 추출 (K-means++·BERTopic·KeyBERT) → ④ 서비스 분석 (Text Network · Few-Shot Prompting GPT-3.5) → ⑤ Django 웹 서비스 구현. 비정형 채용공고를 분석해 취업 준비생에게 개인 맞춤 직무 경험·역량을 추천. 비정형 데이터 분석의 실질적 효과·상용화 가능성 증명.',
    },
    {
      date:  '2025.01 — 03',
      tier:  'SILVER',
      title: '사내 아이디어 경진대회 우수상',
      org:   'BrainCrew',
      project: 'Table 특화 finetuning sLLM',
      description: '사내 아이디어 경진대회 출품작. 표(Tabular) 데이터 처리에 특화된 sLLM 파인튜닝 아이디어로 우수상 수상.',
    },
    {
      date:  '2024.11.11 — 11.14',
      tier:  'SILVER',
      title: 'DPG 해커톤 우수상',
      org:   '업스테이지 글로벌 AI',
      project: '응급 대응 지원 솔루션 (Emergency Response Assistance)',
      description: '119 응급 구조대·의료진 업무를 지원하는 AI 솔루션. Pre-KTAS 기준 환자 분류 모델 (Solar-Mini + RAG + Upstage Solar-Embedding). 경증/중증 환자 분류로 응급 의료 자원 효율성 극대화. 본선 진출.',
    },
    {
      date:  '2023.06.01',
      tier:  'SILVER',
      title: '경영경제대학 학술제 우수상',
      org:   '중앙대학교',
      project: '인공지능탐정단 — 합성 데이터 품질 평가',
      description: '합성 데이터의 성능 평가를 위한 통계적 분석. DCGAN 기반 데이터 생성 + t-SNE 차원 축소 + K-Means 클러스터링 + 콜모고로프-스미르노프 검정으로 실 데이터와의 분포 유사도 검증.',
    },
    {
      date:  '2025.01 — 03',
      tier:  'BRONZE',
      title: '사내 아이디어 경진대회 장려상',
      org:   'BrainCrew',
      project: '법령정보 특화 AI Agent 솔루션',
      description: '사내 아이디어 경진대회 두 번째 출품작. 법령정보 도메인에 특화된 AI Agent 솔루션 제안.',
    },
    {
      date:  '2023.05.12',
      tier:  'BRONZE',
      title: '생산관리학회 공모전 장려상',
      org:   '한국생산관리학회 · KOMIPO(한국중부발전)',
      project: '"발광다트비" — AI 기반 통합 에너지 관리 플랫폼 서비스',
      description: 'AI 기반 통합 에너지 관리 플랫폼 서비스 제안. 한국생산관리학회 + KOMIPO(한국중부발전) 공동 주최 공모전 장려상.',
    },
    {
      date:  '2022.09.19 — 11.28',
      tier:  'BRONZE',
      title: 'NH투자증권 공모전 장려상',
      org:   'NH투자증권',
      project: 'NH투자증권 고객 분류·추천 서비스',
      description: '투자 성향에 따라 VIP / 일반 고객 분류 + 차별화된 추천 서비스 시스템. K-means 클러스터링 + 행동 데이터 기반 파생 변수 + 코스피·섹터 외부 데이터 결합. 본선 진출 + 장려상.',
    },
    {
      date:  '2022.06.27 — 11.16',
      tier:  'BRONZE',
      title: '미래에셋증권 공모전 장려상',
      org:   '미래에셋증권',
      project: 'Dinger 포트폴리오 시스템',
      description: 'ML + 강화학습(PPO) 기반 자동 포트폴리오 리밸런싱. 점수화 로직 + 포트폴리오 리밸런싱 + 백테스팅(vs Buy & Hold). Yahoo·Naver Finance API 활용. 본선 진출 + 장려상.',
    },
  ],
};

export const PROFILE = redactObject(_PROFILE_RAW);
