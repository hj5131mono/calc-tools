#!/usr/bin/env bash
# scripts/check-stale.sh
# 옛 컨셉 잔재 회귀 방지 검사 (calc-tools QA)
#
# 사용:
#   bash scripts/check-stale.sh        # 로컬 실행
#   GitHub Actions stale-check.yml에서도 호출됨
#
# 설계 원칙:
# - **명확한 잔재만 잡는다**. false positive 최소화.
# - 데이터 무결성(옛 시급/요율 본문 잔재)은 DevOps 분기 패트롤이 별도 처리.
# - 본 검사는 다음 5종만 잡는다:
#   1. 옛 사이트 카피 ("16개의 무료 계산기", "계산기 도구 모음")
#   2. 옛 메타 잔재 (data-rates-year>2025, "2024-58호")
#   3. hardcoded site-header 재발 — 도구 페이지 13개에 한정
#   4. 옛 placeholder ("예: 10,030")
#   5. 옛 보험료율 본문 단정 ("국민연금 4.5%" 식)
#
# Exit code:
#   0 — 잔재 없음
#   1 — 잔재 발견 (commit/push 차단 권장)

set -uo pipefail

cd "$(dirname "$0")/.."

# 전역 예외 (이력·운영 문서·검사 자체)
GLOBAL_EXCLUDE='docs/handover|docs/team|\.claude/agents|scripts/check-stale\.sh|\.github/workflows/stale-check\.yml|\.git/|node_modules/|docs/RATES_SYSTEM\.md|docs/RATES_MANUAL\.md|RATES_UPDATE_MANUAL\.md|assets/og-image\.svg'

ALL_TRACKED=$(git ls-files | grep -Ev "$GLOBAL_EXCLUDE")

ERRORS=0
echo "calc-tools 옛 컨셉 잔재 회귀 방지 검사"
echo "================================================"

# 검사 1: 옛 사이트 카피
hits=$(echo "$ALL_TRACKED" | xargs -d '\n' grep -lE '16개의 무료 계산기|계산기 도구 모음' 2>/dev/null || true)
if [ -n "$hits" ]; then
  echo ""
  echo "❌ [옛 사이트 카피] 잔재 발견:"
  echo "$hits" | sed 's/^/    /'
  ERRORS=$((ERRORS + 1))
fi

# 검사 2: 옛 메타 잔재 (data-rates-year=2025 / 2024-58호 고시)
hits=$(echo "$ALL_TRACKED" | xargs -d '\n' grep -lE 'data-rates-year>2025년|고시 ?2024-58호' 2>/dev/null || true)
if [ -n "$hits" ]; then
  echo ""
  echo "❌ [옛 메타 잔재] 잔재 발견:"
  echo "$hits" | sed 's/^/    /'
  ERRORS=$((ERRORS + 1))
fi

# 검사 3: hardcoded site-header 재발 — 13개 도구 페이지에만 한정
# (가이드 글·payroll 도구·루트 페이지는 별도 미션으로 분리)
TOOL_13="finance/loan.html finance/compound.html finance/salary.html finance/vat.html finance/percent.html daily/age.html daily/dday.html daily/bmi.html daily/character-count.html stock/return-rate.html stock/averaging.html lotto/saju-pick.html privacy.html"
hits=""
for f in $TOOL_13; do
  if [ -f "$f" ] && grep -lE '<header class="site-header"|<footer class="site-footer' "$f" >/dev/null 2>&1; then
    hits="$hits$f"$'\n'
  fi
done
if [ -n "$hits" ]; then
  echo ""
  echo "❌ [hardcoded 헤더/푸터 재발 (13개 도구 페이지)] 잔재 발견:"
  echo -n "$hits" | sed 's/^/    /'
  ERRORS=$((ERRORS + 1))
fi

# 검사 4: 옛 placeholder
hits=$(echo "$ALL_TRACKED" | xargs -d '\n' grep -lE 'placeholder="예: 10,030"' 2>/dev/null || true)
if [ -n "$hits" ]; then
  echo ""
  echo "❌ [옛 placeholder] 잔재 발견:"
  echo "$hits" | sed 's/^/    /'
  ERRORS=$((ERRORS + 1))
fi

# 검사 5: 옛 보험료율 단정 표현 (2026 기준 정정 후 잔재)
# "국민연금 4.5%" 같은 단정문 — 정밀하게 매치
hits=$(echo "$ALL_TRACKED" | xargs -d '\n' grep -lE '국민연금[: ]*4\.5%[^0-9]|국민연금료율[은 ]*9%[^.]|건강보험[: ]*3\.545%' 2>/dev/null || true)
if [ -n "$hits" ]; then
  echo ""
  echo "❌ [옛 보험료율 단정 표현] 잔재 발견:"
  echo "$hits" | sed 's/^/    /'
  ERRORS=$((ERRORS + 1))
fi

echo ""
echo "================================================"
if [ $ERRORS -eq 0 ]; then
  echo "✅ 모든 검사 통과 — 옛 컨셉 잔재 없음"
  exit 0
else
  echo "❌ $ERRORS 개 카테고리에서 잔재 발견 — commit/push 전 정리 필요"
  echo ""
  echo "수정 후 다시 실행:"
  echo "  bash scripts/check-stale.sh"
  exit 1
fi
