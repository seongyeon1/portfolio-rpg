# Seongyeon Kim — Interactive Portfolio (Kirby's Quest RPG)

> Top-down 픽셀 RPG로 커리어와 프로젝트를 탐험하는 단일 페이지 웹앱

[![Live Demo](https://img.shields.io/badge/Live_Demo-Play-FFA6C4?style=flat-square&logo=html5&logoColor=white)](https://seongyeon1.github.io/portfolio-rpg/)
[![Email](https://img.shields.io/badge/Email-ksy974498%40gmail.com-EA4335?style=flat-square&logo=gmail&logoColor=white)](mailto:ksy974498@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-seongyeon1-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/seongyeon1)

---

## 컨셉

별 모양 아이콘이 떠있는 표지판(=커리어), 그 옆에 책 받침대(=프로젝트 디테일)가 놓인 평화로운 마을. 커비를 닮은 캐릭터가 6개 회사·과정을 돌며 별을 모으면 하단 다이얼로그로 그 시기 이야기를, 책 받침대로 그 시기에 한 프로젝트의 KPI·아키텍처·스택을 풀스크린 모달로 볼 수 있습니다.

[Kaboom.js 3000](https://kaboomjs.com/) 위에 자체 모듈로 짜여진 No-Build 포트폴리오. **빌드 도구 0개**, 단일 HTML + ES Modules + CDN.

---

## 🔒 NDA Notice

이 저장소는 일반에 공개된 버전입니다. 일부 클라이언트 프로젝트의 **회사명 / 사내 시스템명 / 절대 KPI 수치 / 스크린샷**은 NDA 보호 차원에서 자동 마스킹됐습니다.

| 보호 대상 | 처리 |
|----------|------|
| 클라이언트 회사명 | "금융사 A" · "Consumer 대기업" · "Enterprise B" 등 일반화 |
| 사내 시스템·서비스명 | "사내 AI 플랫폼" · "도메인 특화 AI" · "챗봇 서비스" 등 |
| 화폐 절대값 / 절대 점수 | "수억원/년 규모" · "내부 평가 우수" 등 |
| 클라이언트 UI 스크린샷 | `[ REDACTED ]` placeholder SVG |
| 일반 임팩트 비율 (`70%↓`, `92%`) | 그대로 유지 |
| 기술 스택 / 본인 역할 / 기간 | 그대로 유지 |

상세 자료가 필요하시면 이메일로 연락주세요 — 면접·평가 목적으로 마스킹 해제된 풀버전을 별도 공유드립니다.

마스킹 메커니즘은 단일 파일 [`game/data/redaction.js`](./game/data/redaction.js)에 정의돼 있어 한 줄(`PUBLIC_MODE = true/false`)로 전환됩니다.

---

## 데모

```bash
git clone https://github.com/seongyeon1/portfolio-rpg.git
cd portfolio-rpg
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000/
```

> ES Modules는 `file://` 직접 열기를 지원하지 않으므로 로컬 HTTP 서버가 필요합니다. `npx serve`나 VS Code Live Server도 동일하게 동작합니다.

---

## 주요 기능

- **Top-down RPG 월드** — 16×28 타일맵, 풀·꽃·나무·물·구름이 살아 움직이는 픽셀 월드, 커비형 플레이어 (walk·eye-tracking·blink·점프 spin)
- **커리어 다이얼로그** — 표지판 옆에서 SPACE → 타이프라이터 다이얼로그. 별 6개 모으면 ENDING + 연락처 노출
- **프로젝트 모달** — 책 받침대 SPACE → 카드 그리드 → 상세 뷰 (Hero · KPI · Stack · Problem/Approach/Result/Insights · Mermaid 아키텍처 · 갤러리). 같은 시기 프로젝트는 탭 스트립으로 1클릭 점프
- **STATUS 패널 (캐릭터 시트)** — TAB으로 풀스크린, 4탭 (STATUS · EDU · CERTS · AWARDS)

---

## 조작법

| 키 | 동작 |
|----|------|
| `←` `↑` `↓` `→` | 캐릭터 이동 |
| `SPACE` / `ENTER` | 별 받기 / 다이얼로그 다음 / 모달 열기 |
| `E` | 다이얼로그 중 프로젝트 상세 모달로 점프 |
| `TAB` | STATUS 패널 토글 |
| `ESC` | 모달·라이트박스·STATUS 닫기 |
| `1` `2` `3` `4` | STATUS 패널 탭 직접 점프 |
| 모달 내 `←` `→` | 이전/다음 프로젝트 |
| 모달 내 `Backspace` | 그리드 카드 뷰로 복귀 |

---

## 기술 스택

| 영역 | 사용 |
|------|------|
| 게임 엔진 | [Kaboom.js 3000](https://kaboomjs.com/) (CDN) |
| 다이어그램 | [Mermaid 10](https://mermaid.js.org/) (CDN) |
| 폰트 | Press Start 2P · Galmuri11 · Pretendard Variable · JetBrains Mono |
| 모듈 | Native ES Modules (No bundler) |
| 빌드 | None — 단일 HTML 진입, 정적 호스팅으로 충분 |

빌드 도구 없이 정적 호스팅만으로 동작합니다 (GitHub Pages · Vercel · Netlify · Cloudflare Pages 모두 가능).

---

## 프로젝트 구조

```
.
├── index.html                      # 진입점 (마크업 + <link>/<script type="module">)
├── styles/
│   ├── base.css · title.css · hud.css · modal.css · status.css
├── game/
│   ├── main.js · state.js · helpers.js · error-toast.js · palette.js · player.js
│   ├── data/
│   │   ├── map.js                  # 16×28 타일맵 + TILE 상수
│   │   ├── quests.js               # 6개 표지판 (시기·다이얼로그·projectIds)
│   │   ├── projects.js             # 프로젝트 12+ (KPI·stack·sections·mermaid·images)
│   │   ├── profile.js              # STATUS 데이터 (identity·skills·edu·certs·awards)
│   │   └── redaction.js            # 🔒 NDA 마스킹 레이어
│   ├── world/                      # tiles · signs · stones · clouds
│   └── ui/                         # dialog · projectModal · statusPanel · overlays
└── assets/
    └── _redacted.svg               # 클라이언트 스크린샷 placeholder
```

---

## License & Credits

- 콘텐츠 (텍스트·프로젝트 데이터): © 2026 Seongyeon Kim. All rights reserved.
- 코드 구조: 학습·재사용 가능. 본인 이름·콘텐츠 교체 후 사용 시 출처 표기 부탁드립니다.
- 외부 의존: Kaboom.js (MIT) · Mermaid (MIT) · Press Start 2P (OFL) · Galmuri11 (OFL) · Pretendard (OFL)

---

## Contact

- **Email** — ksy974498@gmail.com
- **GitHub** — [seongyeon1](https://github.com/seongyeon1)
- **LinkedIn** — [seongyeon1](https://www.linkedin.com/in/seongyeon1/)
