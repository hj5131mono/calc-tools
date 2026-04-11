# CLAUDE.md — calc-tools.kr (한국 노동법·세법 가이드 + 계산 도구)

> 이 파일이 180줄을 넘으면 `docs/` 하위 파일로 분리할 것.
> 모든 가이드 .md 파일은 `@` 재귀-참조 모델로 연결한다.
>
> **2026-04-11 컨셉 전환**: "자동사냥 유틸리티 사이트" → "한국 노동법·세법 가이드 + 계산 도구"
> 3차 AdSense 거절 후 리브랜딩. 컨셉 전환 + E-E-A-T 강화 + UX 극대화로 4차 통과를 노린다.
> 상세 플랜: `C:/Users/ahnhj/.claude/plans/unified-dazzling-sparkle.md`

## 세션 운영 규칙

- **compact 지양**: auto-compact 포함 모든 compact를 최대한 피한다.
- **handover 선제 실행**: 작업량이 많아 compact 위험이 감지되면 작업 완료 전이라도 `/handover`를 먼저 실행한다.

## 작업별 참조 가이드

| 작업 | 참조 파일 |
|------|-----------|
| **에이전트 팀 협업·호출** ⭐ | `@docs/team/README.md` (5명 + MD board) |
| **5원칙 (모든 에이전트 헌법)** | `@docs/team/PRINCIPLES.md` (특히 Grey Zone) |
| 에이전트 명단·역학관계 | `@docs/team/ROSTER.md` |
| 현재 진행 중 미션 | `@docs/team/board/current.md` |
| 백로그·미래 미션 | `@docs/team/board/backlog.md` |
| 아키텍처 / 공유 레이어 / 페이지 목록 | `@docs/ARCHITECTURE.md` |
| 새 도구 페이지 추가 | `@docs/ARCHITECTURE.md` > 체크리스트 |
| UX 라이팅 / UI 패턴 | `@UX_GUIDE.md` |
| 세율·요율 자동 업데이트 | `@docs/RATES_SYSTEM.md` |
| 세율·요율 수동 업데이트 절차 | `@docs/RATES_MANUAL.md` |
| 이전 세션 인계 / 작업 이력 | `@docs/handover/` |

## 에이전트 팀 (2026-04-12 셋업)

본 프로젝트에는 5명의 전문 에이전트(`.claude/agents/`)가 정의되어 있다:
- **`pm`** (Opus) — 총괄 orchestrator, 미션 분석·worker 분배
- **`qa`** (Sonnet) — 산식·엣지·회귀 진단 + 자동화 검사 설계
- **`compliance`** (Opus) — 노동·세·상법 해석 + Grey Zone 발굴
- **`brand`** (Sonnet) — UI/UX/콘텐츠 일관성 + 디자인 시스템
- **`devops`** (Sonnet) — rates.json·sitemap·GHA·hosting·Lighthouse 전담

호출: `@pm <미션>` 또는 `use the pm agent to ...`. PM이 board/current.md에 미션 정의 후 main Claude가 worker 순차 호출. **Sub-agent끼리 직접 통신 불가 — board.md가 유일한 협업 매개**.

## 프로젝트 개요

한국 노동법·세법 계산을 정부 공식 자료(국세청·고용노동부·국민건강보험공단·법제처) 기반으로 정확하게 제공하는 정적 사이트.
계산 결과뿐 아니라 적용 법령·실전 시나리오·자주 하는 실수까지 함께 설명한다.
검색 유입 → 도구 사용 + 가이드 글 열람 → 애드센스 수익화를 목표로 한다.

- **도메인**: https://calc-tools.kr
- **호스팅**: GitHub Pages (main 브랜치 push → 자동 배포)
- **리포**: https://github.com/hj5131mono/calc-tools (Public — 단, 사이트 상에서는 노출 안 함)
- **운영팀 연락**: ahnhj5131@gmail.com (영업일 3일 이내 응답)
- **컨셉**: 한국 노동법·세법 가이드 + 압도적으로 편한 계산 도구
- **차별화 핵심**: 핵심 8개 도구를 9섹션 구조(도구/해석/필요성/공식/시나리오/실수/FAQ/관련/출처)로 깊이 있게 + 가이드 블로그 30편(노동 12 + 세법 10 + 금융 8)
- **공개 정책**: 사이트의 about/contact/privacy/disclaimer 어디에도 GitHub 링크·운영 인원 규모·실명·사진을 노출하지 않는다. "calc-tools.kr 운영팀" 익명 표기 + 이메일 단일 채널만 사용.

