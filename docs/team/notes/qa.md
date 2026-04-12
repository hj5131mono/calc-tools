# QA 누적 노트

> QA가 매 진단에서 발견한 회귀 케이스·자동화 검사·시나리오를 누적하는 노트.
> 같은 패턴 재발견 방지의 핵심 — 호출 시 반드시 본 파일을 먼저 읽는다.

## 회귀 검사 패턴 (자동화에 적용)

### 옛 컨셉 잔재 검사 (본 세션에서 발견)
```bash
# 옛 최저임금
git ls-files | xargs grep -l "10,030\|10030\|9,860\|9860" | grep -v docs/handover

# 옛 카피
git ls-files | xargs grep -l "16개의\|계산기 도구 모음" | grep -v docs/team

# 옛 카테고리
git ls-files | xargs grep -l "금융/투자\|로또/운세\|일상 유틸리티" | grep -v docs

# 옛 연도/data-rates-year fallback
git ls-files | xargs grep -l "2025년 최저\|data-rates-year>2025\|2024-58호"

# 옛 보험료율
git ls-files | xargs grep -l "4.5%.*국민연금\|7.09%\|3.545%"
```

## 회귀 케이스 라이브러리

### #1. 도구 페이지 hardcoded 헤더 (2026-04-12 발견)
- **증상**: 도구 페이지 13개의 hardcoded 헤더가 옛 카테고리 5개
- **위치**: finance/*, daily/*, stock/*, lotto/*, privacy.html
- **수정**: common.js initLayout() 강제 교체 + (다음 미션) hardcoded 본질 제거
- **자동화**: 위 grep 패턴 추가
- **재발 방지**: pre-commit hook 또는 GHA check

### #2. rates.json minimumWage 부패 (2026-04-12 발견)
- **증상**: `_meta.year=2026`이지만 minimumWage.year=2025
- **위치**: assets/data/rates.json
- **수정**: 2026 10,320원으로 갱신
- **자동화**: 분기 패트롤 (DevOps)
- **재발 방지**: rates.json 분기 검증 GHA

### #3. salary.html 부양가족 라벨 정반대 (2026-04-12 발견)
- **증상**: salary "본인 포함" vs year-end-tax "본인 제외" 정반대
- **수정**: 두 도구 모두 "본인 제외, 본인 자동 포함"으로 통일
- **재발 방지**: 라벨 일관성 검사 (수동 — 자동화 어려움)

### #4. year-end-tax.html이 rates.json 미사용 (2026-04-12 발견)
- **증상**: 자체 하드코딩, rates 갱신해도 도구 미반영
- **수정**: rates.incomeTax 배열 기반으로 리팩토링
- **자동화**: 코드 grep — 하드코딩 숫자 detection 어려움
- **재발 방지**: 신규 도구 작성 시 코드리뷰 체크리스트

## 시나리오 검증 표준

| 도구 | 시나리오 | 기대 결과 |
|------|---------|---------|
| severance | 평균임금 350만 × 5년 | 약 1,750만 (노동OK 비교) |
| weekly-holiday | 시급 12,000 × 주 40h | 96,000원 |
| annual-leave | 입사 1.5년 후 | 15일 |
| ordinary-wage | 기본급 250만 + 수당 50만 / 주 40h | 시급 약 14,354 (300만/209) |
| salary | 연봉 5000만 / 부양 0 / 자녀 0 | 노동OK 비교 ±1만원 |
| year-end-tax | 5000만 / 부양 0 / 자녀 0 / 신용 1,500만 / 의료 100만 | 국세청 모의계산기 비교 |
| loan | 1억 / 5% / 30년 / 원리금균등 | 약 536,822원/월 |
| compound | 1000만 / 월 0 / 5% / 10년 | 약 1,647만 |

## 갱신 이력
- 2026-04-12: 초기 골격 + 본 세션 회귀 케이스 4건 + 시나리오 표

## 회귀 케이스 #5 (2026-04-12)
- **증상**: sitemap.xml에 신규 가이드 8편(세법5+금융3) URL 미등록
- **위치**: sitemap.xml (기존 35개, 누락 8개)
- **원인**: Compliance가 가이드 파일 생성 후 DevOps/QA에 sitemap 추가 인계 남겼으나 반영 전 QA 호출
- **수정**: QA가 직접 43개로 확장 (lastmod=2026-04-12, changefreq=monthly, priority=0.7)
- **자동화 검사**: `grep -c '<loc>' sitemap.xml` → 기준치 이상인지 확인. 가이드 추가 시 checklist 항목으로 추가.
- **다음 점검 시 우선 확인**: 예 — 가이드 추가 후 sitemap 등록이 자동화 안 되어 있어 재발 가능

## 회귀 케이스 #6 (2026-04-12)
- **증상**: check-stale.sh의 1차 출처 검출 패턴이 fsc.go.kr(금융위), korea.kr(정책브리핑)을 미인식 — dsr-ltv-guide.html 오탐
- **위치**: scripts/check-stale.sh (1차 출처 검사는 현재 미구현 — QA 수동 검증)
- **원인**: 1차 출처 도메인 목록에 fsc.go.kr, korea.kr, moef.go.kr 미포함
- **수정**: 수동 확인으로 실제 출처 3개 확인(korea.kr+hf.go.kr+fsc.go.kr) — 통과
- **자동화 검사**: 향후 check-stale.sh에 1차 출처 검사 항목 추가 시 `fsc.go.kr|korea.kr|moef.go.kr` 패턴 포함 필요
- **다음 점검 시 우선 확인**: 예

## 신규 스크립트 (2026-04-12)
- **scripts/word-count.sh**: 핵심 도구 8개 + 가이드 20편 단어 수 자동 측정
  - 기준: 핵심 도구 1,800+ / 가이드 800+
  - 실행: `bash scripts/word-count.sh`
  - 2026-04-12 결과: 28개 전부 통과 (최저 weekly-holiday 1,843)

## 산식 검증 기준치 (2026-04-12 확정)
| 도구 | 핵심 산식 | 검증 완료 |
|---|---|---|
| severance | effectiveDaily × 30 × (serviceDays/365), max(평균, 통상) | OK |
| weekly-holiday | (hours/40) × 8 × hourly | OK |
| annual-leave | min(15 + floor((y-1)/2), 25) | OK |
| ordinary-wage | monthlyOrdinary / (주간시간+주휴)×365/7/12 | OK |
| salary | rates.json 참조, floor10/floor1 적용 | OK |
| loan | PMT = P×r×(1+r)^n/((1+r)^n-1) | OK |
| compound | P(1+r)^n + PMT×((1+r)^n-1)/r | OK |
| year-end-tax | 총급여→공제→과표→세율→세액공제, rates.json 참조 | OK |

## 갱신 이력
- 2026-04-12 세션2: AdSense 4차 QA 워크 완료 (#5, #6 케이스, word-count.sh, 산식 기준치 추가)
