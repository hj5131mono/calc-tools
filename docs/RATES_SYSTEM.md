# 세율/요율 자동 업데이트 시스템

> 참조: `@CLAUDE.md` (프로젝트 개요), `@docs/ARCHITECTURE.md` (공유 레이어), `@docs/RATES_MANUAL.md` (수동 업데이트 절차)

---

## 시스템 개요

```
[정부 공공 API / 공시 파일]
         ↓  GitHub Actions (자동, 분기별 실행)
[assets/data/rates.json]  ← 단일 진실 공급원 (Single Source of Truth)
         ↓  fetch() at runtime
[각 계산기 페이지]  →  "2025년 기준" 자동 표시
```

**핵심 원칙:**
- `assets/data/rates.json` 하나만 수정하면 전 페이지 즉시 반영
- GitHub Actions 분기별 자동 수집 → 변경 시 자동 커밋 → GitHub Pages 자동 배포
- 자동 수집 실패 시 → GitHub Issue 자동 생성 → 수동 대응: `@docs/RATES_MANUAL.md`

## 파일 구조

```
calc-tools/
├── assets/data/
│   └── rates.json                  ← ★ 핵심. 모든 계산기가 이 파일을 읽음
├── scripts/
│   ├── package.json                ← Node.js 의존성
│   └── update-rates.js             ← 자동 수집 스크립트
└── .github/workflows/
    └── update-rates.yml            ← GitHub Actions 워크플로우
```

## rates.json 구조

```json
{
  "_meta":       { "year": 2025, "updated": "2025-01-01", "updatedBy": "github-actions" },
  "minimumWage": { ... },   // 최저임금
  "insurance":   { ... },   // 4대보험 요율
  "incomeTax":   { ... },   // 소득세 세율 구간
  "laborLaw":    { ... }    // 연차/퇴직금 법령 상수
}
```

## 자동화 범위 및 데이터 소스

| 항목 | 자동화 방법 | 변경 빈도 | 공식 출처 |
|------|-----------|---------|---------|
| 최저임금 | 공공데이터포털 API | 매년 1월 | moel.go.kr |
| 국민연금 상·하한 | GitHub Issue 알림 | 매년 7월 | nps.or.kr |
| 건강보험료율 | GitHub Issue 알림 | 매년 1월 | nhis.or.kr |
| 장기요양보험료율 | GitHub Issue 알림 | 매년 1월 | nhis.or.kr |
| 고용보험료율 | GitHub Issue 알림 | 부정기 | moel.go.kr |
| 소득세 세율 구간 | GitHub Issue 알림 | 부정기 | nts.go.kr |
| 연차/퇴직금 공식 | 법 개정 감지 | 부정기 | law.go.kr |

**완전 자동**: 최저임금 (공공 API 존재)
**알림 후 수동 확인**: 나머지 항목

## GitHub Actions 실행 일정

| 실행 시점 | 이유 |
|----------|------|
| 매년 1월 2일 | 최저임금·건강보험·고용보험 신규 요율 |
| 매년 7월 2일 | 국민연금 기준소득월액 상·하한 변경 |
| 매 분기 1일 (1,4,7,10월) | 중간 법령 개정 대응 |
| 수동 실행 | 긴급 업데이트 시 |

## 초기 설정 (최초 1회)

### 공공데이터포털 API 키 발급
1. https://www.data.go.kr → 로그인
2. 마이페이지 → 인증키 신청/관리
3. `고용노동부_최저임금 현황` 활용신청 → 승인 후 인증키 복사

### GitHub Secrets 등록
Settings → Secrets → Actions → `DATA_GO_KR_API_KEY` 등록

### GitHub Actions 권한
Settings → Actions → General → **"Read and write permissions"** 선택

## 페이지 표시 방식

```html
<span data-rates-year>2025년 기준</span>
```
`loadRates()` 후 `applyRatesYear(rates)`가 자동 업데이트.

## 오류 대응 흐름

```
GitHub Actions 실행
    ├─ 성공 → rates.json 업데이트 → 자동 커밋/배포
    └─ 실패 → GitHub Issue 자동 생성 → 수동 대응 (@docs/RATES_MANUAL.md)
```

**최악의 경우 (rates.json 로드 실패):**
→ `common.js` 내 `FALLBACK_RATES` 하드코딩 값으로 동작
→ "⚠ 최신 요율을 불러오지 못했습니다" 경고 표시
