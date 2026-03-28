# 세율/요율 수동 업데이트 절차

> 참조: `@docs/RATES_SYSTEM.md` (시스템 개요), `@docs/ARCHITECTURE.md` (공유 레이어)

---

## GitHub Issues 알림 확인

자동 수집 실패 시 GitHub Issues에 이슈가 자동 생성됨:
```
제목: [긴급] 세율 자동 수집 실패 - 2025-01-02
내용: 수동 확인 필요 항목 체크리스트
```

## 항목별 공식 확인처

| 항목 | 확인 URL |
|------|---------|
| 최저임금 | https://www.moel.go.kr/info/lawinfo/announ/list.do |
| 국민연금 기준소득월액 | https://www.nps.or.kr/jsppage/info/resources/resources_02_3.jsp |
| 건강보험료율 | https://www.nhis.or.kr/nhis/policy/wContentView.do?MENU_ID=10300 |
| 장기요양보험료율 | nhis.or.kr (건강보험과 동일 페이지) |
| 고용보험요율 | https://www.ei.go.kr/ei/eih/eg/pb/pbPayInfo/retrievePb0202Info.do |
| 소득세 간이세액표 | https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2227&cntntsId=7667 |

## rates.json 직접 수정

```bash
# 1. 파일 수정: assets/data/rates.json
# 2. 변경 확인
git diff assets/data/rates.json
# 3. 커밋 & 배포
git add assets/data/rates.json
git commit -m "fix: 2025년 건강보험료율 업데이트 (3.545% → X.XXX%)"
git push
# → GitHub Pages 자동 배포, 전 계산기 즉시 반영
```

## 수동 트리거 (GitHub Actions 재실행)

GitHub 레포 → Actions → "세율/요율 자동 업데이트" → **Run workflow** 버튼

## 연간 점검 체크리스트

### 매년 1월 (★★★)
- [ ] 최저임금 변경 확인
- [ ] 건강보험료율 변경 → nhis.or.kr
- [ ] 장기요양보험료율 변경
- [ ] 고용보험료율 변경
- [ ] 소득세 간이세액표 개정 → 국세청
- [ ] rates.json `_meta.year` 값 확인

### 매년 7월 (★★)
- [ ] 국민연금 기준소득월액 상·하한 → nps.or.kr
- [ ] rates.json `nationalPension.incomeUpperLimit` / `incomeLowerLimit` 업데이트

### 수시 (법령 개정)
- [ ] 연차 유급휴가 (근로기준법 제60조)
- [ ] 퇴직금 산정 (퇴직급여보장법 제8조)
- [ ] 주휴수당 (근로기준법 제55조)
- [ ] 소득세 세율 구간 (소득세법 제55조)

## 변경 이력

| 날짜 | 변경 항목 | 내용 |
|------|----------|------|
| 2025-03-07 | 최초 구축 | rates.json 시스템 도입, salary.html 연동 |
| 2026-01-01 | 4대보험 요율 | 국민연금 4.5%→4.75%, 건강보험 3.545%→3.595%, 장기요양 12.95%→13.14% |

> 이후 변경 시 이 표에 기록하세요.
