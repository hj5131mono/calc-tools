# Brand 누적 노트

> Brand가 디자인 토큰·톤·voice·검수 결정을 누적하는 노트.

## 디자인 토큰 (CSS 변수)

### 색상 (assets/css/style.css :root)
- `--primary` — 파란 계열 (신뢰·전문성)
- `--text` / `--text-light` — 본문 / 보조
- `--gray-50/100/200/.../900` — 그레이 스케일
- `--success-50/500/600` — 환급·정답
- `--danger-500` — 미달·경고
- `--white` — 카드 배경
- `--border` — 구분선

### 타이포 (8단계)
- `--type-display` — 헤로 메시지
- `--type-title-lg/md/sm` — 섹션 헤더
- `--type-body-sm` — 본문
- `--type-caption` — 캡션·메타

### 간격·반경
- 8px 그리드 시스템
- `--radius-sm/md/lg` — 4 / 8 / 16

## 톤·voice 가이드

### 기본 톤
- 신뢰 + 직관 + 친근
- 존댓말 + 사용자 입장 ("당신의 환급액은...")

### 금지 표현
- AI 패턴 ("결론적으로", "마지막으로", 불릿 남발)
- 광고 톤 ("최고의", "유일한")
- 모호한 면피 ("일반적으로 알려져 있습니다")
- 옛 컨셉 카피 ("16개의 무료 계산기", "계산기 도구 모음")

### 권장 패턴
- TL;DR 3줄 (본문 진입 전)
- 사례 박스 (구체 페르소나 + 수치)
- 표 (비교·시나리오)
- 출처 + 갱신일 (가이드 글 말미)
- 관련 도구 카드 (내부 링크)
- 운영자 박스 (가이드 글 말미: 마지막 갱신·다음 검토·이메일)

## 의사결정 이력

### 2026-04-12 — 컨셉 전환 헤더 통일
- 옛 카테고리 5개 (홈/금융투자/노무급여/로또운세/일상 유틸리티) 폐기
- 새 헤더: 홈 / 핵심 도구(#core) / 가이드 / 소개 / 문의
- site-logo "계산기 도구 모음" → "calc-tools.kr"
- 푸터에 "가이드" + "면책 조항" 링크 추가

### 2026-04-12 — 본인 포함 라벨 통일
- salary ↔ year-end-tax 부양가족 라벨 정반대 → 둘 다 "본인 제외, 본인 자동 포함"
- 사용자가 두 도구 비교 시 결과 차이 발생 방지

## 가이드 글 표준 (Phase C — 노동법 12편 표준)

### 컨테이너
- max-width: 780px (가독성 우선, 도구 800px과 약간 좁음)

### 섹션 순서
1. article-hero (h1 + 법령 태그 + 갱신일 + 읽기 시간)
2. TL;DR 3줄 (primary-50 박스)
3. article-body (h2 큰 단원, h3 소단원, p line-height 1.85)
4. 사례 박스 또는 비교 표
5. related-tool 카드 1개 (내부 도구 직링크)
6. 출처 (법제처 우선, 부처 보조)
7. 운영자 박스 (gray-50 + white inner card)

### JSON-LD
- Article (author = Organization "calc-tools.kr 운영팀")
- 메타: keywords, og:type, og:title, og:description, og:url, og:image, canonical

## E-E-A-T 페이지 표준 (2026-04-12 확정)

### about.html
- h1 바로 아래 컨셉 태그라인: `<p style="font-size: 1.05rem; color: var(--primary); font-weight: 600;">한국 노동법·세법 가이드 + 계산 도구</p>`
- 운영 정보 섹션: .operator-box (border-left: 4px solid var(--primary))
- 필수 항목: 운영 주체 / 연락처 / 응답 SLA / 운영 시작
- JSON-LD @type Organization: name/url/email/description/foundingDate

### contact.html
- SLA 배너: .sla-banner (border-left: 4px solid var(--primary), background: var(--primary-50))
- 채널 카드: .channel-card (background: var(--gray-50))

### privacy.html
- OG 태그 필수: og:type/og:title/og:description/og:url/og:image (2026-04-12 추가)
- keywords 태그 필수 (2026-04-12 추가)
- 응답 SLA: 섹션 8번에 명시

### disclaimer.html
- 갱신일: 페이지 상단 h1 바로 아래
- 말미: "calc-tools.kr 운영팀에 의해 작성·관리"

## og-image.svg 표준 (2026-04-12 교체)

- 메인 텍스트: "한국 노동법·세법 가이드" (font-size 64, white)
- 서브 텍스트: "정부 공식 자료 기반 계산 도구" (font-size 38, white, opacity 0.85)
- 도메인: "calc-tools.kr" (font-size 30, white, opacity 0.65)
- 배경: #2563eb (--primary 계열)

## 연도 표기 규칙 (2026-04-12 확정)

- 도구 title/og:title의 연도: 현행 연도(2026) 기준
- 가이드 title의 연도: 다음과 같이 구분
  - 연말정산처럼 귀속 연도와 신청 연도가 다른 경우: "2026년 연말정산 (2025년 귀속)"처럼 양쪽 명시 — 유지
  - 일반 가이드: 최신 연도(2026) 기준
- keywords에 연도 포함 시 현행 기준 연도 사용

## 갱신 이력
- 2026-04-12: 초기 골격
- 2026-04-12: AdSense 4차 Brand 워크 — 연도 잔재 4파일 수정, og-image.svg 교체, privacy.html OG 태그 보완, about.html 컨셉 태그라인 추가, E-E-A-T 페이지 표준 문서화
