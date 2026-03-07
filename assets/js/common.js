// ─────────────────────────────────────────────────────────────────
// rates.json 로더 — 모든 세율/요율 계산기가 이 함수로 최신 수치를 가져옴
// ─────────────────────────────────────────────────────────────────

const RATES_CACHE_KEY = 'calc_rates_v1';
const RATES_URL = '/assets/data/rates.json';

// 자동화 실패 시 최후 안전망 (common.js 직접 업데이트도 필요)
const FALLBACK_RATES = {
  _meta: { year: 2025, updated: '2025-01-01', updatedBy: 'fallback' },
  minimumWage: { hourly: 10030, monthly: 2096270, year: 2025 },
  insurance: {
    nationalPension: {
      employeeRate: 0.045,
      incomeUpperLimit: 6170000,
      incomeLowerLimit: 370000
    },
    healthInsurance: { employeeRate: 0.03545, longTermCareRate: 0.1295 },
    employmentInsurance: { employeeRate: 0.009 }
  }
};

async function loadRates() {
  // 세션 캐시 확인 (같은 탭에서 페이지 이동 시 재요청 방지)
  try {
    const cached = sessionStorage.getItem(RATES_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      // 캐시가 현재 날짜 기준 당일 데이터면 재사용
      if (parsed._cacheDate === new Date().toDateString()) return parsed;
    }
  } catch (_) { /* sessionStorage 접근 불가 환경 무시 */ }

  try {
    const res = await fetch(RATES_URL + '?_=' + Date.now());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    data._cacheDate = new Date().toDateString();
    try { sessionStorage.setItem(RATES_CACHE_KEY, JSON.stringify(data)); } catch (_) {}
    return data;
  } catch (e) {
    console.warn('[calc-tools] rates.json 로드 실패, 기본값 사용:', e.message);
    return FALLBACK_RATES;
  }
}

// 기준 연도 배지 업데이트 (data-rates-year 속성이 있는 요소에 자동 삽입)
function applyRatesYear(rates) {
  document.querySelectorAll('[data-rates-year]').forEach(el => {
    el.textContent = rates._meta.year + '년 기준';
  });
}

// ─────────────────────────────────────────────────────────────────
// 실시간 환율 로더 — 홈페이지 환율 위젯 및 금융 계산기용
// API: open.exchangerate-api.com (무료, 키 불필요, 일 1회 갱신)
// ─────────────────────────────────────────────────────────────────

const FX_CACHE_KEY = 'calc_fx_v1';
const FX_CACHE_TTL = 30 * 60 * 1000; // 30분

// 폴백 환율 (API 실패 시 표시)
const FX_FALLBACK = {
  USD: { krw: 1370, label: 'USD', unit: 1,   flag: '🇺🇸' },
  JPY: { krw: 915,  label: 'JPY', unit: 100, flag: '🇯🇵' },
  EUR: { krw: 1490, label: 'EUR', unit: 1,   flag: '🇪🇺' },
  CNY: { krw: 189,  label: 'CNY', unit: 1,   flag: '🇨🇳' },
};

async function loadExchangeRates() {
  // 캐시 확인 (TTL 내에는 재요청 안 함)
  try {
    const cached = localStorage.getItem(FX_CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < FX_CACHE_TTL) return data;
    }
  } catch (_) {}

  try {
    const res = await fetch('https://open.exchangerate-api.com/v6/latest/USD', { timeout: 8000 });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.result !== 'success') throw new Error('API 오류');

    const r = json.rates;
    const krwPerUsd = r.KRW;

    const data = {
      USD: { krw: krwPerUsd,                        label: 'USD',     unit: 1,   flag: '🇺🇸', isFallback: false },
      JPY: { krw: (krwPerUsd / r.JPY) * 100,        label: 'JPY 100', unit: 100, flag: '🇯🇵', isFallback: false },
      EUR: { krw: krwPerUsd / r.EUR,                label: 'EUR',     unit: 1,   flag: '🇪🇺', isFallback: false },
      CNY: { krw: krwPerUsd / r.CNY,                label: 'CNY',     unit: 1,   flag: '🇨🇳', isFallback: false },
      _updatedAt: json.time_last_update_utc,
      _fetchedAt: new Date().toISOString(),
    };

    try { localStorage.setItem(FX_CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() })); } catch (_) {}
    return data;
  } catch (e) {
    console.warn('[calc-tools] 환율 로드 실패, 기본값 사용:', e.message);
    return { ...FX_FALLBACK, _updatedAt: null, _fetchedAt: null };
  }
}

