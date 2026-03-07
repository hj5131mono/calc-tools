/**
 * 세율/요율 자동 업데이트 스크립트
 * GitHub Actions에서 실행됩니다.
 * 실행: node scripts/update-rates.js
 *
 * 자동 수집 항목:
 *   - 최저임금: 공공데이터포털 API (DATA_GO_KR_API_KEY 환경변수 필요)
 *
 * 알림 생성 항목 (수동 확인 필요):
 *   - 연도가 바뀌었는데 rates.json이 갱신 안 된 경우
 *   → GitHub Issue로 자동 알림 생성
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RATES_PATH = path.join(__dirname, '..', 'assets', 'data', 'rates.json');

const currentRates = JSON.parse(fs.readFileSync(RATES_PATH, 'utf8'));
const updatedRates = JSON.parse(JSON.stringify(currentRates)); // 깊은 복사

const today = new Date();
const currentYear = today.getFullYear();
let changed = false;
const warnings = []; // 수동 확인 필요 항목 수집

// ─── 유틸 ────────────────────────────────────────────────────────

function log(msg) { console.log(`[update-rates] ${msg}`); }
function warn(msg) { console.warn(`[update-rates] ⚠ ${msg}`); warnings.push(msg); }

// ─── 1. 최저임금 자동 수집 (공공데이터포털 API) ──────────────────

async function fetchMinimumWage() {
  const apiKey = process.env.DATA_GO_KR_API_KEY;
  if (!apiKey) {
    warn('DATA_GO_KR_API_KEY 미설정 — 최저임금 자동 수집 건너뜀');
    return;
  }

  try {
    // 고용노동부 최저임금 현황 API
    const url = new URL('https://apis.data.go.kr/1480523/MinimumWageService/getMinimumWageList');
    url.searchParams.set('serviceKey', apiKey);
    url.searchParams.set('pageNo', '1');
    url.searchParams.set('numOfRows', '3');
    url.searchParams.set('year', String(currentYear));

    const res = await fetch(url.toString(), { timeout: 10000 });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const items = data?.response?.body?.items?.item;
    const item = Array.isArray(items) ? items[0] : items;

    if (!item) {
      warn(`최저임금 API 응답 비어있음 — 수동 확인 필요 (moel.go.kr)`);
      return;
    }

    const newHourly = parseInt(item.minimumWage ?? item.hourlyWage ?? item.시급 ?? 0);
    if (!newHourly || isNaN(newHourly)) {
      warn(`최저임금 API 파싱 실패 — 수동 확인 필요`);
      return;
    }

    if (newHourly !== currentRates.minimumWage.hourly) {
      log(`최저임금 업데이트: ${currentRates.minimumWage.hourly}원 → ${newHourly}원`);
      updatedRates.minimumWage.hourly = newHourly;
      updatedRates.minimumWage.monthly = newHourly * 209; // 주 40h × 209h/월
      updatedRates.minimumWage.year = currentYear;
      updatedRates.minimumWage.effectiveFrom = `${currentYear}-01-01`;
      changed = true;
    } else {
      log(`최저임금 변경 없음 (${newHourly}원)`);
    }
  } catch (e) {
    warn(`최저임금 API 호출 실패: ${e.message} — 수동 확인 필요`);
  }
}

// ─── 2. 연도 변경 감지 (알림용) ──────────────────────────────────

function checkYearChange() {
  const ratesYear = currentRates._meta.year;

  if (currentYear > ratesYear) {
    warn(`rates.json이 ${ratesYear}년 기준입니다. ${currentYear}년으로 업데이트 필요!`);
    warn('확인 필요: 건강보험료율 (nhis.or.kr)');
    warn('확인 필요: 장기요양보험료율 (nhis.or.kr)');
    warn('확인 필요: 고용보험료율 (ei.go.kr)');
    warn('확인 필요: 소득세 간이세액표 (nts.go.kr)');
  }

  // 7월 이후라면 국민연금 한도 확인 권고
  const isAfterJuly = today.getMonth() >= 6; // 0-indexed
  const pensionLimitYear = new Date(currentRates.insurance.nationalPension.limitEffectiveFrom).getFullYear();
  if (isAfterJuly && pensionLimitYear < currentYear) {
    warn('국민연금 기준소득월액 상·하한 업데이트 필요 (매년 7월 변경, nps.or.kr)');
  }
}

// ─── 3. rates.json 저장 ───────────────────────────────────────────

function saveRates() {
  if (!changed) {
    log('rates.json 변경사항 없음');
    return;
  }

  updatedRates._meta.updated = today.toISOString().split('T')[0];
  updatedRates._meta.updatedBy = 'github-actions';

  fs.writeFileSync(RATES_PATH, JSON.stringify(updatedRates, null, 2) + '\n');
  log(`rates.json 저장 완료 (${updatedRates._meta.updated})`);
}

// ─── 4. 경고 출력 (GitHub Actions가 캡처) ────────────────────────

function reportWarnings() {
  if (warnings.length === 0) {
    log('경고 없음 — 모든 항목 정상');
    return;
  }

  console.log('\n══════════════════════════════════════════');
  console.log('⚠  수동 확인이 필요한 항목이 있습니다');
  console.log('══════════════════════════════════════════');
  warnings.forEach((w, i) => console.log(`  ${i + 1}. ${w}`));
  console.log('══════════════════════════════════════════\n');

  // GitHub Actions에서 경고가 있으면 비정상 종료 → Issue 생성 트리거
  process.exit(1);
}

// ─── 메인 ─────────────────────────────────────────────────────────

async function main() {
  log(`실행 시작 (현재 날짜: ${today.toISOString().split('T')[0]})`);
  log(`현재 rates.json 기준 연도: ${currentRates._meta.year}`);

  checkYearChange();
  await fetchMinimumWage();
  saveRates();
  reportWarnings();

  log('완료');
}

main().catch(e => {
  console.error('[update-rates] 치명적 오류:', e);
  process.exit(1);
});
