# 백로그 — 미래 미션 후보 (PM 관리)

> PM이 우선순위 평가 후 current.md로 승격. 완료 시 archive/로 이동.

## P0 (즉시·이번 주)

### 1. 옛 컨셉 잔재 회귀 방지 시스템 + 잔여 hardcoded 헤더 본질 정리 ⭐ (셋업 후 첫 미션 후보)
- **배경**: 본 세션에서 사용자가 직접 발견한 결정적 결함 — 도구 페이지 13개의 hardcoded 헤더가 옛 카테고리 5개 (홈/금융투자/노무급여/로또운세/일상 유틸리티). common.js initLayout() 강제 교체로 1차 해결됐지만 SEO·코드 일관성 측면에서 본질 정리 필요.
- **범위**:
  - 도구 페이지 13개 (`finance/loan, compound, salary, vat, percent` / `daily/age, dday, bmi, character-count` / `stock/return-rate, averaging` / `lotto/saju-pick` / `privacy.html`)의 hardcoded 헤더/푸터 제거
  - `robots.txt` 옛 카피 교체
  - `assets/og-image.svg` 새 디자인 (별도 작업)
  - 회귀 방지 자동화 검사 (pre-commit 또는 GHA)
- **분배 권고**: DevOps(주도) + QA(자동화 설계) + Brand(검수) + PM(종합)

## P1 (이번 달)

### 2. Phase C 세법 가이드 10편 작성
- **배경**: Phase C 12/30. 노동법 12/12 완료. 세법 0/10, 금융 0/8 잔여.
- **주제 후보**: 연말정산 변경점 / 카드공제 / 의료비 / 4대보험료율 / 근소세 / 종소세 / 부양공제 / 월세공제 / 청약통장 / ISA
- **분배**: PM(주제 우선순위) + Compliance(본문 + Grey Zone) + Brand(검수) + DevOps(sitemap)
- **세션 분할**: 한 세션 5~7편 권장 (세션 39 인사이트)

### 3. Phase C 금융 가이드 8편 작성
- **주제 후보**: 단리vs복리 / 대출방식 / 적금vs예금 / 중도상환 / DSR-LTV / 주담대 갈아타기 / 전세대출 / 펀드 수익률
- **분배**: PM + Compliance + Brand + DevOps
- **참고**: 법령 출처가 노동법보다 약함 — 금융감독원·한국은행 등 보조 출처 활용

### 4. og-image.svg 새 디자인
- **배경**: 현재 og-image.svg에 옛 카피 "계산기 도구 모음" 텍스트 hardcoded
- **분배**: Brand 단독

## P2 (분기 내)

### 5. 호스팅 결정
- **옵션**: GitHub Pages 유지 vs Cloudflare Pages 이전 vs Vercel
- **고려 사항**: SEO·익명성·속도·비용
- **분배**: PM + DevOps

### 6. Phase D — 4차 AdSense 신청 전 종합 점검
- **체크리스트**: sitemap·robots·canonical / Lighthouse 모바일 90+ / GSC 색인율 100% / 광고 슬롯 검토 / 푸시 후 7일 경과
- **분배**: PM(주도) + DevOps + Compliance + Brand + QA 모두

### 7. Agent Teams 실험 모드 전환 검토
- **배경**: 1단계 sub-agent + MD board 1~2주 안정 운영 후
- **검토 항목**: 병렬 실행 효과·소통 오버헤드·비용 변화·안정성
- **분배**: PM + DevOps

## P3 (검토 단계)

### 8. PWA 도입
- manifest.json + service worker + "홈 화면에 추가"

### 9. 카카오톡 공유 카드 SDK
- 카카오 링크 SDK + 결과 카드 미리보기

### 10. realtime-calc.js 공통 모듈
- 핵심 도구 8개에 한해 실시간 계산 (계산 버튼 없이 입력 즉시 결과)

## 분기 정기 작업 (DevOps 자동)

### Q2-2026
- rates.json 1차 출처 검증 패트롤 (4월·7월)
- 건강보험료율 2026년 7월 갱신 가능성 점검
- 국민연금 기준소득월액 상·하한 2026-07-01 갱신 점검
- Lighthouse / GSC 색인 점검

## 갱신
- 2026-04-12: 초기 작성 (셋업 시점)