// 환율 위젯 렌더링 (id="exchangeWidget" 요소에 삽입)
async function initExchangeWidget() {
  const widget = document.getElementById('exchangeWidget');
  if (!widget) return;

  const fx = await loadExchangeRates();

  const formatKrw = v => Math.round(v).toLocaleString('ko-KR');

  // 업데이트 시간 표시
  let updatedText = '환율 정보 없음';
  if (fx._updatedAt) {
    const d = new Date(fx._updatedAt);
    updatedText = `기준 ${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} (UTC)`;
  } else {
    updatedText = '참고용 기본값';
  }

  const currencies = ['USD', 'JPY', 'EUR', 'CNY'];
  const itemsHtml = currencies.map(code => {
    const item = fx[code];
    if (!item) return '';
    return `
      <div class="exchange-item">
        <span class="exchange-currency">${item.flag} ${item.label}</span>
        <span class="exchange-rate">${formatKrw(item.krw)}원</span>
      </div>`;
  }).join('');

  widget.classList.remove('exchange-skeleton'); // 스켈레톤 해제 → 숫자 visible
  widget.innerHTML = `
    <div class="exchange-header">
      <span class="exchange-title">실시간 환율</span>
      <span class="exchange-updated">${updatedText}</span>
    </div>
    <div class="exchange-grid">${itemsHtml}</div>`;
}

// ─────────────────────────────────────────────────────────────────

// 숫자를 천단위 콤마 포맷으로 변환
function formatNumber(num) {
  if (num === null || num === undefined || num === '') {
    return '0';
  }
  return Number(num).toLocaleString('ko-KR');
}

// 콤마가 포함된 문자열을 숫자로 변환
function parseNumber(str) {
  if (typeof str === 'number') {
    return str;
  }
  if (!str) {
    return 0;
  }
  // 콤마 제거 후 숫자 변환
  return parseFloat(str.replace(/,/g, '')) || 0;
}

// 입력 필드에 자동 콤마 포맷팅 적용
function applyAutoComma(inputElement) {
  inputElement.addEventListener('input', function(e) {
    let value = e.target.value.replace(/,/g, '');

    // 숫자가 아닌 문자 제거 (소수점과 마이너스는 허용)
    value = value.replace(/[^\d.-]/g, '');

    // 빈 값이면 그대로 리턴
    if (value === '' || value === '-') {
      e.target.value = value;
      return;
    }

    // 소수점 포함 시: 정수 부분만 콤마 포맷하고 소수 부분은 그대로 유지
    // (parseFloat("4.") = 4 로 소수점이 사라지는 버그 방지)
    if (value.includes('.')) {
      const dotIdx = value.indexOf('.');
      const intPart = value.slice(0, dotIdx);
      const decPart = value.slice(dotIdx); // '.' 포함
      const intNum = parseFloat(intPart) || 0;
      e.target.value = intPart === '' ? decPart : formatNumber(intNum) + decPart;
      return;
    }

    // 숫자로 변환 후 다시 포맷팅
    const num = parseFloat(value);
    if (!isNaN(num)) {
      e.target.value = formatNumber(num);
    }
  });
}

// 모든 .auto-comma 클래스를 가진 input에 자동 콤마 적용
function initAutoComma() {
  const autoCommaInputs = document.querySelectorAll('.auto-comma');
  autoCommaInputs.forEach(input => {
    applyAutoComma(input);
  });
}

