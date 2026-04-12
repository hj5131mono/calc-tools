# DevOps 누적 노트

> DevOps가 rates 갱신·인프라 결정·GHA 운영을 누적하는 노트.
> 호출 시 분기 패트롤 시작 전 본 파일을 먼저 읽는다.

## rates.json 갱신 이력

### 2026-04-12 (본 세션)
- minimumWage 2025년 10,030원 → 2026년 10,320원 갱신
- monthly 2,096,270 → 2,156,880 (209h)
- effectiveFrom 2025-01-01 → 2026-01-01
- incomeTax.year 2025 → 2026
- incomeTax.personalDeduction 1,500,000 신규 키 추가
- 1차 출처 검증: 보건복지부 건정심 2025-08-28 결정 (건강보험 7.19% 인상 확정)

## 2026 핵심 수치 (참조)

| 항목 | 2025 | 2026 | 변경 |
|------|------|------|------|
| 최저시급 | 10,030 | 10,320 | +290 (2.9%) |
| 최저월급 (209h) | 2,096,270 | 2,156,880 | +60,610 |
| 국민연금 (총) | 9% | 9.5% | +0.5%p (8년 단계 인상) |
| 국민연금 (근로자) | 4.5% | 4.75% | |
| 건강보험 (총) | 7.09% | 7.19% | +0.10%p |
| 건강보험 (근로자) | 약 3.545% | 약 3.595% | |
| 장기요양 | 건보 12.95% | 동일 | |
| 고용보험 (근로자) | 0.9% | 0.9% | 동결 |
| 산재 (근로자) | 0% | 0% | 사업주 100% |
| 부양가족 기본공제 | 150만 | 150만 | 동결 |
| 자녀세액공제 1명 | 15만 | 15만 | 동결 |
| 자녀세액공제 2명 | 35만 | 35만 | 동결 |
| 자녀세액공제 추가 | +30만 | +30만 | 동결 |

## 분기 패트롤 체크리스트

### 매 분기 첫 주
- [ ] rates.json `_meta.year` vs 실제 연도
- [ ] minimumWage.year vs `_meta.year` 일치
- [ ] insurance.effectiveYear 일치
- [ ] incomeTax.year 일치
- [ ] 1차 출처 변경 확인:
  - 보건복지부 건정심 결정 (건보료율)
  - 국민연금공단 기준소득월액 (매년 7월)
  - 최저임금위원회 고시
  - 국세청 간이세액표
- [ ] sitemap.xml lastmod 갱신 필요한가
- [ ] robots.txt 옛 카피 잔존 여부
- [ ] GHA 워크플로우 (rates 자동 갱신) 마지막 실행 성공
- [ ] Lighthouse 모바일 점수 (Performance/Accessibility/SEO/Best)
- [ ] Google Search Console 색인율

### 즉시 영향 항목
- 최저임금 변경 → 도구 8개 + 가이드 12편 모두 영향
- 4대보험료율 변경 → salary, year-end-tax 직접 영향
- 소득세 구간 변경 → year-end-tax 직접 영향
- 노동법 시행령 변경 → 가이드 글 영향

## sitemap.xml 우선순위 표준

| 페이지 유형 | priority | changefreq |
|-----------|---------|-----------|
| 메인 (index.html) | 1.0 | weekly |
| 핵심 도구 (Tier 1) | 0.9 | monthly |
| 가이드 허브 | 0.9 | weekly |
| 가이드 글 | 0.8 | monthly |
| 신뢰 페이지 (about/contact) | 0.6~0.7 | monthly |
| 정책 페이지 (privacy/disclaimer) | 0.5 | yearly |
| 보조 도구 (Tier 2) | 0.5 | monthly |

## 호스팅 의사결정 이력

### 현재
- **GitHub Pages** + 도메인 calc-tools.kr 연결
- 무료, 자동 배포 (push → 5분 내), 안정

### 검토 옵션
- **Cloudflare Pages**: CDN·SSL 강화, 익명성 더 좋음, 무료
- **Vercel**: Next.js 전환 시. 무료 tier 제한.

→ 4차 AdSense 신청 전 결정 권장 (현재 P2 백로그)

## GHA 워크플로우 인벤토리

### 현재 (확인 필요)
- `.github/workflows/update-rates.yml` (rates 자동 갱신, 분기?)
- 그 외 워크플로우는 분기 패트롤 시 점검

### 신규 후보
- 옛 컨셉 잔재 회귀 방지 check (QA가 설계, DevOps가 적용)
- Lighthouse CI (PR마다 점수 측정)

## GHA 워크플로우 현황 (2026-04-12 확인)

| 워크플로우 | 파일 | 트리거 | 상태 |
|-----------|------|-------|------|
| 세율/요율 자동 업데이트 | update-rates.yml | schedule(1/1, 7/1, 4/1, 10/1) + workflow_dispatch | 구조 정상 |
| Stale Concept Check | stale-check.yml | push/PR to main | 구조 정상 |

## 인프라·SEO 작업 이력

### 2026-04-12: AdSense 4차 사전 정비 (옵션 B)
- 수동 광고 블록 전면 제거: `<div class="ad-space">...</div>` 51개 / 34개 파일에서 제거
  - 핵심 도구 8개: 각 2블록 → 0
  - 보조 도구 9개: 각 2블록 → 0
  - 노동 가이드 12개: 각 1블록 → 0
  - 루트·신뢰 페이지 5개(index/about/contact/disclaimer + guide/index): 1블록 → 0
  - Auto Ads JS(`adsbygoogle.js`) 로딩은 각 파일 head에 유지
- CSS `.ad-space` 스타일 주석처리 (`assets/css/style.css` line 613-626)
- robots.txt `Disallow: /privacy.html` 제거 (sitemap.xml과 모순 해소)
- sitemap.xml 35개 URL 파일 존재 검증: 35/35 OK (missing 0)
- canonical 25개 페이지 절대경로 검증: 25/25 OK
- JSON-LD 21개 페이지 파싱 검증: 21/21 OK
- rates.json 2026 핵심 수치 12항목 교차 검증: 전부 일치

## 갱신 이력
- 2026-04-12: 초기 골격 + 2026 수치 표 + 분기 체크리스트
- 2026-04-12: AdSense 4차 사전 정비 작업 이력 추가 (광고 제거·robots·sitemap·canonical·JSON-LD·rates 검증)