## 기술 스택

- 순수 HTML + CSS + Vanilla JavaScript (프레임워크 없음)
- 빌드 과정 없음 (HTML 파일을 그대로 서빙)
- 서버 없음 (모든 계산은 클라이언트 JS로 처리)

## 개발 명령어

```bash
npx serve .          # 로컬 서버 실행
git push             # GitHub Pages 배포
```

> 테스트 프레임워크 없음. 브라우저에서 직접 확인.

## 핵심 규칙

### 계산 방식
- **핵심 8개 도구는 실시간 계산 필수** (사용성 차별화의 핵심) — 입력 즉시 결과 갱신
  - 핵심 도구: severance, weekly-holiday, annual-leave, ordinary-wage, salary, loan, compound, year-end-tax(신규)
- **보조 도구는 기존 규칙 유지** — 버튼 클릭으로만 작동, 실시간 자동계산 금지
  - 보조 도구: percent, vat, age, bmi, character-count, dday, averaging, return-rate, saju-pick
- 예외: 글자수 세기처럼 입력 자체가 결과인 도구는 실시간 OK
- 모든 계산기에 "초기화" 버튼은 유지 (핵심 도구도 포함)

### 코딩
- `const`/`let` 사용 (`var` 금지)
- 주석은 한국어로 작성
- 숫자 출력 시 천단위 콤마 적용
- 금액 입력 필드에 `inputmode="numeric"` + `data-amount-hint="원"` 필수

### 디자인 원칙
- 모바일 퍼스트 반응형 (트래픽 70%+ 모바일)
- CSS 변수 사용 필수 (하드코딩 금지) — 상세: `@docs/ARCHITECTURE.md`
- 한국어 전용

### SEO
- 모든 페이지에 고유 `<title>` + `<meta description>` + OG 태그
- `<link rel="canonical">` + FAQPage JSON-LD 스키마 필수
- `sitemap.xml`, `robots.txt` 루트 배치
- 내부 링크 최대한 연결 (관련 도구끼리)

### 광고
- **4차 신청 전까지 페이지당 광고 영역 1개로 축소** (3차 거절 후 가장 보수적)
- `<div class="ad-space">` + AdSense 코드 (`ca-pub-9632606296515258`)
- Auto Ads + 수동 광고 병행
- 승인 후에도 점진적으로만 복구 (도구당 최대 2개)

### 파일 구조
- 모든 HTML 파일은 독립적으로 동작
- `/assets/css/style.css` → 공통 스타일
- `/assets/js/common.js` → 공통 함수
- 각 도구 페이지는 카테고리 폴더 아래: `/stock/`, `/finance/`, `/lotto/`, `/daily/`, `/payroll/`

## 애드센스 현황

- **상태**: 3차 탈락 후 컨셉 전환 + 리브랜딩 진행 중 (2026-04-11~)
- **누적 탈락 사유**: 1·2·3차 모두 "가치가 별로 없는 콘텐츠 (Low Value Content)"
- **2차 후 대응(2026-03-28)**: about/contact 생성, FAQ 보강, JSON-LD, 광고 슬롯 축소 → 그래도 3차 거절
- **4차 통과 전략 (현재 진행)**:
  - 컨셉 전환: "계산기 모음" → "한국 노동법·세법 가이드 + 도구"
  - E-E-A-T 강화: 운영자 표기·검증 절차·갱신일·출처·SLA 명시
  - 핵심 8개 도구를 9섹션 깊이로 (페이지당 1500~2500단어)
  - 가이드 블로그 30편 작성 (노동 12 + 세법 10 + 금융 8)
  - UX 극대화: 실시간 계산 + 자동 해석 + 카톡 공유 카드
  - 광고 페이지당 1개로 축소
- **상세 플랜**: `C:/Users/ahnhj/.claude/plans/unified-dazzling-sparkle.md`
- 이전 핸드오버: `@docs/handover/2026-03-28.md`
