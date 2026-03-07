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
- `assets/js/common.js` — `formatNumber()`, `parseNumber()`, 자동 콤마 포맷팅, 공통 네비게이션 동적 삽입 함수 포함.

### 페이지 구조
각 HTML 파일은 완전히 독립적으로 동작한다. 공통 레이어는 상대경로로 참조:
- 루트 페이지(`index.html`, `privacy.html`): `assets/css/style.css`
- 하위 폴더 페이지(`stock/`, `finance/`, `lotto/`, `daily/`): `../assets/css/style.css`

### `<head>` 삽입 순서 (모든 페이지 공통)
1. 메타태그 + OG 태그
2. 공통 CSS 링크
3. 페이지별 인라인 `<style>`
4. Google AdSense 스크립트 (`ca-pub-9632606296515258`)
5. Google Analytics 스크립트 (`G-KLECX1HME8`)

### 새 도구 페이지 추가 시 체크리스트
- 카테고리 폴더 아래 배치 (예: `/daily/new-tool.html`)
- 상대경로로 `../assets/css/style.css`, `../assets/js/common.js` 연결
- AdSense + GA 코드 `</head>` 직전에 삽입 (위 순서 준수)
- `sitemap.xml`에 URL 추가
- `index.html` 도구 카드 목록 업데이트

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
- 각 페이지 계산 결과 위/아래에 아래 마크업 삽입:
  <div class="ad-space" style="min-height:90px; text-align:center; margin:20px 0;">
    <!-- AdSense 광고 자리 -->
  </div>
- 페이지당 광고 영역 2~3개
- 실제 애드센스 코드는 나중에 승인 후 삽입

## 코딩 규칙
- const/let 사용 (var 금지)
- 주석은 한국어로 작성
- 숫자 출력 시 천단위 콤마 적용 (toLocaleString 사용)
- input에 적절한 placeholder와 label 제공
- 계산 버튼과 초기화 버튼 모두 제공