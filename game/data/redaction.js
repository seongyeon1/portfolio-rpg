// NDA-aware redaction layer.
// Single source of truth for what gets masked when PUBLIC_MODE is on.
// To restore the full version: flip PUBLIC_MODE to false (or remove keys from REDACT).

export const PUBLIC_MODE = true;

// Mapping: confidential string -> public-safe replacement.
// Order matters: longer keys must come before shorter substrings (e.g. 'GS Caltex' before 'GS').
export const REDACT = {
  // --- BrainCrew clients ---
  'IBK Capital':       '금융사 A',
  'IBKC':              '금융사 A',
  'LG Electronics':    'Consumer 대기업',
  'GS Caltex':         'Enterprise B',
  'GS칼텍스':           'Enterprise B',
  'GSC':               'Enterprise B',
  'HSAD':              'AdTech 대행사',

  // --- Clabi clients ---
  '충청남도교육청':       '광역지자체 교육청 A',
  '충남교육청':          '광역지자체 교육청 A',
  '대한전기협회 KEPIC': '전력 산업 협회',
  '대한전기협회':         '전력 산업 협회',
  'KEPIC AI':          '도메인 특화 AI',
  'KEPIC':             '전력 산업 협회',
  '동아사이언스':        '과학 매거진사',
  '과학동아':            '과학 매거진',
  '경상북도교육청':       '광역지자체 교육청 B',
  '경북교육청':          '광역지자체 교육청 B',
  '미래엔':              '교육 콘텐츠 기업',
  '삼성물산':            'Tier-1 기업',

  // --- Internal solutions / system names ---
  'MISO':              '사내 AI 플랫폼',
  '마음e풀럭':           '챗봇 서비스',
  'Aide':              '도메인 특화 AI',

  // --- Absolute KPI numbers ---
  '₩4.7억/년':         '수억원/년 규모',
  '₩4.7억':            '수억원',
  '4.7억':              '수억원',
  '79.4/100':          '내부 평가 우수',
  '79.4점':             '내부 평가 우수',
};

// Placeholder image used in PUBLIC_MODE for any client screenshot path.
// Kept for backward compat; with NDA_PROTECTED entries, we now strip images entirely.
export const REDACTED_IMAGE_SRC = 'assets/_redacted.svg';

// Project codes whose architecture diagrams + screenshots reveal client systems.
// For these, the entire `mermaid` and `images` fields are wiped (not just text-redacted),
// and an NDA notice section is appended so the modal still communicates the omission.
export const NDA_PROTECTED = new Set([
  // BrainCrew clients
  'P-001', 'P-002', 'P-003', 'P-004',
  // Clabi clients
  'P-005', 'P-006', 'P-008', 'P-009',
  // Active engagement (already textually anonymized as "Telco Enterprise")
  'P-014',
  // Internal tools (IT-001~004) and Aiffel/Dart-B (P-007, P-010~013) are intentionally
  // NOT in this set — they're public/safe and show full architecture.
]);

const NDA_NOTICE_SECTION = {
  heading: '🔒 Architecture & Screenshots',
  body: '실제 아키텍처 다이어그램과 클라이언트 UI 스크린샷은 NDA 보호로 비공개 처리됐습니다. 면접·평가 목적의 풀버전 자료가 필요하시면 ksy974498@gmail.com 으로 연락 주세요.',
};

// Recursively redact all string values in an object/array.
// - String fields: text-replace via REDACT mapping
// - `src` fields under images[]: replaced with REDACTED_IMAGE_SRC
// - Objects with `code` in NDA_PROTECTED: mermaid + images wiped, NDA notice appended
export function redactObject(obj, parentKey = '') {
  if (!PUBLIC_MODE) return obj;

  if (typeof obj === 'string') {
    if (parentKey === 'src') return REDACTED_IMAGE_SRC;
    return applyTextRedaction(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => redactObject(item, parentKey));
  }

  if (obj && typeof obj === 'object') {
    const result = {};
    for (const [k, v] of Object.entries(obj)) {
      result[k] = redactObject(v, k);
    }
    if (result.code && NDA_PROTECTED.has(result.code)) {
      result.mermaid = '';
      result.images = [];
      if (Array.isArray(result.sections)) {
        result.sections = [...result.sections, NDA_NOTICE_SECTION];
      }
    }
    return result;
  }

  return obj;
}

function applyTextRedaction(text) {
  let result = text;
  for (const [key, val] of Object.entries(REDACT)) {
    if (result.includes(key)) {
      result = result.split(key).join(val);
    }
  }
  return result;
}