// 공통 네비게이션 HTML 생성 (서브 페이지용 - active 상태 자동 감지)
function createNavigation() {
  const path = window.location.pathname;
  let activeCategory = '';
  if (path.includes('/finance/') || path.includes('/stock/')) activeCategory = '금융';
  else if (path.includes('/payroll/')) activeCategory = '노무';
  else if (path.includes('/lotto/')) activeCategory = '로또';
  else if (path.includes('/daily/')) activeCategory = '유틸리티';

  const navItems = [
    { href: '/index.html', label: '홈', key: 'home' },
    { href: '/index.html#금융', label: '금융/투자', key: '금융' },
    { href: '/index.html#노무', label: '노무/급여', key: '노무' },
    { href: '/index.html#로또', label: '로또/운세', key: '로또' },
    { href: '/index.html#유틸리티', label: '일상 유틸리티', key: '유틸리티' },
  ];

  const navHTML = navItems.map(item => {
    const isActive = item.key === activeCategory ||
      (item.key === 'home' && (path === '/' || path.endsWith('/index.html')));
    return `<li><a href="${item.href}"${isActive ? ' class="active"' : ''}>${item.label}</a></li>`;
  }).join('');

  return `
    <header class="site-header">
      <div class="container header-inner">
        <a href="/index.html" class="site-logo">
          <i data-lucide="calculator" class="icon"></i>
          <span>계산기 도구 모음</span>
        </a>
        <nav>
          <ul class="nav-links">
            ${navHTML}
          </ul>
        </nav>
      </div>
    </header>
  `;
}

