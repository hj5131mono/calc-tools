# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 프로젝트: calc-tools (자동사냥 유틸리티 사이트)

## 개발 명령어

로컬 서버 실행 (빌드 없음, 파일을 그대로 서빙):
```bash
npx serve .
# 또는
python -m http.server 8000
```

배포 (GitHub Pages 자동 배포):
```bash
git add .
git commit -m "변경 내용"
git push
```

> 테스트 프레임워크 없음. 브라우저에서 직접 확인.

---

## 아키텍처

### 공유 레이어
- `assets/css/style.css` — 모든 페이지가 참조하는 공통 스타일. CSS 변수(`--primary`, `--bg`, `--text`, `--border`)로 색상 관리.
- `assets/js/common.js` — 아래 공통 기능 포함:
  - `formatNumber()`, `parseNumber()` — 천단위 콤마 포맷
  - `initAutoComma()` — `.auto-comma` 클래스 input에 자동 콤마
  - `showResult(id)` / `hideResult(id)` — 결과 박스 표시/숨김
  - `resetForm(formId)` — 폼 초기화 (입력값 클리어 + 결과 숨김)
  - `initKeyboardShortcuts()` — Enter=계산, Esc=초기화, ↑↓=값 ±1
  - `initKeyboardHint()` — 폼이 있는 페이지에 단축키 안내 텍스트 자동 삽입
  - `initLayout()` — 헤더/푸터 동적 삽입 (이미 존재하면 스킵)
  - `toKoreanAmount(value, unit)` — 숫자를 한국어 단위(만/억)로 변환
  - `initAmountHint()` — `data-amount-hint` 속성 필드에 입력 중 한국어 단위 실시간 표시
  - `loadRates()` — `assets/data/rates.json`에서 최신 세율/요율 비동기 로드 (캐시 포함)
  - `applyRatesYear(rates)` — 로드된 rates 기준 연도를 `[data-rates-year]` 요소에 표시
- `assets/data/rates.json` — 세율/요율 단일 진실 공급원. 수치 변경 시 이 파일만 수정하면 전 페이지 즉시 반영. GitHub Actions로 분기별 자동 업데이트. (상세: `RATES_UPDATE_MANUAL.md`)

### 현재 구현된 페이지 목록
| 카테고리 | 파일 | 도구 |
|----------|------|------|
| 루트 | `index.html` | 도구 모음 홈 (검색+탭 필터 포함) |
| 루트 | `privacy.html` | 개인정보처리방침 |
| 루트 | `googleb2a5ced0d3571b8d.html` | Google Search Console 인증 파일 (건드리지 말 것) |
| finance | `compound.html` | 복리 계산기 |
| finance | `percent.html` | 퍼센트 계산기 |
| finance | `salary.html` | 연봉 실수령액 계산기 (구간비교 포함) |
| finance | `loan.html` | 대출이자 계산기 (3방식·월별 스케줄) |
| finance | `vat.html` | 부가세 계산기 (역산·클립보드 복사) |
| stock | `averaging.html` | 물타기(평균단가) 계산기 |
| stock | `return-rate.html` | 수익률 계산기 |
| lotto | `saju-pick.html` | 사주 행운번호 (오늘의 운세 포함, Web Share API 공유) |
| daily | `character-count.html` | 글자수 세기 (입력 즉시 카운트 — 입력 자체가 결과인 도구) |
| daily | `dday.html` | D-day 계산기 |
| daily | `bmi.html` | BMI 계산기 |
| daily | `age.html` | 나이 계산기 (만나이·띠·별자리) |
| payroll | `weekly-holiday.html` | 주휴수당 계산기 |
| payroll | `severance.html` | 퇴직금 계산기 |
| payroll | `ordinary-wage.html` | 통상임금 시급 계산기 |
| payroll | `annual-leave.html` | 연차 계산기 |

### UX 가이드
`UX_GUIDE.md` 참조. 핵심 요약:
- 금액 입력 필드에 `data-amount-hint="원"` 또는 `data-amount-hint="만원"` 속성 추가 시 입력 중 한국어 단위 실시간 표시 (예: `3억원`)
- 금액 입력 필드에 `inputmode="numeric"` 필수 (모바일 숫자 키패드)
- `toKoreanAmount(value, unit)` 함수는 `common.js`에 위치

### 디자인 토큰 (style.css :root)
새 CSS 변수 목록 — 반드시 하드코딩 대신 변수 사용:
- `--type-display` ~ `--type-caption` — 타이포그래피 7단계
- `--gray-400` — disabled 텍스트
- `--focus-ring` — 포커스 링 (모든 input/select/button에 통일)
- `--focus-ring` = `0 0 0 3px rgba(49, 130, 246, 0.15)`
- 에러 상태: `input.input-error` + `.error-message` 클래스 사용

### 계산 방식 원칙
**계산은 반드시 버튼 클릭으로만 작동한다.** `input` 이벤트로 실시간 자동계산을 하지 않는다.
- 이유: 입력 중간에 나오는 결과가 사용자에게 혼란을 줌 (예: 1000을 입력하는 중에 "1"의 결과가 표시)
- 예외: 글자수 세기(`character-count.html`)처럼 입력 자체가 결과인 도구는 실시간 OK
- 모든 계산기 페이지에는 "계산하기"와 "초기화" 버튼 모두 제공

