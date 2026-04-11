# calc-tools 에이전트 팀

> calc-tools.kr 프로젝트 한정 에이전트 팀. 4차 AdSense 통과 + 한국 노동법·세법·금융 가이드 + 도구의 산식 정확성·UX 일관성을 5명의 전문 에이전트가 분담.

## 운영 모델

```
사용자
  ↓
main Claude (super-orchestrator)
  ↓ @pm 호출 (계획·분석)
  ├─ PM이 docs/team/board/current.md 에 미션 정의·worker 분배
  ↓
main Claude가 PM 권고에 따라 worker 순차 호출
  ├─ @qa  (Sonnet)         → board 읽고 작업 → board에 결과 기록
  ├─ @compliance (Opus)    → board 읽고 작업 → board에 결과 기록
  ├─ @brand (Sonnet)       → board 읽고 작업 → board에 결과 기록
  └─ @devops (Sonnet)      → board 읽고 작업 → board에 결과 기록
  ↓
main Claude가 결과 종합 → 사용자에 보고
  ↓
PM이 archive/ 로 미션 이동
```

### 핵심 제약 (사용자가 알아야 함)
- Sub-agent끼리 직접 통신 불가 → board.md가 유일한 협업 매개
- Sub-agent는 또 다른 sub-agent 호출 못함 → main Claude가 모든 호출 매개
- 각 worker 호출은 fresh context — board.md를 매번 읽어야 직전 작업 회복
- 1 worker 순차 실행 (병렬 불가, 향후 Agent Teams 전환 시 가능)

## 5원칙

모든 에이전트는 작업 시작 시 [PRINCIPLES.md](./PRINCIPLES.md)를 반드시 참조한다.

| # | 원칙 | 핵심 |
|---|------|------|
| 1 | MD 기록 의무 | board/current.md + notes/<agent>.md를 통한 비동기 협업 |
| 2 | **Grey Zone 영리 활용** ⭐ | 단일 규정 아닌 상위·예외·교집합 규정으로 합법적 최대 효용 |
| 3 | 출처 1차 자료 우선 | 법제처·정책브리핑·해당 부처. 의심 후 1차 검증 필수 |
| 4 | 단일 진실 공급원 | 모든 수치는 rates.json. 코드 하드코딩 금지 |
| 5 | 비공개 검증 정책 | 사용자 1건 알려주면 패턴 전체 자가 발견 + 회귀 방지까지 |

## 5명 명단 (자세한 역할 → [ROSTER.md](./ROSTER.md))

| 에이전트 | 모델 | 역할 한 줄 |
|---------|------|----------|
| `pm` | opus | 총괄 orchestrator, 미션 분석·worker 분배·우선순위 |
| `qa` | sonnet | 산식·엣지·회귀 진단 패트롤, 자동화 검사 설계 |
| `compliance` | opus | 노동·세·상법 해석 + 산식 검증 + Grey Zone 발굴 |
| `brand` | sonnet | UI/UX/콘텐츠 일관성·디자인 시스템 |
| `devops` | sonnet | rates.json·sitemap·GHA·hosting·Lighthouse 데이터·배포 전담 |

## 호출 방법

### 자연어
```
use the pm agent to analyze and plan the next mission
```

### @-mention (권장)
```
@pm 옛 컨셉 잔재 회귀 방지 시스템을 board에 미션으로 정의해줘
@qa current.md 미션 받아서 회귀 방지 lint 설계해줘
@devops board에 정의된 hardcoded 헤더 13개 본질 정리 작업 시작해줘
```

### 1회성 위임 (간단)
```
use the compliance agent to verify the year-end-tax 산식
```

## 디렉토리

```
calc-tools/
├── .claude/agents/         # 에이전트 정의 (gitcheckin)
│   ├── pm.md
│   ├── qa.md
│   ├── compliance.md
│   ├── brand.md
│   └── devops.md
└── docs/team/
    ├── README.md           # 본 문서
    ├── PRINCIPLES.md       # 5원칙 헌법
    ├── ROSTER.md           # 5명 상세 + 역학관계
    ├── board/
    │   ├── current.md      # 진행 중 미션
    │   ├── backlog.md      # 백로그
    │   └── archive/        # 완료 아카이브
    ├── notes/
    │   ├── pm.md
    │   ├── qa.md
    │   ├── compliance.md
    │   ├── brand.md
    │   └── devops.md
    └── handovers/          # 인계 노트 (필요 시)
```

## 1단계 → 2단계 마이그레이션

현재 1단계: **Sub-agent + MD board** (안정·검증)

1~2주 운영 후 검증 통과 시 2단계 검토:
- **Agent Teams 실험 모드** (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`)
- teammates 간 직접 메시지 + 병렬 실행 가능
- 같은 5명 정의 그대로 활용 가능 (frontmatter 호환)
- 검토 시 PM이 마이그레이션 plan 작성

## 첫 미션 (셋업 직후)

→ [board/current.md](./board/current.md) 참조
