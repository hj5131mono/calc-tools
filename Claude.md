# 프로젝트: calc-tools (자동사냥 유틸리티 사이트)

## 프로젝트 목적
검색 유입 → 도구 사용 → 애드센스 광고 수익을 자동으로 발생시키는 정적 유틸리티 사이트.
배포 후 유지보수 0을 목표로 한다.

## 기술 스택
- 순수 HTML + CSS + Vanilla JavaScript (프레임워크 없음)
- 빌드 과정 없음 (HTML 파일을 그대로 서빙)
- 서버 없음 (모든 계산은 클라이언트 JS로 처리)
- 호스팅: GitHub Pages 또는 Cloudflare Pages (무료)

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