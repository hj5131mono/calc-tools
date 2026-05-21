# 미션: AdSense Low Value Content 재반려 대응 PDCA (2026-05-21)

## Plan

- 반려 화면: `정책 위반 — 가치가 별로 없는 콘텐츠`, 사이트 상태 `광고 게재가 준비되지 않은 사이트`.
- Google 공식 기준 요약:
  - 애드센스 자격 요건: 고품질·독창적·잠재고객 관심 콘텐츠 필요.
  - 사이트 준비 문서: 방문자와 관련성 높고 만족스러운 UX를 제공하는 고유 콘텐츠 필요.
  - 게시자 정책: 게시자 콘텐츠가 없거나 가치가 낮은 화면, 미완성 화면, 탐색/행동 목적 화면에는 광고 부적합.
  - 콘텐츠/UX 문서: 실질 가치, 독창성, 정기 업데이트, 중복·스크래핑·자동 생성 콘텐츠 회피 필요.
- 현재 사이트 핵심 리스크:
  1. 노동법·세법 전문 사이트를 표방하지만 사주 로또·일상 유틸·주식/코인 도구가 sitemap·홈에 노출.
  2. `sitemap.xml` 끝에 불필요한 `</content></invoke>` 태그가 있어 XML 파싱 실패.
  3. 일부 thin/off-topic 페이지에 AdSense script가 포함되어 저가치 광고 후보로 보일 수 있음.

## Do

- `sitemap.xml` XML 오류 수정.
- 재심사 전 noindex 처리:
  - `lotto/saju-pick.html`
  - `stock/averaging.html`, `stock/return-rate.html`
  - `daily/age.html`, `daily/bmi.html`, `daily/character-count.html`, `daily/dday.html`
  - `finance/percent.html`
- 위 noindex 페이지에서 AdSense script 제거.
- 홈페이지 및 공통 네비게이션에서 `기타 유틸` 노출 제거.
- 부가세 계산기를 세금·금융 핵심 도구로 승격하고, 부가가치세법·국세청·홈택스 공식 출처 섹션 보강.
- `privacy.html`을 h1 구조로 수정하고, AdSense/Analytics 쿠키·계산 데이터 처리 원칙 보강.

## Check

- XML 파싱, noindex/sitemap 불일치, off-topic 홈 링크, AdSense script 잔존 여부를 스크립트로 검증한다.
- 핵심 페이지의 canonical, robots, ads.txt, robots.txt는 별도 확인한다.

## Act

- 재심사 전 GSC에서 sitemap 재제출 및 핵심 URL 색인 요청.
- 다음 단계는 thin 가이드 8개와 VAT/금융 가이드 출처 보강, Lighthouse 모바일 검증.


## Do 추가: 카피라이터·법령 정확도 패스

- 홈페이지 문장을 “계산기 모음”이 아니라 노동법·세법 기준을 쉬운 말로 설명하는 사이트로 재작성.
- generic finance 도구/가이드(대출·복리·DSR)는 재심사 전 `noindex,follow` 및 AdSense 제거로 임시 격리.
- `about.html`의 “광고 추적 없이” 표현을 삭제하고 GA/AdSense 쿠키 사용 사실과 계산 입력값 비전송 원칙을 분리해 설명.
- 주휴수당: 4주 평균 15시간 기준, 주휴시간 8시간 상한, 209시간 산식, 신고 안내 문구 정정.
- 연차: 1년 미만 11일이 15일에서 차감되지 않는 점과 육아휴직 출근 간주 규정 정정.
- 통상임금: 근로기준법 시행령 제6조 및 2024.12.19 대법원 전원합의체 판결의 고정성 요건 변경 취지 반영.
- 퇴직금: 4주 평균 주 15시간 입력값 추가, 퇴직일 검증, 평균임금 포함 수당 설명 보수화.
- 연말정산/연봉: “정확” 단정 대신 간편 추정·간이세액표/결정세액 차이를 명시.
- VAT: 포함금액 역산을 `부가세=floor(합계/11)` 방식으로 정정하고 실무 실수·검증 예시 추가.
- 세법 가이드 문자 깨짐과 일부 단정형 한도 표현을 완화.
