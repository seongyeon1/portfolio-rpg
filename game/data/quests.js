// Short labels for in-world signs (Kaboom default font is ASCII only).
// PUBLIC_MODE: see game/data/redaction.js for masking rules.

import { redactObject } from './redaction.js';

export const QUEST_LABELS = ['BRAINCREW', 'CLABI', 'AIFFEL', 'CAU INTERN', 'DATA CLUB', 'AI BOOTCAMP'];

const _QUESTS_RAW = [
  {
    id: 1, key: 'BRAINCREW',
    speaker: 'BrainCrew · AI Engineer',
    period:  '2025.09 — Present',
    projectIds: ['P-014', 'P-001', 'P-002', 'P-003', 'P-004', 'IT-001', 'IT-002', 'IT-003', 'IT-004'],
    pages: [
      '현재 BrainCrew에서 AI 엔지니어로 일하고 있어요.\n금융·Consumer·Enterprise·AdTech 도메인에서\n<span class="accent">Graph-RAG · 장기기억 MCP · LangGraph Agent</span>\n워크플로우 같은 고난이도 과제를 다룹니다.',
      '주요 프로젝트:\n· 🔥 <span class="accent">P-014</span> Telco Enterprise — 사내 Harness & Agent (<span class="num">2026.04~</span> 진행중)\n· <span class="accent">P-001</span> IBK Capital — AI 여신 승인 (<span class="num">70%↓</span> 처리시간, <span class="num">₩4.7억</span> 절감)\n· <span class="accent">P-002</span> LG Electronics — 라이프로그 RAG (<span class="num">92%</span> 정확도, <span class="num">85%↓</span> Latency)\n· <span class="accent">P-003</span> GS Caltex — Long-term Memory MCP\n· <span class="accent">P-004</span> HSAD — 광고 기획서 자동 구조화',
      '내부 도구:\n· <span class="accent">IT-001</span> braincrew-index (사내 Repo 인덱스)\n· <span class="accent">IT-002</span> Docker Log Monitor (실시간 장애 감지)\n· <span class="accent">IT-003</span> 회사 템플릿 PPT 생성 Skill\n· <span class="accent">IT-004</span> Notion → 기술블로그 자동 배포',
    ],
  },
  {
    id: 2, key: 'CLABI',
    speaker: 'Clabi · 전략기술연구소 AIOps',
    period:  '2024.12 — 2025.08',
    projectIds: ['P-005', 'P-006', 'P-008', 'P-009'],
    pages: [
      '클라비 전략기술연구소 AIOps 팀에서\n공공·전력·교육·과학 도메인의\nEnd-to-End RAG 파이프라인을\n설계·구축·운영했습니다.',
      '주요 프로젝트:\n· <span class="accent">P-005</span> 충청남도교육청 초거대 생성형 AI (Lead E2E)\n· <span class="accent">P-006</span> 대한전기협회 KEPIC AI (Latency <span class="num">40s→15s</span>, 3턴 멀티턴)\n· <span class="accent">P-008</span> 동아사이언스 과학매거진 AI 챗봇\n· <span class="accent">P-009</span> 경상북도교육청 학교지원종합자료실',
      '공통 MLOps:\n· Milvus 벡터DB 인덱스 최적화 + 병렬처리\n· Jenkins + ArgoCD + K8s CI/CD\n· 모듈화 리팩토링 + Git Convention 수립',
    ],
  },
  {
    id: 3, key: 'AIFFEL',
    speaker: 'Aiffel · 리서치 과정',
    period:  '2024.05 — 2024.11',
    projectIds: ['P-007', 'P-010', 'P-011', 'P-012'],
    pages: [
      '아이펠 리서치 과정에서\n<span class="accent">DLthon · 한이음 ICT · 해커톤</span>\n다양한 실전 트랙에 적극 참여하며\n6개월 동안 14개 프로젝트를 수행했습니다.',
      '주요 프로젝트:\n· <span class="accent">P-007</span> SiGenie 선적서류 자동화 (DLthon)\n· <span class="accent">P-010</span> AI 의료 진단 챗봇 (해커톤)\n· <span class="accent">P-011</span> 요양병원 보호자 AI (효도AI)\n· <span class="accent">P-012</span> 한국어 위협 대화 분류 (F1 <span class="num">0.886</span>)',
      '기초 구현 (Aiffle GitHub):\n<span class="accent">Transformer · 한국어 챗봇 · 한글 영어 번역기</span>\n모두 밑바닥부터 직접 구현.\nGPT 논문 재현으로 LLM 동작 원리를\n코드 레벨에서 이해했어요.',
      '학습 스택:\nPyTorch · LangChain · LangGraph · FastAPI · Docker\nkoBERT · koELECTRA · koRoBERTa · Hugging Face\nWandb로 실험 관리 + Notion·Discord 협업.',
    ],
  },
  {
    id: 4, key: 'CAU',
    speaker: '중앙대학교 · 학부 인턴',
    period:  '2022.08 — 2023.04',
    projectIds: [],
    pages: [
      '응용통계학 전공 학부 인턴으로\n중앙대학교 <span class="accent">AI 연구실 (DILAB)</span>에서\n의료 데이터 ML 모델링을 시작했습니다.',
      '주요 활동:\n· <span class="accent">근시퇴행 예측·생존 분석</span> ML 모델\n· <span class="accent">소아 응급환자 응급분류</span> (T-test·상관관계)\n· <span class="accent">심혈관조형술(CAG) 후 생존 분석</span> (의료진 협업)\n· 암 예후 예측 경진대회 참여',
      '폐쇄형 서버에서 vim으로 데이터 분석.\n매주 1편씩 AI 논문을 읽고\nlab 동료들과 discussion하며\n데이터 기반 문제 해결의 뿌리를 만든 시기.',
    ],
  },
  {
    id: 5, key: 'DATACLUB',
    speaker: '데이터 분석 학회 (Dart-B)',
    period:  '2023.03 — 2023.12',
    projectIds: ['P-013'],
    pages: [
      '데이터 분석 학회(Dart-B)에서\n예측 모델링 프로젝트를\n<span class="accent">팀장으로 주도</span>했습니다.',
      '주요 프로젝트:\n· <span class="accent">P-013</span> CJ더마켓 프라임 회원 예측 (<span class="num">2023 BDA</span> 본선 진출)',
      '실무 데이터를 다루며\n분석 → 모델링 → 검증의 사이클을\n반복하며 익혔어요.\nXGBoost · pycaret · SMOTE 활용.',
    ],
  },
  {
    id: 6, key: 'KDT',
    speaker: '인공지능 개발자 양성 과정',
    period:  '2021.05 — 2021.11',
    projectIds: [],
    pages: [
      'AI 개발자의 첫걸음.\n실무 프로젝트 중심으로\n학습한 6개월입니다.',
      '주요 프로젝트:\n· 미니 프로젝트: <span class="accent">머신러닝 기반 입지 선정</span>\n· 실무 프로젝트: <span class="accent">무역서류 기반 자금세탁 방지</span>',
      '여기서 배운 기초가\n지금까지 쌓아온 모든 경험의\n시작점이 되었어요.',
    ],
  },
];

export const QUESTS = redactObject(_QUESTS_RAW);
