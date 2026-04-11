# 아키텍처 가이드 — calc-tools

> 참조: `@CLAUDE.md` (핵심 규칙), `@UX_GUIDE.md` (UX 패턴), `@docs/RATES_SYSTEM.md` (세율 시스템)

---

## 공유 레이어

- `assets/css/style.css` — 공통 스타일. CSS 변수로 색상 관리.
- `assets/js/common.js` — 공통 함수:
  - `formatNumber()`, `parseNumber()` — 천단위 콤마
  - `initAutoComma()` — `.auto-comma` input 자동 콤마
  - `showResult(id)` / `hideResult(id)` — 결과 박스 표시/숨김
  - `resetForm(formId)` — 폼 초기화
  - `initKeyboardShortcuts()` — Enter=계산, Esc=초기화, ↑↓=값 ±1
  - `initKeyboardHint()` — 단축키 안내 자동 삽입
  - `initLayout()` — 헤더/푸터 동적 삽입 (이미 존재하면 스킵)
  - `toKoreanAmount(value, unit)` — 한국어 단위(만/억) 변환
  - `initAmountHint()` — `data-amount-hint` 속성 실시간 표시
  - `loadRates()` — `assets/data/rates.json` 비동기 로드 (캐시 포함)
  - `applyRatesYear(rates)` — `[data-rates-year]` 요소에 기준 연도 표시
- `assets/data/rates.json` — 세율/요율 단일 진실 공급원. 상세: `@docs/RATES_SYSTEM.md`

## 디자인 토큰 (style.css :root)

CSS 변수 — 반드시 하드코딩 대신 변수 사용:
- `--type-display` ~ `--type-caption` — 타이포그래피 7단계
- `--gray-400` — disabled 텍스트
- `--focus-ring` = `0 0 0 3px rgba(49, 130, 246, 0.15)`
- 에러 상태: `input.input-error` + `.error-message` 클래스

## 현재 페이지 목록

| 카테고리 | 파일 | 도구 |
|----------|------|------|
| 루트 | `index.html` | 도구 모음 홈 (검색+탭 필터) |
| 루트 | `about.html` | 사이트 소개 |
| 루트 | `contact.html` | 문의하기 |
| 루트 | `privacy.html` | 개인정보처리방침 |
| finance | `compound.html` | 복리 계산기 |
| finance | `percent.html` | 퍼센트 계산기 |
| finance | `salary.html` | 연봉 실수령액 계산기 |
| finance | `loan.html` | 대출이자 계산기 |
| finance | `vat.html` | 부가세 계산기 |
| stock | `averaging.html` | 물타기 계산기 |
| stock | `return-rate.html` | 수익률 계산기 |
| lotto | `saju-pick.html` | 사주 행운번호 |
| daily | `character-count.html` | 글자수 세기 |
| daily | `dday.html` | D-day 계산기 |
| daily | `bmi.html` | BMI 계산기 |
| daily | `age.html` | 나이 계산기 |
| payroll | `weekly-holiday.html` | 주휴수당 계산기 |
| payroll | `severance.html` | 퇴직금 계산기 |
| payroll | `ordinary-wage.html` | 통상임금 시급 계산기 |
| payroll | `annual-leave.html` | 연차 계산기 |
| payroll | `year-end-tax.html` | 연말정산 환급 계산기 |
| 루트 | `disclaimer.html` | 면책 조항 |
| guide | `guide/index.html` | 가이드 허브 (노동법/세법/금융) |
| guide/labor | `severance-vs-pension.html` | 퇴직금 vs DB/DC |
| guide/labor | `weekly-holiday-mistakes.html` | 주휴수당 실수 5 |
| guide/labor | `annual-leave-2026.html` | 2026 연차 발생 기준 |
| guide/labor | `ordinary-wage-supreme-court.html` | 통상임금 대법원 판례 |
| guide/labor | `overtime-pay-guide.html` | 야간/연장/휴일 가산수당 |
| guide/labor | `unemployment-benefit-guide.html` | 실업급여 수급 조건과 금액 |
| guide/labor | `severance-interim-payment.html` | 퇴직금 중간정산 사유 |
| guide/labor | `4-insurance-part-time.html` | 4대보험 알바 적용 |
| guide/labor | `wage-arrears-report.html` | 임금체불 신고 절차 |
| guide/labor | `probation-wage.html` | 수습 급여 90% 감액 |
| guide/labor | `parental-leave-pay.html` | 육아휴직 급여 |
| guide/labor | `workers-compensation.html` | 산재보험 보험급여 |

## 페이지 구조

각 HTML 파일은 독립적으로 동작. 공통 레이어는 상대경로 참조:
- 루트 페이지: `assets/css/style.css`, `assets/js/common.js`
- 1단계 하위 폴더 (`finance/`, `payroll/` 등): `../assets/css/style.css`, `../assets/js/common.js`
- 2단계 하위 폴더 (`guide/labor/` 등): `../../assets/css/style.css`, `../../assets/js/common.js`

## 가이드 페이지 표준 (Phase C)

`/guide/<category>/<slug>.html` 형식. 도구 페이지와 다른 콘텐츠 중심 템플릿:

- 컨테이너 `max-width: 780px` (가독성 우선)
- 섹션 순서: article-hero (제목+법령 태그+갱신일+읽기 시간) → TL;DR 3줄 → article-body → related-tool 카드 → 출처 → 운영자 박스
- JSON-LD: `Article` (author = `Organization` "calc-tools.kr 운영팀")
- 본문 분량: 800~1500 단어
- 출처: 법제처(law.go.kr) 직링크 우선, 정부 부처/대법원 보조
- 광고 슬롯: 본문 끝 1개

## 날짜 입력 패턴

`<input type="date">` 대신 연/월/일 세 개의 `<select>` 사용:
```html
<div class="date-selects">
  <select id="targetYear" class="date-select"><option value="">연도</option></select>
  <select id="targetMonth" class="date-select"><option value="">월</option></select>
  <select id="targetDay" class="date-select"><option value="">일</option></select>
</div>
```
- 연도 선택 시 해당 월 일수 동적 업데이트: `new Date(year, month, 0).getDate()`
- 대상: `age.html`, `dday.html`, `saju-pick.html`, `severance.html`

## `<head>` 삽입 순서

1. `<meta charset>` + 네이버 인증 + OG 태그 + `<link rel="canonical">`
2. Pretendard 폰트 링크
3. 공통 CSS + 페이지별 `<style>`
4. AdSense 스크립트 (`ca-pub-9632606296515258`)
5. GA 스크립트 (`G-KLECX1HME8`)
6. FAQPage JSON-LD 스키마 (`</head>` 직전)

## 새 도구 페이지 추가 체크리스트

- [ ] 카테고리 폴더 아래 배치 (예: `/daily/new-tool.html`)
- [ ] 상대경로로 CSS, JS 연결
- [ ] `<head>` 순서 준수 + AdSense + GA
- [ ] 네이버 인증 메타태그 포함
- [ ] `<link rel="canonical">` 추가
- [ ] `og:url`, `og:image` 설정
- [ ] FAQPage JSON-LD 스키마 추가
- [ ] FAQ 섹션 5개 이상 포함
- [ ] 푸터 링크 4개 (홈/소개/문의/개인정보)
- [ ] `sitemap.xml`에 URL 추가
- [ ] `index.html` 도구 카드 추가
- [ ] 관련 기존 페이지의 "관련 도구" 섹션에 링크 추가
- [ ] 이 파일 페이지 목록 테이블 업데이트