### 날짜 입력 패턴
`<input type="date">` 대신 연/월/일 세 개의 `<select>`를 사용한다 (네이버/구글 스타일, 모바일 UX 일관성):
```html
<div class="date-selects">
  <select id="targetYear" class="date-select"><option value="">연도</option></select>
  <select id="targetMonth" class="date-select"><option value="">월</option></select>
  <select id="targetDay" class="date-select"><option value="">일</option></select>
</div>
```
- 공통 CSS: `.date-selects { display: flex; gap: 8px; }` / `.date-select { flex: 1; ... }`
- 연도 선택 시 해당 월의 일수를 동적으로 업데이트: `new Date(year, month, 0).getDate()`
- 대상 파일: `age.html`, `dday.html`, `saju-pick.html`

### 페이지 구조
각 HTML 파일은 완전히 독립적으로 동작한다. 공통 레이어는 상대경로로 참조:
- 루트 페이지(`index.html`, `privacy.html`): `assets/css/style.css`
- 하위 폴더 페이지(`stock/`, `finance/`, `lotto/`, `daily/`): `../assets/css/style.css`

### `<head>` 삽입 순서 (모든 페이지 공통)
1. `<meta charset>` + 네이버 인증 태그 + OG 태그
2. Pretendard 폰트 링크
3. 공통 CSS 링크 + 페이지별 인라인 `<style>`
4. Google AdSense 스크립트 (`ca-pub-9632606296515258`)
5. Google Analytics 스크립트 (`G-KLECX1HME8`)

### 새 도구 페이지 추가 시 체크리스트
- 카테고리 폴더 아래 배치 (예: `/daily/new-tool.html`)
- 상대경로로 `../assets/css/style.css`, `../assets/js/common.js` 연결
- `<head>` 순서 준수, AdSense + GA 코드 `</head>` 직전에 삽입
- 네이버 인증 메타태그 (`content="d95c4f7f81f57747f5d0f22ddfbcde67bc85b285"`) 포함
- `og:url` = `https://calc-tools.kr/경로/파일.html`, `og:image` = `/assets/og-image.svg`
- `sitemap.xml`에 URL 추가
- `index.html` 도구 카드 추가 (disabled → 활성 링크)
- 관련 기존 페이지의 "관련 도구" 섹션에도 새 페이지 링크 추가

---

## 프로젝트 목적
검색 유입 → 도구 사용 → 애드센스 광고 수익을 자동으로 발생시키는 정적 유틸리티 사이트.
배포 후 유지보수 0을 목표로 한다.

## 기술 스택
- 순수 HTML + CSS + Vanilla JavaScript (프레임워크 없음)
- 빌드 과정 없음 (HTML 파일을 그대로 서빙)
- 서버 없음 (모든 계산은 클라이언트 JS로 처리)
- 호스팅: GitHub Pages (calc-tools.kr)

## 디자인 원칙
- 모바일 퍼스트 반응형 디자인 (트래픽의 70%+ 가 모바일)
- 깔끔하고 신뢰감 있는 UI (광고 클릭률에 직접 영향)
- 계산 결과 영역 위/아래에 광고 영역 확보 (div class="ad-space")
- 페이지 로딩 속도 최우선 (Core Web Vitals 통과)
- 한국어 전용 사이트

## 파일 구조 규칙
- 모든 HTML 파일은 독립적으로 동작 (공통 CSS/JS는 인라인 또는 공유 파일)
- /assets/css/style.css → 공통 스타일시트
- /assets/js/common.js → 공통 함수 (숫자 포맷, 내비게이션 등)
- 각 도구 페이지는 카테고리 폴더 아래에 위치
- 예: /stock/averaging.html, /finance/loan.html

## SEO 규칙
- 모든 페이지에 고유한 <title>과 <meta name="description"> 필수
- Open Graph 태그 포함
- 한국어 lang="ko" 설정
- sitemap.xml과 robots.txt 루트에 배치
- 내부 링크를 가능한 많이 연결 (관련 도구끼리)

## 광고 영역 규칙
- 각 페이지 계산 결과 위/아래에 아래 마크업 삽입 (이미 전 페이지 삽입 완료):
```html
<div class="ad-space" style="min-height:90px; text-align:center; margin:20px 0;">
  <ins class="adsbygoogle"
    style="display:block"
    data-ad-client="ca-pub-9632606296515258"
    data-ad-slot="1446574188"
    data-ad-format="auto"
    data-full-width-responsive="true"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</div>
```
- 페이지당 광고 영역 2~3개 (트래픽 높은 7개 페이지는 3개)
- Auto Ads + 수동 광고 단위 병행 운영 중

## 코딩 규칙
- const/let 사용 (var 금지)
- 주석은 한국어로 작성
- 숫자 출력 시 천단위 콤마 적용 (toLocaleString 사용)
- input에 적절한 placeholder와 label 제공
- 계산 버튼과 초기화 버튼 모두 제공