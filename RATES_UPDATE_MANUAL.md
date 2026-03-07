# 세율/요율 자동 업데이트 시스템 매뉴얼

> 이 문서는 calc-tools.kr의 세율·요율 자동화 시스템의 운영·유지보수 매뉴얼입니다.

---

## 1. 시스템 개요

```
[정부 공공 API / 공시 파일]
         ↓  GitHub Actions (자동, 분기별 실행)
[assets/data/rates.json]  ← 단일 진실 공급원 (Single Source of Truth)
         ↓  fetch() at runtime
[각 계산기 페이지]  →  "2025년 기준" 자동 표시
```

**핵심 원칙:**
- 수치를 바꾸려면 `assets/data/rates.json` 하나만 수정하면 전 페이지 즉시 반영
- GitHub Actions가 분기별로 자동 수집 → 변경 시 자동 커밋 → GitHub Pages 자동 배포
- 자동 수집 실패 시 → GitHub Issue 자동 생성 → 레포 담당자에게 알림

---

## 2. 파일 구조

```
calc-tools/
├── assets/data/
│   └── rates.json                  ← ★ 핵심 파일. 모든 계산기가 이 파일을 읽음
├── scripts/
│   ├── package.json                ← Node.js 의존성
│   └── update-rates.js             ← 자동 수집 스크립트
└── .github/workflows/
    └── update-rates.yml            ← GitHub Actions 워크플로우
```

---

## 3. rates.json 구조 설명

```json
{
  "_meta": {
    "year": 2025,              // 기준 연도 (계산기에 표시됨)
    "updated": "2025-01-01",   // 마지막 업데이트 날짜
    "updatedBy": "github-actions"  // 업데이트 주체
  },
  "minimumWage": { ... },      // 최저임금
  "insurance": { ... },        // 4대보험 요율
  "incomeTax": { ... },        // 소득세 세율 구간
  "laborLaw": { ... }          // 연차/퇴직금 계산 관련 법령 상수
}
```

전체 구조는 `assets/data/rates.json` 파일 직접 참조.

---

## 4. 자동화 범위 및 데이터 소스

| 항목 | 자동화 방법 | 변경 빈도 | 공식 출처 |
|------|-----------|---------|---------|
| 최저임금 | 공공데이터포털 API | 매년 1월 | moel.go.kr |
| 국민연금 기준소득월액 상·하한 | GitHub Issue 알림 | 매년 7월 | nps.or.kr |
| 건강보험료율 | GitHub Issue 알림 | 매년 1월 | nhis.or.kr |
| 장기요양보험료율 | GitHub Issue 알림 | 매년 1월 | nhis.or.kr |
| 고용보험료율 | GitHub Issue 알림 | 부정기 | moel.go.kr |
| 소득세 세율 구간 | GitHub Issue 알림 | 부정기 (법 개정 시) | nts.go.kr |
| 근로소득공제 구간 | GitHub Issue 알림 | 부정기 | nts.go.kr |
| 연차/퇴직금 공식 | 법 개정 감지 알림 | 부정기 | law.go.kr |

**완전 자동 수집:** 최저임금 (공공 API 존재)
**알림 후 수동 확인:** 나머지 항목 (정부 사이트 구조 변경 위험으로 파싱 비신뢰)

---

## 5. GitHub Actions 자동 실행 일정

| 실행 시점 | 이유 |
|----------|------|
| **매년 1월 2일** | 최저임금·건강보험·고용보험 신규 요율 적용 (1월 1일) |
| **매년 7월 2일** | 국민연금 기준소득월액 상·하한 변경 (매년 7월) |
| **매 분기 1일** (1, 4, 7, 10월) | 중간 법령 개정 대응 |
| **수동 실행** | 긴급 업데이트 필요 시 |

---

## 6. 초기 설정 (최초 1회)

### 6-1. 공공데이터포털 API 키 발급

1. https://www.data.go.kr 접속 → 회원가입/로그인
2. 상단 "마이페이지" → "인증키 신청/관리"
3. 활용신청: `고용노동부_최저임금 현황` 검색 → 활용신청
4. 승인 후 "일반 인증키(Encoding)" 복사

### 6-2. GitHub Secrets 등록

GitHub 레포 → Settings → Secrets and variables → Actions → New repository secret

| Secret 이름 | 값 | 설명 |
|------------|-----|------|
| `DATA_GO_KR_API_KEY` | 위에서 발급한 인증키 | 공공데이터포털 API 인증 |

### 6-3. GitHub Actions 권한 설정

GitHub 레포 → Settings → Actions → General
→ "Workflow permissions" → **"Read and write permissions"** 선택 → Save

---

