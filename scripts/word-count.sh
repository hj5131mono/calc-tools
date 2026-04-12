#!/usr/bin/env bash
# scripts/word-count.sh
# 핵심 도구 8개 + 가이드 20편의 HTML 본문 단어 수를 측정한다.
#
# 사용:
#   bash scripts/word-count.sh
#
# 통과선:
#   핵심 도구: 1,800+ 단어 (어절)
#   가이드:     800+ 단어 (어절)
#
# Exit code:
#   0 — 모두 통과
#   1 — 미달 파일 존재

set -uo pipefail
cd "$(dirname "$0")/.."

PASS=0
FAIL=0

count_words() {
  local file="$1"
  if [ ! -f "$file" ]; then
    echo "MISSING"
    return
  fi
  sed 's/<[^>]*>//g' "$file" \
    | sed '/^[[:space:]]*$/d' \
    | tr -s '[:space:]' '\n' \
    | grep -c '[^[:space:]]' 2>/dev/null || echo 0
}

check() {
  local label="$1"
  local file="$2"
  local threshold="$3"
  local words
  words=$(count_words "$file")
  if [ "$words" = "MISSING" ]; then
    printf "  %-62s  MISSING\n" "$file"
    FAIL=$((FAIL + 1))
    return
  fi
  if [ "$words" -ge "$threshold" ]; then
    printf "  %-62s  %6s  OK\n" "$file" "$words"
    PASS=$((PASS + 1))
  else
    printf "  %-62s  %6s  !! 미달 (기준 %s)\n" "$file" "$words" "$threshold"
    FAIL=$((FAIL + 1))
  fi
}

echo "calc-tools 본문 단어 수 측정"
echo "=================================================="
echo ""
echo "[ 핵심 도구 8개 — 기준: 1,800+ ]"
check "severance"        "payroll/severance.html"        1800
check "weekly-holiday"   "payroll/weekly-holiday.html"   1800
check "annual-leave"     "payroll/annual-leave.html"     1800
check "ordinary-wage"    "payroll/ordinary-wage.html"    1800
check "salary"           "finance/salary.html"           1800
check "loan"             "finance/loan.html"             1800
check "compound"         "finance/compound.html"         1800
check "year-end-tax"     "payroll/year-end-tax.html"     1800

echo ""
echo "[ 노동법 가이드 12편 — 기준: 800+ ]"
check "severance-vs-pension"        "guide/labor/severance-vs-pension.html"        800
check "weekly-holiday-mistakes"     "guide/labor/weekly-holiday-mistakes.html"     800
check "annual-leave-2026"           "guide/labor/annual-leave-2026.html"           800
check "ordinary-wage-supreme-court" "guide/labor/ordinary-wage-supreme-court.html" 800
check "overtime-pay-guide"          "guide/labor/overtime-pay-guide.html"          800
check "unemployment-benefit-guide"  "guide/labor/unemployment-benefit-guide.html"  800
check "severance-interim-payment"   "guide/labor/severance-interim-payment.html"   800
check "4-insurance-part-time"       "guide/labor/4-insurance-part-time.html"       800
check "wage-arrears-report"         "guide/labor/wage-arrears-report.html"         800
check "probation-wage"              "guide/labor/probation-wage.html"              800
check "parental-leave-pay"          "guide/labor/parental-leave-pay.html"          800
check "workers-compensation"        "guide/labor/workers-compensation.html"        800

echo ""
echo "[ 세법 가이드 5편 — 기준: 800+ ]"
check "year-end-tax-changes-2026"   "guide/tax/year-end-tax-changes-2026.html"    800
check "credit-card-deduction"       "guide/tax/credit-card-deduction.html"        800
check "medical-expense-deduction"   "guide/tax/medical-expense-deduction.html"    800
check "dependent-deduction"         "guide/tax/dependent-deduction.html"          800
check "rent-deduction"              "guide/tax/rent-deduction.html"               800

echo ""
echo "[ 금융 가이드 3편 — 기준: 800+ ]"
check "simple-vs-compound-interest" "guide/finance/simple-vs-compound-interest.html" 800
check "loan-repayment-methods"      "guide/finance/loan-repayment-methods.html"      800
check "dsr-ltv-guide"               "guide/finance/dsr-ltv-guide.html"               800

echo ""
echo "=================================================="
echo "결과: 통과 ${PASS}개 / 미달 ${FAIL}개"
if [ $FAIL -eq 0 ]; then
  echo "모든 페이지 단어 수 기준 통과"
  exit 0
else
  echo "미달 ${FAIL}개 — 콘텐츠 보강 필요"
  exit 1
fi