// 공통 푸터 HTML 생성
function createFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-links">
            <a href="/index.html">홈</a>
            <a href="/privacy.html">개인정보처리방침</a>
          </div>
          <p>&copy; ${new Date().getFullYear()} 계산기 도구 모음. All rights reserved.</p>
          <p style="font-size: 0.75rem; margin-top: 8px;">
            본 사이트의 모든 계산 결과는 참고용이며, 실제 거래나 결정 시 전문가와 상담하시기 바랍니다.
          </p>
        </div>
      </div>
    </footer>
  `;
}

// 네비게이션과 푸터 자동 삽입
function initLayout() {
  // body 시작 부분에 네비게이션 삽입
  const header = document.querySelector('body');
  if (header && !document.querySelector('.site-header')) {
    header.insertAdjacentHTML('afterbegin', createNavigation());
  }

  // body 끝 부분에 푸터 삽입
  const footer = document.querySelector('body');
  if (footer && !document.querySelector('.site-footer')) {
    footer.insertAdjacentHTML('beforeend', createFooter());
  }
}

// 키보드 단축키 초기화
function initKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    const tag = document.activeElement.tagName;

    // Enter 키: 계산하기 버튼 클릭
    if (e.key === 'Enter' && tag === 'INPUT') {
      e.preventDefault();
      const submitBtn = document.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.click();
    }

    // Escape 키: 초기화 버튼 클릭
    if (e.key === 'Escape') {
      const resetBtn = document.querySelector('.btn-reset');
      if (resetBtn) resetBtn.click();
    }

    // 화살표 키: .auto-comma 입력 필드 값 1씩 조정
    if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && tag === 'INPUT') {
      const input = document.activeElement;
      if (input.classList.contains('auto-comma')) {
        e.preventDefault();
        const current = parseNumber(input.value) || 0;
        const next = current + (e.key === 'ArrowUp' ? 1 : -1);
        input.value = formatNumber(next);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  });
}

// 키보드 단축키 안내 텍스트 삽입 (계산기 페이지에만)
function initKeyboardHint() {
  if (!document.querySelector('form')) return;
  const hint = document.createElement('p');
  hint.style.cssText = 'text-align:center; font-size:0.75rem; color:var(--text-light); margin: 0 0 16px;';
  hint.textContent = '단축키: Enter=계산 | Esc=초기화 | 화살표=값 조정';
  const footer = document.querySelector('.site-footer');
  if (footer) footer.insertAdjacentElement('beforebegin', hint);
}

// index.html 도구 검색 + 카테고리 탭 필터
function initToolFilter() {
  const searchInput = document.getElementById('toolSearch');
  if (!searchInput) return;

  const tabBtns = document.querySelectorAll('.tab-btn');
  const sections = document.querySelectorAll('.category-section[data-tab]');
  const noResults = document.getElementById('noResults');
  let activeTab = 'all';

  function filterTools() {
    const query = searchInput.value.trim().toLowerCase();
    let totalVisible = 0;

    sections.forEach(section => {
      const tabMatch = activeTab === 'all' || section.dataset.tab === activeTab;
      if (!tabMatch) {
        section.style.display = 'none';
        return;
      }

      const cards = section.querySelectorAll('.tool-card');
      let sectionVisible = 0;
      cards.forEach(card => {
        // 검색 중 disabled(준비중) 카드 숨기기
        if (query && card.classList.contains('disabled')) {
          card.style.display = 'none';
          return;
        }
        const matches = !query || card.textContent.toLowerCase().includes(query);
        card.style.display = matches ? '' : 'none';
        if (matches) sectionVisible++;
      });

      section.style.display = sectionVisible > 0 ? '' : 'none';
      totalVisible += sectionVisible;
    });

    if (noResults) {
      noResults.classList.toggle('show', totalVisible === 0 && !!(query || activeTab !== 'all'));
    }
  }

  searchInput.addEventListener('input', filterTools);

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTab = btn.dataset.tab;
      filterTools();
      // 검색어 없을 때 탭 클릭 → 해당 섹션으로 스크롤
      if (!searchInput.value.trim() && activeTab !== 'all') {
        const target = document.querySelector(`.category-section[data-tab="${activeTab}"]`);
        if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
      }
    });
  });
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
  initLayout();
  initAutoComma();
  initAmountHint();
  initExchangeWidget();
  initKeyboardShortcuts();
  initKeyboardHint();
  initToolFilter();

  // Lucide Icons 초기화 (동적으로 추가된 아이콘도 포함)
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

// 숫자를 한국어 금액 단위로 변환 (예: 300000000 → "3억원")
function toKoreanAmount(rawValue, unit) {
  const multiplier = (unit === '만원') ? 10000 : 1;
  const num = parseNumber(rawValue) * multiplier;
  if (!num || num <= 0) return '';

  const jo   = Math.floor(num / 1_000_000_000_000);
  const uk   = Math.floor((num % 1_000_000_000_000) / 100_000_000);
  const man  = Math.floor((num % 100_000_000) / 10_000);
  const rest = Math.floor(num % 10_000);

  const parts = [];
  if (jo   > 0) parts.push(jo.toLocaleString('ko-KR')  + '조');
  if (uk   > 0) parts.push(uk.toLocaleString('ko-KR')  + '억');
  if (man  > 0) parts.push(man.toLocaleString('ko-KR') + '만');
  if (rest > 0) parts.push(rest.toLocaleString('ko-KR'));

  return parts.length ? parts.join(' ') + '원' : '';
}

// data-amount-hint 속성이 있는 입력 필드에 한국어 금액 인디케이터 부착
function initAmountHint() {
  document.querySelectorAll('[data-amount-hint]').forEach(input => {
    const hint = document.createElement('span');
    hint.className = 'amount-hint-text';

    // input-with-unit 래퍼가 있으면 래퍼 뒤에 삽입 (레터박스 밖으로)
    const wrapper = input.closest('.input-with-unit');
    (wrapper || input).insertAdjacentElement('afterend', hint);

    const unit = input.dataset.amountHint || '원';
    input.addEventListener('input', () => {
      hint.textContent = toKoreanAmount(input.value, unit);
    });
  });
}

// 결과 박스 표시/숨김
function showResult(resultBoxId) {
  const resultBox = document.getElementById(resultBoxId);
  if (resultBox) {
    resultBox.classList.add('show');
    // 결과 박스로 부드럽게 스크롤
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function hideResult(resultBoxId) {
  const resultBox = document.getElementById(resultBoxId);
  if (resultBox) {
    resultBox.classList.remove('show');
  }
}

// 폼 초기화
function resetForm(formId) {
  const form = document.getElementById(formId);
  if (form) {
    form.reset();
  }
}
