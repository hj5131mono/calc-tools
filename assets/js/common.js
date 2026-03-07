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

// 공통 네비게이션 HTML 생성
function createNavigation() {
  return `
    <header class="site-header">
      <div class="container">
        <h1><i data-lucide="calculator" class="icon"></i> 계산기 도구 모음</h1>
        <nav>
          <ul class="nav-links">
            <li><a href="/index.html">홈</a></li>
            <li><a href="/index.html#금융">금융계산기</a></li>
            <li><a href="/index.html#로또">로또/운세</a></li>
            <li><a href="/index.html#유틸리티">일상유틸리티</a></li>
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

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
  initLayout();
  initAutoComma();
  initKeyboardShortcuts();
  initKeyboardHint();

  // Lucide Icons 초기화 (동적으로 추가된 아이콘도 포함)
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

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