## 7. 수동 업데이트 방법 (자동화 실패 시)

### 7-1. GitHub Issues 알림 확인

자동 수집 실패 시 GitHub Issues에 아래와 같은 이슈가 자동 생성됩니다:

```
제목: [긴급] 세율 자동 수집 실패 - 2025-01-02
내용: 수동 확인 필요 항목 체크리스트
```

### 7-2. 각 항목별 공식 확인처

| 항목 | 확인 URL |
|------|---------|
| 최저임금 | https://www.moel.go.kr/info/lawinfo/announ/list.do |
| 국민연금 기준소득월액 | https://www.nps.or.kr/jsppage/info/resources/resources_02_3.jsp |
| 건강보험료율 | https://www.nhis.or.kr/nhis/policy/wContentView.do?MENU_ID=10300 |
| 장기요양보험료율 | https://www.nhis.or.kr (건강보험과 동일 페이지) |
| 고용보험요율 | https://www.ei.go.kr/ei/eih/eg/pb/pbPayInfo/retrievePb0202Info.do |
| 소득세 간이세액표 | https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2227&cntntsId=7667 |

### 7-3. rates.json 직접 수정

```bash
# 1. 로컬에서 파일 수정
# assets/data/rates.json 열어서 해당 값 변경

# 2. 변경 내용 확인
git diff assets/data/rates.json

# 3. 커밋 & 배포
git add assets/data/rates.json
git commit -m "fix: 2025년 건강보험료율 업데이트 (3.545% → X.XXX%)"
git push
# → GitHub Pages 자동 배포, 전 계산기 즉시 반영
```

### 7-4. 수동 트리거 (GitHub Actions 재실행)

GitHub 레포 → Actions → "세율/요율 자동 업데이트" → "Run workflow" 버튼

---

## 8. 연간 점검 체크리스트

### 매년 1월 (★★★ 최우선)

- [ ] 최저임금 변경 여부 확인 (GitHub Actions 자동 처리 여부 확인)
- [ ] 건강보험료율 변경 여부 → nhis.or.kr 확인
- [ ] 장기요양보험료율 변경 여부 (건강보험과 동일 페이지)
- [ ] 고용보험료율 변경 여부
- [ ] 소득세 간이세액표 개정 여부 → 국세청 확인
- [ ] rates.json의 `_meta.year` 값이 현재 연도인지 확인

### 매년 7월 (★★ 중요)

- [ ] 국민연금 기준소득월액 상·하한 변경 여부 → nps.or.kr 확인
- [ ] rates.json `nationalPension.incomeUpperLimit` / `incomeLowerLimit` 업데이트

### 수시 (법령 개정 시)

- [ ] 연차 유급휴가 계산 방식 변경 여부 (근로기준법 제60조)
- [ ] 퇴직금 산정 방식 변경 여부 (근로자퇴직급여보장법 제8조)
- [ ] 주휴수당 기준 변경 여부 (근로기준법 제55조)
- [ ] 소득세 세율 구간 변경 여부 (소득세법 제55조)

---

## 9. 계산기 페이지에서의 표시 방식

모든 계산기는 결과 상단에 기준 연도를 표시합니다:

```html
<!-- HTML -->
<span class="rates-year-badge">2025년 기준</span>
```

```javascript
// rates.json 로드 후 자동 업데이트
document.querySelectorAll('.rates-year').forEach(el => {
  el.textContent = rates._meta.year + '년';
});
```

---

## 10. 오류 대응 흐름

```
GitHub Actions 실행
    ├─ 성공 → rates.json 업데이트 → 자동 커밋/배포 → 완료
    └─ 실패 → GitHub Issue 자동 생성
                  ↓
            레포 담당자 알림 수신
                  ↓
            공식 출처 수동 확인 (§7-2 참조)
                  ↓
            rates.json 직접 수정 (§7-3 참조)
                  ↓
            git push → 자동 배포 → 완료
```

**최악의 경우 (rates.json 로드 실패):**
→ 계산기는 `common.js` 내 `FALLBACK_RATES` 하드코딩 값으로 동작
→ 화면에 "⚠ 최신 요율을 불러오지 못했습니다. 참고용으로만 활용하세요." 경고 표시

---

## 11. 주요 변경 이력

| 날짜 | 변경 항목 | 변경 내용 |
|------|----------|---------|
| 2025-03-07 | 최초 구축 | rates.json 시스템 도입, salary.html 연동 |
| 2026-01-01 | 4대보험 요율 업데이트 | 국민연금 4.5%→4.75%, 건강보험 3.545%→3.595%, 장기요양 12.95%→13.14% |

> 이후 변경 시 이 표에 기록하세요.
