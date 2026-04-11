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
