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
  else if (path.includes('/lotto/')) activeCategory = '로또';
  else if (path.includes('/daily/')) activeCategory = '유틸리티';

  const navItems = [
    { href: '/index.html', label: '홈', key: 'home' },
    { href: '/index.html#금융', label: '금융/투자', key: '금융' },
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
    input.insertAdjacentElement('afterend', hint);

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
